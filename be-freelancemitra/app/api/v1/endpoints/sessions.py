"""Session endpoints - list/revoke server-side sessions."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import NextAuthPayload, get_current_user_payload
from app.database import get_db
from app.models.session import Session
from app.schemas.response import ApiResponse
from app.schemas.session import SessionResponse
from app.services.user import user_service

router = APIRouter()


def _get_client_info(request: Request) -> tuple[str | None, str | None]:
    """Extract user_agent and ip from request."""
    ua = request.headers.get("user-agent")
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        ip = forwarded.split(",")[0].strip()
    else:
        ip = request.client.host if request.client else None
    return ua, ip


@router.get("", response_model=ApiResponse[list[SessionResponse]])
async def list_sessions(
    request: Request,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """List sessions for the current user."""
    user = await user_service.get_or_create(db, payload)
    result = await db.execute(
        select(Session).where(Session.user_id == user.id).order_by(Session.created_at.desc())
    )
    sessions = result.scalars().all()
    data = [
        SessionResponse(
            id=s.id,
            user_id=s.user_id,
            user_agent=s.user_agent,
            ip_address=s.ip_address,
            expires_at=s.expires_at,
            created_at=s.created_at,
        )
        for s in sessions
    ]
    return ApiResponse(success=True, data=data)


@router.post("", response_model=ApiResponse[SessionResponse])
async def create_session(
    request: Request,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Register current request as a session (call after login from FE)."""
    user = await user_service.get_or_create(db, payload)
    ua, ip = _get_client_info(request)
    session = Session(
        user_id=user.id,
        user_agent=ua,
        ip_address=ip,
    )
    db.add(session)
    await db.flush()
    data = SessionResponse(
        id=session.id,
        user_id=session.user_id,
        user_agent=session.user_agent,
        ip_address=session.ip_address,
        expires_at=session.expires_at,
        created_at=session.created_at,
    )
    return ApiResponse(success=True, data=data)


@router.delete("/{session_id}", response_model=ApiResponse[dict])
async def revoke_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Revoke a session by id (must belong to current user)."""
    user = await user_service.get_or_create(db, payload)
    result = await db.execute(
        select(Session).where(
            Session.id == session_id,
            Session.user_id == user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.flush()
    return ApiResponse(success=True, data={"ok": True})
