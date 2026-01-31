"""NextAuth token validation via frontend session endpoint."""
import httpx
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyCookie, HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.config import get_settings

# NextAuth session cookie name (must match frontend)
NEXTAUTH_SESSION_COOKIE = "next-auth.session-token"

bearer_scheme = HTTPBearer(auto_error=False)
cookie_scheme = APIKeyCookie(name=NEXTAUTH_SESSION_COOKIE, auto_error=False)


class NextAuthPayload(BaseModel):
    """Decoded NextAuth JWT payload (matches fe-freelancemitra jwt callback)."""

    sub: str  # provider user id
    email: str | None = None
    name: str | None = None
    picture: str | None = None
    id: str | None = None  # set in jwt callback
    provider: str | None = None  # google | github
    iat: int | None = None
    exp: int | None = None


async def decode_nextauth_token(token: str) -> NextAuthPayload:
    """Validate token by calling the frontend /api/auth/session/validate endpoint."""
    settings = get_settings()
    if not settings.nextauth_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="NextAuth URL not configured",
        )
    validate_url = settings.nextauth_url.rstrip("/") + "/api/auth/session/validate"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                validate_url,
                headers={"Authorization": f"Bearer {token}"},
            )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Session service unreachable: {e!s}",
        ) from e

    if resp.status_code == 401:
        try:
            detail = resp.json().get("error", "Invalid or expired token")
        except Exception:
            detail = "Invalid or expired token"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
        )
    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Session validation failed",
        )

    data = resp.json()
    return NextAuthPayload(
        sub=data.get("sub", ""),
        email=data.get("email"),
        name=data.get("name"),
        picture=data.get("picture"),
        id=data.get("id"),
        provider=data.get("provider"),
        iat=data.get("iat"),
        exp=data.get("exp"),
    )


def get_provider_user_id(payload: NextAuthPayload) -> str:
    """Provider-scoped user id (prefer id from callback, else sub)."""
    return payload.id or payload.sub or ""


async def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
    cookie_token: str | None = Security(cookie_scheme),
) -> NextAuthPayload:
    """Dependency: require Bearer token or next-auth.session-token cookie; validate via frontend session endpoint."""
    token: str | None = None
    if credentials and credentials.scheme.lower() == "bearer":
        token = credentials.credentials
    if not token and cookie_token:
        token = cookie_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization (Bearer token or next-auth.session-token cookie)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return await decode_nextauth_token(token)
