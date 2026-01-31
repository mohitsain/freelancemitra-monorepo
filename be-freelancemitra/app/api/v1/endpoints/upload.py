"""Upload endpoints - presigned S3 URLs for onboarding file uploads."""
from fastapi import APIRouter, Depends, HTTPException, Query, status

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import NextAuthPayload, get_current_user_payload
from app.core.s3 import (
    ALLOWED_UPLOAD_CATEGORIES,
    build_user_file_key,
    generate_presigned_display_url,
    generate_presigned_upload_url,
    is_user_file_key,
)
from app.config import get_settings
from app.database import get_db
from app.schemas.response import ApiResponse
from app.schemas.upload import (
    DisplayUrlResponse,
    PresignedUploadRequest,
    PresignedUploadResponse,
)
from app.services.user import user_service

router = APIRouter()


def _check_s3_configured() -> None:
    settings = get_settings()
    if not settings.s3_bucket:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="S3 upload not configured",
        )
    if not settings.aws_access_key_id and not settings.aws_profile:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AWS credentials not configured (set AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or AWS_PROFILE)",
        )


@router.post("/presigned-url", response_model=ApiResponse[PresignedUploadResponse])
async def get_presigned_upload_url(
    body: PresignedUploadRequest,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """
    Get a presigned PUT URL to upload a file to S3.
    Files are stored under users/{user_id}/{category}/ (category: profile, resume, projects).
    Client should PUT the file to the returned URL; store the returned `key` in onboarding.
    """
    _check_s3_configured()
    category = (body.category or "profile").strip().lower()
    if category not in ALLOWED_UPLOAD_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Use one of: {sorted(ALLOWED_UPLOAD_CATEGORIES)}",
        )
    user = await user_service.get_or_create(db, payload)
    key = build_user_file_key(str(user.id), category, body.filename)
    upload_url = generate_presigned_upload_url(key, body.content_type)
    data = PresignedUploadResponse(upload_url=upload_url, key=key)
    return ApiResponse(success=True, data=data)


@router.get("/display-url", response_model=ApiResponse[DisplayUrlResponse])
async def get_display_url(
    key: str = Query(..., description="S3 object key (e.g. onboarding/{user_id}/profile/xxx.jpg)"),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """
    Get a presigned GET URL for an S3 object (e.g. profile picture, resume, project file).
    Key must be under users/ or onboarding/ (caller responsibility to pass own keys).
    """
    _check_s3_configured()
    if not key or not key.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="key required")
    if not is_user_file_key(key):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid key prefix (must be users/ or onboarding/)",
        )
    url = generate_presigned_display_url(key)
    if not url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not generate display URL",
        )
    return ApiResponse(success=True, data=DisplayUrlResponse(url=url))
