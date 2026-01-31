"""User service - get or create from SSO; basic user info for header/sidebar."""
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import NextAuthPayload, get_provider_user_id
from app.core.s3 import generate_presigned_display_url, is_user_file_key
from app.models.user import User
from app.schemas.user import BasicUserInfo, UserCreate, UserResponse
from app.services.onboarding import onboarding_service


async def get_or_create_user(
    db: AsyncSession,
    payload: NextAuthPayload,
) -> User:
    """Get existing user by provider + provider_user_id or create one."""
    provider = (payload.provider or "google").lower()
    provider_user_id = get_provider_user_id(payload)
    if not provider_user_id:
        provider_user_id = payload.sub

    result = await db.execute(
        select(User).where(
            User.provider == provider,
            User.provider_user_id == provider_user_id,
        )
    )
    user = result.scalar_one_or_none()
    if user:
        # Update name/email/image from token
        user.name = payload.name or user.name
        user.email = payload.email or user.email
        user.image = payload.picture or user.image
        await db.flush()
        return user

    create = UserCreate(
        provider=provider,
        provider_user_id=provider_user_id,
        email=payload.email,
        name=payload.name,
        image=payload.picture,
    )
    user = User(
        provider=create.provider,
        provider_user_id=create.provider_user_id,
        email=create.email,
        name=create.name,
        image=create.image,
    )
    db.add(user)
    await db.flush()
    return user


async def get_user_by_id(db: AsyncSession, user_id: UUID) -> User | None:
    """Get user by primary key."""
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_basic_user_info(db: AsyncSession, user: User) -> BasicUserInfo:
    """Build basic user info from user + onboarding (profile picture from onboarding)."""
    ob = await onboarding_service.get_by_user_id(db, user.id)
    # Name: prefer onboarding first_name + last_name, else user.name
    if ob and (ob.first_name or ob.last_name):
        name = " ".join((ob.first_name or "", ob.last_name or "")).strip() or (user.name or "User")
    else:
        name = user.name or "User"
    # Email: user.email or onboarding
    email = user.email or (ob.email if ob else None) or None
    # Profile picture: from S3 only (onboarding upload) -> presigned URL; reduced size via longer expiry only, image displayed small in UI
    profile_picture_url: str | None = None
    if ob and ob.profile_picture and is_user_file_key(ob.profile_picture):
        profile_picture_url = generate_presigned_display_url(ob.profile_picture)
    return BasicUserInfo(
        name=name,
        email=email,
        profile_picture_url=profile_picture_url,
        role="Freelancer",
    )


def to_response(user: User) -> UserResponse:
    """Map User model to UserResponse."""
    return UserResponse(
        id=user.id,
        provider=user.provider,
        email=user.email,
        name=user.name,
        image=user.image,
        onboarding_completed_at=user.onboarding_completed_at,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


class UserService:
    """User service facade."""

    async def get_or_create(self, db: AsyncSession, payload: NextAuthPayload) -> User:
        return await get_or_create_user(db, payload)

    async def get_by_id(self, db: AsyncSession, user_id: UUID) -> User | None:
        return await get_user_by_id(db, user_id)

    async def get_basic_info(self, db: AsyncSession, user: User) -> BasicUserInfo:
        return await get_basic_user_info(db, user)

    def to_response(self, user: User) -> UserResponse:
        return to_response(user)


user_service = UserService()
