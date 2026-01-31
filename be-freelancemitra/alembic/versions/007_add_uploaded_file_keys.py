"""Add uploaded_file_keys (JSONB) to user_onboarding for multi-file uploads.

Revision ID: 007
Revises: 006
Create Date: 2025-01-01 00:00:00.000007

"""
from typing import Sequence, Union

from alembic import op

revision: str = "007"
down_revision: Union[str, None] = "006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE user_onboarding
        ADD COLUMN IF NOT EXISTS uploaded_file_keys JSONB DEFAULT '[]'::jsonb NOT NULL
    """)


def downgrade() -> None:
    op.execute("ALTER TABLE user_onboarding DROP COLUMN IF EXISTS uploaded_file_keys")
