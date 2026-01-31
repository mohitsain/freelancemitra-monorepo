"""Change certifications from TEXT to JSONB - list of { title, description, file_key }.

Revision ID: 008
Revises: 007
Create Date: 2025-01-01 00:00:00.000008

"""
from typing import Sequence, Union

from alembic import op

revision: str = "008"
down_revision: Union[str, None] = "007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        ALTER TABLE user_onboarding
        ALTER COLUMN certifications TYPE JSONB
        USING (
            CASE
                WHEN certifications IS NULL OR TRIM(certifications) = '' THEN '[]'::jsonb
                ELSE jsonb_build_array(
                    jsonb_build_object('title', '', 'description', certifications, 'file_key', '')
                )
            END
        )
    """)


def downgrade() -> None:
    op.execute("""
        ALTER TABLE user_onboarding
        ALTER COLUMN certifications TYPE TEXT
        USING (
            CASE
                WHEN jsonb_array_length(certifications) = 0 THEN ''
                ELSE (certifications->0->>'description')
            END
        )
    """)

