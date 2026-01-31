"""S3 presigned URLs for user file uploads. Per-user folders by category."""
import uuid
from typing import Optional

import boto3
from botocore.exceptions import ClientError

from app.config import get_settings

# Allowed categories: each user gets users/{user_id}/{category}/...
ALLOWED_UPLOAD_CATEGORIES = frozenset({"profile", "projects"})


def _client():
    """Create S3 client (uses env keys or profile)."""
    settings = get_settings()
    kwargs = {"region_name": settings.aws_region}
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        kwargs["aws_access_key_id"] = settings.aws_access_key_id
        kwargs["aws_secret_access_key"] = settings.aws_secret_access_key
    elif settings.aws_profile:
        kwargs["profile_name"] = settings.aws_profile
    return boto3.client("s3", **kwargs)


def generate_presigned_upload_url(
    key: str,
    content_type: str,
    expires_in: int = 3600,
) -> str:
    """Return a presigned PUT URL for client upload."""
    client = _client()
    bucket = get_settings().s3_bucket
    return client.generate_presigned_url(
        "put_object",
        Params={"Bucket": bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=expires_in,
    )


def generate_presigned_display_url(key: str, expires_in: int = 3600) -> Optional[str]:
    """Return a presigned GET URL for displaying a private object. Returns None on error."""
    if not key or not key.strip():
        return None
    if key.startswith("http://") or key.startswith("https://"):
        return key
    try:
        client = _client()
        bucket = get_settings().s3_bucket
        return client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=expires_in,
        )
    except ClientError:
        return None


def build_user_file_key(user_id: str, category: str, filename: str) -> str:
    """
    Build S3 key: users/{user_id}/{category}/{uuid}.ext.
    Category must be in ALLOWED_UPLOAD_CATEGORIES (profile, resume, projects).
    """
    if category not in ALLOWED_UPLOAD_CATEGORIES:
        raise ValueError(f"Invalid category: {category}. Allowed: {list(ALLOWED_UPLOAD_CATEGORIES)}")
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[-1].lower()
    unique = str(uuid.uuid4())[:8]
    return f"users/{user_id}/{category}/{unique}{ext}"


def is_user_file_key(key: str) -> bool:
    """True if key is under users/ or legacy onboarding/ (for presigned display)."""
    return key.startswith("users/") or key.startswith("onboarding/")
