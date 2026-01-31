"""Request/response schemas for S3 presigned upload."""

from pydantic import BaseModel, Field


class PresignedUploadRequest(BaseModel):
    """Request body for presigned upload URL."""

    filename: str = Field(..., min_length=1, description="Original filename (used for extension)")
    content_type: str = Field(..., min_length=1, description="MIME type, e.g. image/jpeg")
    category: str = Field(
        default="profile",
        description="Folder under user: profile, resume, or projects (users/{user_id}/{category}/)",
    )


class PresignedUploadResponse(BaseModel):
    """Response: upload URL and final S3 key to store."""

    upload_url: str = Field(..., description="Presigned PUT URL; client uploads with PUT and this Content-Type")
    key: str = Field(..., description="S3 object key: users/{user_id}/{category}/...")


class DisplayUrlResponse(BaseModel):
    """Response: presigned GET URL for displaying a private object."""

    url: str = Field(..., description="Presigned GET URL (expires in 1 hour)")
