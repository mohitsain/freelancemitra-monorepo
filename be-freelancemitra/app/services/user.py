"""User service - get or create from SSO."""
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import NextAuthPayload, get_provider_user_id
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse


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

    def to_response(self, user: User) -> UserResponse:
        return to_response(user)


user_service = UserService()
