"""Onboarding / profile data - matches fe-freelancemitra OnboardingData."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text, Integer, Numeric, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class UserOnboarding(Base):
    """Onboarding profile data - one per user."""

    __tablename__ = "user_onboarding"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Basic Contact & Personal
    first_name: Mapped[str] = mapped_column(String(128), default="")
    last_name: Mapped[str] = mapped_column(String(128), default="")
    professional_title: Mapped[str] = mapped_column(String(256), default="")
    email: Mapped[str] = mapped_column(String(320), default="")  # from login only, not editable in onboarding
    country_phone_code: Mapped[str] = mapped_column(String(16), default="")
    phone_number: Mapped[str] = mapped_column(String(64), default="")
    city: Mapped[str] = mapped_column(String(128), default="")
    state: Mapped[str] = mapped_column(String(128), default="")
    country: Mapped[str] = mapped_column(String(128), default="")
    address_line_1: Mapped[str] = mapped_column(String(256), default="")
    address_line_2: Mapped[str] = mapped_column(String(256), default="")
    postal_code: Mapped[str] = mapped_column(String(32), default="")
    profile_picture: Mapped[str] = mapped_column(String(2048), default="")

    # Professional Overview
    headline: Mapped[str] = mapped_column(String(512), default="")
    short_summary: Mapped[str] = mapped_column(Text, default="")
    detailed_description: Mapped[str] = mapped_column(Text, default="")
    key_skills: Mapped[dict] = mapped_column(JSONB, default=list)
    areas_of_specialization: Mapped[dict] = mapped_column(JSONB, default=list)
    years_of_experience: Mapped[int] = mapped_column(Integer, default=0)
    languages_spoken: Mapped[str] = mapped_column(String(256), default="")

    # Portfolio
    portfolio_link: Mapped[str] = mapped_column(String(2048), default="")
    portfolio_samples: Mapped[dict] = mapped_column(JSONB, default=list)
    # User-uploaded files: list of { "key": str, "size": int }; max 5 files, 25MB total (enforced in frontend)
    uploaded_file_keys: Mapped[dict] = mapped_column(JSONB, default=list)

    # Experience & Education
    work_history: Mapped[dict] = mapped_column(JSONB, default=list)
    education: Mapped[dict] = mapped_column(JSONB, default=list)
    certifications: Mapped[dict] = mapped_column(JSONB, default=list)  # list of { title, description, file_key }

    # Availability & Rates
    availability: Mapped[str] = mapped_column(String(32), default="full-time")
    weekly_hours: Mapped[int] = mapped_column(Integer, default=40)
    start_date: Mapped[str] = mapped_column(String(32), default="")
    hourly_rate: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    project_based_rate: Mapped[str] = mapped_column(String(64), default="")
    retainer_rate: Mapped[str] = mapped_column(String(64), default="")
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    min_project_size: Mapped[str] = mapped_column(String(64), default="")

    # Social
    linkedin_url: Mapped[str] = mapped_column(String(2048), default="")
    other_social_media: Mapped[str] = mapped_column(String(2048), default="")
    personal_website: Mapped[str] = mapped_column(String(2048), default="")

    # Testimonials
    testimonials: Mapped[dict] = mapped_column(JSONB, default=list)

    # Resume: last step index the user was on (0-based)
    last_step_index: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["User"] = relationship("User", back_populates="onboarding")

    __table_args__ = (
        {"comment": "Onboarding profile data per user"},
    )
