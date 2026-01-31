"""Add skills and specializations master tables.

Revision ID: 004
Revises: 003
Create Date: 2025-01-01 00:00:00.000004

"""
from typing import Sequence, Union

from alembic import op

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Idempotent: IF NOT EXISTS so migration can run when tables already exist (e.g. from create_all)
    op.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id SERIAL NOT NULL,
            name VARCHAR(128) NOT NULL,
            category VARCHAR(128) DEFAULT '' NOT NULL,
            display_order INTEGER DEFAULT 0 NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT uq_skills_name UNIQUE (name)
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_skills_name ON skills (name)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_skills_category ON skills (category)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS specializations (
            id SERIAL NOT NULL,
            name VARCHAR(128) NOT NULL,
            category VARCHAR(128) DEFAULT '' NOT NULL,
            display_order INTEGER DEFAULT 0 NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT uq_specializations_name UNIQUE (name)
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_specializations_name ON specializations (name)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_specializations_category ON specializations (category)")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_specializations_category")
    op.execute("DROP INDEX IF EXISTS ix_specializations_name")
    op.execute("DROP TABLE IF EXISTS specializations")
    op.execute("DROP INDEX IF EXISTS ix_skills_category")
    op.execute("DROP INDEX IF EXISTS ix_skills_name")
    op.execute("DROP TABLE IF EXISTS skills")
