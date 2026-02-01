"""Initial schema: users, user_onboarding, sessions, countries, states.

Revision ID: 001
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("provider", sa.String(32), nullable=False),
        sa.Column("provider_user_id", sa.String(256), nullable=False),
        sa.Column("email", sa.String(320), nullable=True),
        sa.Column("name", sa.String(256), nullable=True),
        sa.Column("image", sa.String(2048), nullable=True),
        sa.Column("onboarding_completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        comment="Users from SSO (Google/GitHub)",
    )
    op.create_index("ix_users_email", "users", ["email"], unique=False)
    op.create_index("ix_users_provider", "users", ["provider"], unique=False)
    op.create_index("ix_users_provider_user_id", "users", ["provider_user_id"], unique=False)

    op.create_table(
        "user_onboarding",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("first_name", sa.String(128), server_default="", nullable=False),
        sa.Column("last_name", sa.String(128), server_default="", nullable=False),
        sa.Column("professional_title", sa.String(256), server_default="", nullable=False),
        sa.Column("email", sa.String(320), server_default="", nullable=False),
        sa.Column("country_phone_code", sa.String(16), server_default="", nullable=False),
        sa.Column("phone_number", sa.String(64), server_default="", nullable=False),
        sa.Column("city", sa.String(128), server_default="", nullable=False),
        sa.Column("state", sa.String(128), server_default="", nullable=False),
        sa.Column("country", sa.String(128), server_default="", nullable=False),
        sa.Column("profile_picture", sa.String(2048), server_default="", nullable=False),
        sa.Column("headline", sa.String(512), server_default="", nullable=False),
        sa.Column("short_summary", sa.Text(), server_default="", nullable=False),
        sa.Column("detailed_description", sa.Text(), server_default="", nullable=False),
        sa.Column("key_skills", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("areas_of_specialization", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("years_of_experience", sa.Integer(), server_default="0", nullable=False),
        sa.Column("languages_spoken", sa.String(256), server_default="", nullable=False),
        sa.Column("portfolio_link", sa.String(2048), server_default="", nullable=False),
        sa.Column("portfolio_samples", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("work_history", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("education", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("certifications", sa.Text(), server_default="", nullable=False),
        sa.Column("availability", sa.String(32), server_default="full-time", nullable=False),
        sa.Column("weekly_hours", sa.Integer(), server_default="40", nullable=False),
        sa.Column("start_date", sa.String(32), server_default="", nullable=False),
        sa.Column("hourly_rate", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("project_based_rate", sa.String(64), server_default="", nullable=False),
        sa.Column("retainer_rate", sa.String(64), server_default="", nullable=False),
        sa.Column("currency", sa.String(8), server_default="USD", nullable=False),
        sa.Column("min_project_size", sa.String(64), server_default="", nullable=False),
        sa.Column("linkedin_url", sa.String(2048), server_default="", nullable=False),
        sa.Column("other_social_media", sa.String(2048), server_default="", nullable=False),
        sa.Column("personal_website", sa.String(2048), server_default="", nullable=False),
        sa.Column("testimonials", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_user_onboarding_user_id"),
        comment="Onboarding profile data per user",
    )
    op.create_index("ix_user_onboarding_user_id", "user_onboarding", ["user_id"], unique=False)

    op.create_table(
        "sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("token_id", sa.String(64), nullable=True),
        sa.Column("user_agent", sa.String(512), nullable=True),
        sa.Column("ip_address", sa.String(45), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        comment="Server-side session tracking",
    )
    op.create_index("ix_sessions_token_id", "sessions", ["token_id"], unique=False)
    op.create_index("ix_sessions_user_id", "sessions", ["user_id"], unique=False)

    op.create_table(
        "countries",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("code", sa.String(3), nullable=False),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("region", sa.String(64), server_default="", nullable=False),
        sa.Column("phone_code", sa.String(16), server_default="", nullable=False),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.PrimaryKeyConstraint("id"),
        comment="Countries with optional region for filtering",
    )
    op.create_index("ix_countries_code", "countries", ["code"], unique=True)
    op.create_index("ix_countries_region", "countries", ["region"], unique=False)

    op.create_table(
        "states",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("country_id", sa.Integer(), nullable=False),
        sa.Column("code", sa.String(32), nullable=False),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("display_order", sa.Integer(), server_default="0", nullable=False),
        sa.ForeignKeyConstraint(["country_id"], ["countries.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("country_id", "code", name="ix_states_country_code"),
        comment="States/provinces per country",
    )
    op.create_index("ix_states_country_id", "states", ["country_id"], unique=False)
    # Unique index on (country_id, code) is already created by UniqueConstraint above; do not create again.


def downgrade() -> None:
    op.drop_index("ix_states_country_code", "states")
    op.drop_index("ix_states_country_id", "states")
    op.drop_table("states")
    op.drop_index("ix_countries_region", "countries")
    op.drop_index("ix_countries_code", "countries")
    op.drop_table("countries")
    op.drop_index("ix_sessions_user_id", "sessions")
    op.drop_index("ix_sessions_token_id", "sessions")
    op.drop_table("sessions")
    op.drop_index("ix_user_onboarding_user_id", "user_onboarding")
    op.drop_table("user_onboarding")
    op.drop_index("ix_users_provider_user_id", "users")
    op.drop_index("ix_users_provider", "users")
    op.drop_index("ix_users_email", "users")
    op.drop_table("users")
