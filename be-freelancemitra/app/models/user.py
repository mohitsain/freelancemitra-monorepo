"""User model - synced from SSO (Google/GitHub)."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.session import Session
    from app.models.onboarding import UserOnboarding
    from app.models.proposal_history import ProposalHistory


class User(Base):
    """User account - created/updated from NextAuth SSO."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    provider: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    provider_user_id: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True, index=True)
    name: Mapped[str | None] = mapped_column(String(256), nullable=True)
    image: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    onboarding_completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    sessions: Mapped[list["Session"]] = relationship(
        "Session",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    onboarding: Mapped["UserOnboarding | None"] = relationship(
        "UserOnboarding",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    proposal_history: Mapped[list["ProposalHistory"]] = relationship(
        "ProposalHistory",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        {"comment": "Users from SSO (Google/GitHub)"},
    )
