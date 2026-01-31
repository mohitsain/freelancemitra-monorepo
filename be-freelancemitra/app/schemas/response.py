"""Standard API response envelope for all endpoints."""
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiErrorDetail(BaseModel):
    """Error payload in standard response."""

    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error message")
    detail: str | None = Field(None, description="Additional detail if any")


class ApiResponse(BaseModel, Generic[T]):
    """Standard envelope: success, data (on success), error (on failure)."""

    success: bool = Field(..., description="True if request succeeded")
    data: T | None = Field(None, description="Response payload when success=True")
    message: str | None = Field(None, description="Optional short message")
    error: ApiErrorDetail | None = Field(None, description="Error info when success=False")
