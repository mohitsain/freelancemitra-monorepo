"""Add last_step_index to user_onboarding for resume-from-step.

Revision ID: 005
Revises: 004
Create Date: 2025-01-01 00:00:00.000005

"""
from typing import Sequence, Union

from alembic import op

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE user_onboarding
        ADD COLUMN IF NOT EXISTS last_step_index INTEGER DEFAULT 0 NOT NULL
    """)


def downgrade() -> None:
    op.execute("ALTER TABLE user_onboarding DROP COLUMN IF EXISTS last_step_index")
