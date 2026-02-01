"""add_xyz_column

Revision ID: 36553ddb7f78
Revises: 002
Create Date: 2026-01-31 14:47:58.704714

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '36553ddb7f78'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_column(conn, table: str, column: str) -> bool:
    return conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.columns "
            "WHERE table_schema = 'public' AND table_name = :t AND column_name = :c"
        ),
        {"t": table, "c": column},
    ).scalar() is not None


def upgrade() -> None:
    conn = op.get_bind()
    has_countries = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'countries'"
        )
    ).scalar() is not None
    has_states = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'states'"
        )
    ).scalar() is not None
    has_user_onboarding = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'user_onboarding'"
        )
    ).scalar() is not None

    if has_countries:
        if not _has_column(conn, "countries", "phone_code"):
            op.add_column("countries", sa.Column("phone_code", sa.String(length=16), nullable=False, server_default=""))
        if not _has_column(conn, "countries", "display_order"):
            op.add_column("countries", sa.Column("display_order", sa.Integer(), nullable=False, server_default=sa.text("0")))
        op.execute(sa.text("ALTER TABLE countries ALTER COLUMN region SET NOT NULL"))
        op.execute(sa.text("ALTER TABLE countries DROP CONSTRAINT IF EXISTS countries_code_key"))
        op.execute(sa.text("CREATE UNIQUE INDEX IF NOT EXISTS ix_countries_code ON countries (code)"))
        op.execute(sa.text("CREATE INDEX IF NOT EXISTS ix_countries_region ON countries (region)"))
        op.execute(sa.text("COMMENT ON TABLE countries IS 'Countries with optional region for filtering'"))
    if has_states:
        if not _has_column(conn, "states", "display_order"):
            op.add_column("states", sa.Column("display_order", sa.Integer(), nullable=False, server_default=sa.text("0")))
        op.execute(sa.text("COMMENT ON TABLE states IS 'States/provinces per country'"))
    if has_user_onboarding:
        op.execute(sa.text("ALTER TABLE user_onboarding ALTER COLUMN country_phone_code SET NOT NULL"))


def downgrade() -> None:
    conn = op.get_bind()
    has_countries = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'countries'"
        )
    ).scalar() is not None
    has_states = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'states'"
        )
    ).scalar() is not None
    has_user_onboarding = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'user_onboarding'"
        )
    ).scalar() is not None

    if has_user_onboarding:
        op.alter_column('user_onboarding', 'country_phone_code',
                   existing_type=sa.VARCHAR(length=16),
                   nullable=True,
                   existing_server_default=sa.text("''::character varying"))
    if has_states:
        op.drop_table_comment(
            'states',
            existing_comment='States/provinces per country',
            schema=None
        )
        op.drop_column('states', 'display_order')
    if has_countries:
        op.drop_table_comment(
            'countries',
            existing_comment='Countries with optional region for filtering',
            schema=None
        )
        op.drop_index('ix_countries_region', table_name='countries')
        op.drop_index(op.f('ix_countries_code'), table_name='countries')
        op.create_unique_constraint('countries_code_key', 'countries', ['code'], postgresql_nulls_not_distinct=False)
        op.alter_column('countries', 'region',
                   existing_type=sa.VARCHAR(length=64),
                   nullable=True,
                   existing_server_default=sa.text("''::character varying"))
        op.drop_column('countries', 'display_order')
        op.drop_column('countries', 'phone_code')
