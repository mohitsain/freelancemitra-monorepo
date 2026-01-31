"""Add languages master table.

Revision ID: 006
Revises: 005
Create Date: 2025-01-01 00:00:00.000006

"""
from typing import Sequence, Union

from alembic import op

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS languages (
            id SERIAL NOT NULL,
            name VARCHAR(128) NOT NULL,
            code VARCHAR(16) DEFAULT '' NOT NULL,
            display_order INTEGER DEFAULT 0 NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT uq_languages_name UNIQUE (name)
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_languages_name ON languages (name)")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_languages_name")
    op.execute("DROP TABLE IF EXISTS languages")
