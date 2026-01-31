"""User endpoints - me (get or create from SSO), basic info for header/sidebar."""
from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import NextAuthPayload, get_current_user_payload
from app.database import get_db
from app.schemas.response import ApiResponse
from app.schemas.user import BasicUserInfo, UserResponse
from app.services.user import user_service

router = APIRouter()


@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_me(
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Get current user. Creates user from SSO if first time."""
    user = await user_service.get_or_create(db, payload)
    return ApiResponse(success=True, data=user_service.to_response(user))


@router.get("/me/basic-info", response_model=ApiResponse[BasicUserInfo])
async def get_me_basic_info(
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Get basic user info for header/sidebar (name, email, profile picture from onboarding, role)."""
    user = await user_service.get_or_create(db, payload)
    data = await user_service.get_basic_info(db, user)
    return ApiResponse(success=True, data=data)
