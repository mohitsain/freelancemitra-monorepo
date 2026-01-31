"""Add country_phone_code to user_onboarding if missing (for DBs created before this column).

Revision ID: 002
Revises: 001
Create Date: 2025-01-01 00:00:00.000001

"""
from typing import Sequence, Union

from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE user_onboarding
        ADD COLUMN IF NOT EXISTS country_phone_code VARCHAR(16) DEFAULT ''
    """)


def downgrade() -> None:
    op.drop_column("user_onboarding", "country_phone_code")
