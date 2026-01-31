"""Onboarding endpoints - submit and get onboarding data."""
from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import NextAuthPayload, get_current_user_payload
from app.core.s3 import generate_presigned_display_url, is_user_file_key
from app.database import get_db
from app.schemas.onboarding import (
    OnboardingCreate,
    OnboardingResponse,
    OnboardingStatus,
)
from app.schemas.response import ApiResponse
from app.services.user import user_service
from app.services.onboarding import onboarding_service

router = APIRouter()


def _response_with_file_urls(resp: OnboardingResponse) -> OnboardingResponse:
    """Replace profile_picture S3 key with presigned GET URL for display."""
    if not resp.profile_picture or not is_user_file_key(resp.profile_picture):
        return resp
    url = generate_presigned_display_url(resp.profile_picture)
    if url:
        return resp.model_copy(update={"profile_picture": url})
    return resp


@router.get("/status", response_model=ApiResponse[OnboardingStatus])
async def get_onboarding_status(
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Get onboarding completion status for current user."""
    user = await user_service.get_or_create(db, payload)
    data = onboarding_service.to_status(user)
    return ApiResponse(success=True, data=data)


@router.get("", response_model=ApiResponse[OnboardingResponse | None])
async def get_onboarding(
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Get onboarding data for current user. Returns null if not submitted yet."""
    user = await user_service.get_or_create(db, payload)
    ob = await onboarding_service.get_by_user_id(db, user.id)
    data = onboarding_service.to_response(ob) if ob else None
    if data:
        data = _response_with_file_urls(data)
    return ApiResponse(success=True, data=data)


@router.post("", response_model=ApiResponse[OnboardingResponse])
async def submit_onboarding(
    body: OnboardingCreate,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Create or update onboarding data and mark user as onboarding completed."""
    user = await user_service.get_or_create(db, payload)
    ob = await onboarding_service.upsert(
        db,
        user.id,
        body,
        mark_completed=True,
    )
    await db.refresh(ob)  # load server-generated fields (e.g. updated_at) in async context
    resp = onboarding_service.to_response(ob)
    return ApiResponse(success=True, data=_response_with_file_urls(resp))


@router.patch("", response_model=ApiResponse[OnboardingResponse])
async def update_onboarding(
    body: OnboardingCreate,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Update onboarding data (partial update via same payload)."""
    user = await user_service.get_or_create(db, payload)
    ob = await onboarding_service.upsert(
        db,
        user.id,
        body,
        mark_completed=False,
    )
    await db.refresh(ob)  # load server-generated fields (e.g. updated_at) in async context
    resp = onboarding_service.to_response(ob)
    return ApiResponse(success=True, data=_response_with_file_urls(resp))
