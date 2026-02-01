"""Add proposal_history table for saved proposals.

Revision ID: 009
Revises: 008
Create Date: 2025-01-01 00:00:00.000009

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "009"
down_revision: Union[str, None] = "008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    result = conn.execute(
        sa.text(
            "SELECT EXISTS (SELECT 1 FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_name = 'proposal_history')"
        )
    )
    table_exists = result.scalar()
    if not table_exists:
        op.create_table(
            "proposal_history",
            sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("job_description", sa.Text(), nullable=False),
            sa.Column("platform", sa.String(64), server_default="", nullable=False),
            sa.Column("job_budget", sa.String(128), server_default="", nullable=False),
            sa.Column("hourly_rate", sa.String(128), server_default="", nullable=False),
            sa.Column("proposal", sa.Text(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
            comment="Saved AI-generated proposals per user",
        )
    # Create index only if it doesn't exist (table may have been created by create_all)
    result = conn.execute(
        sa.text(
            "SELECT EXISTS (SELECT 1 FROM pg_indexes "
            "WHERE schemaname = 'public' AND indexname = 'ix_proposal_history_user_id')"
        )
    )
    index_exists = result.scalar()
    if not index_exists:
        op.create_index("ix_proposal_history_user_id", "proposal_history", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_proposal_history_user_id", table_name="proposal_history")
    op.drop_table("proposal_history")
