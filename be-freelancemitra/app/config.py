"""Application configuration."""
from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "FreelanceMitra API"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/freelancemitra"

    # NextAuth SSO (must match fe-freelancemitra)
    nextauth_secret: str = ""
    nextauth_url: Optional[str] = "http://localhost:3000"

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # S3 (FreelanceMitra bucket; use keys or AWS_PROFILE e.g. mohit.kumar)
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "ap-south-1"
    aws_profile: Optional[str] = None  # e.g. mohit.kumar for local CLI profile
    s3_bucket: str = "freelancemitra"

    # Temporal
    temporal_address: str = "localhost:7233"
    temporal_namespace: str = "default"
    temporal_task_queue: str = "freelancemitra-task-queue"

    # OpenAI (RAG Agent)
    openai_api_key: Optional[str] = None
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o-mini"


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
