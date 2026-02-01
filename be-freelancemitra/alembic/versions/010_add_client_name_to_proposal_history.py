"""Add client_name to proposal_history.

Revision ID: 010
Revises: 009
Create Date: 2025-01-01 00:00:00.000010

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "010"
down_revision: Union[str, None] = "009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "proposal_history",
        sa.Column("client_name", sa.String(256), server_default="", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("proposal_history", "client_name")
