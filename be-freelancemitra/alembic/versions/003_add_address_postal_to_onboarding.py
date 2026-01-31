"""Add address_line_1, address_line_2, postal_code to user_onboarding.

Revision ID: 003
Revises: 36553ddb7f78
Create Date: 2025-01-01 00:00:00.000003

"""
from typing import Sequence, Union

from alembic import op

revision: str = "003"
down_revision: Union[str, None] = "36553ddb7f78"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE user_onboarding
        ADD COLUMN IF NOT EXISTS address_line_1 VARCHAR(256) DEFAULT ''
    """)
    op.execute("""
        ALTER TABLE user_onboarding
        ADD COLUMN IF NOT EXISTS address_line_2 VARCHAR(256) DEFAULT ''
    """)
    op.execute("""
        ALTER TABLE user_onboarding
        ADD COLUMN IF NOT EXISTS postal_code VARCHAR(32) DEFAULT ''
    """)


def downgrade() -> None:
    op.drop_column("user_onboarding", "address_line_1")
    op.drop_column("user_onboarding", "address_line_2")
    op.drop_column("user_onboarding", "postal_code")
