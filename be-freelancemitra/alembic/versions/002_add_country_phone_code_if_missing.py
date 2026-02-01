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
    # Only add column if user_onboarding exists (handles DBs where 001 was stamped but table missing).
    op.execute("""
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'user_onboarding'
          ) THEN
            ALTER TABLE user_onboarding
            ADD COLUMN IF NOT EXISTS country_phone_code VARCHAR(16) DEFAULT '';
          END IF;
        END $$;
    """)


def downgrade() -> None:
    op.execute("""
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'user_onboarding'
          ) AND EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'user_onboarding' AND column_name = 'country_phone_code'
          ) THEN
            ALTER TABLE user_onboarding DROP COLUMN country_phone_code;
          END IF;
        END $$;
    """)
