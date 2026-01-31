"""User request/response schemas."""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    """Payload to create/update user from SSO."""

    provider: str
    provider_user_id: str
    email: str | None = None
    name: str | None = None
    image: str | None = None


class UserResponse(BaseModel):
    """User in API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    provider: str
    email: str | None
    name: str | None
    image: str | None
    onboarding_completed_at: datetime | None
    created_at: datetime
    updated_at: datetime


class BasicUserInfo(BaseModel):
    """Basic user info for header/sidebar - from user + onboarding (profile picture from onboarding)."""

    name: str
    email: str | None
    profile_picture_url: str | None
    role: str
