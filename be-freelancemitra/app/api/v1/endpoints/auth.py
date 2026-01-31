"""Auth endpoints - verify NextAuth JWT and return current user payload."""
from fastapi import APIRouter, Depends

from app.core.security import NextAuthPayload, get_current_user_payload
from app.schemas.response import ApiResponse

router = APIRouter()


@router.get("/verify", response_model=ApiResponse[dict])
async def verify_token(
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Verify Bearer token (NextAuth JWT). Returns decoded payload subset."""
    data = {
        "sub": payload.sub,
        "email": payload.email,
        "name": payload.name,
        "provider": payload.provider,
    }
    return ApiResponse(success=True, data=data)
