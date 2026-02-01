"""Proposals API: generate, list, get, and edit saved proposals."""
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import NextAuthPayload, get_current_user_payload
from app.database import get_db
from app.models.proposal_history import ProposalHistory
from app.schemas.response import ApiResponse
from app.services.onboarding import onboarding_service
from app.services.proposal import build_profile_summary, generate_personalized_proposal
from app.services.user import user_service

router = APIRouter()


class GenerateProposalRequest(BaseModel):
    """Request body for generating a personalized proposal."""

    job_description: str = Field(..., min_length=1, description="Client job description to respond to")
    client_name: str | None = Field(None, description="Client name (optional)")
    platform: str | None = Field(None, description="Platform e.g. Upwork, Freelancer, PeoplePerHour")
    job_budget: str | None = Field(None, description="Job budget provided by client (optional)")
    hourly_rate: str | None = Field(None, description="Hourly rate provided by client (optional)")


class ProposalItem(BaseModel):
    """Single saved proposal (list item or get one)."""

    id: uuid.UUID
    job_description: str
    client_name: str
    platform: str
    job_budget: str
    hourly_rate: str
    proposal: str
    created_at: str
    updated_at: str


class GenerateProposalResponse(BaseModel):
    """Response: generated proposal text and saved record id."""

    proposal: str
    id: uuid.UUID


class UpdateProposalRequest(BaseModel):
    """Request body for updating a saved proposal (all optional)."""

    job_description: str | None = None
    client_name: str | None = None
    platform: str | None = None
    job_budget: str | None = None
    hourly_rate: str | None = None
    proposal: str | None = None


class PaginatedProposals(BaseModel):
    """Paginated list of proposals."""

    items: list[ProposalItem] = Field(..., description="Proposals for the current page")
    total: int = Field(..., ge=0, description="Total number of proposals")


def _to_item(row: ProposalHistory) -> ProposalItem:
    return ProposalItem(
        id=row.id,
        job_description=row.job_description or "",
        client_name=getattr(row, "client_name", "") or "",
        platform=row.platform or "",
        job_budget=row.job_budget or "",
        hourly_rate=row.hourly_rate or "",
        proposal=row.proposal or "",
        created_at=row.created_at.isoformat() if row.created_at else "",
        updated_at=row.updated_at.isoformat() if row.updated_at else "",
    )


@router.post("/generate", response_model=ApiResponse[GenerateProposalResponse])
async def generate_proposal(
    body: GenerateProposalRequest,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """
    Generate a personalized proposal for the current user and save it to the database.
    Uses the user's onboarding/portfolio data. Returns the proposal text and saved record id.
    """
    user = await user_service.get_or_create(db, payload)
    ob = await onboarding_service.get_by_user_id(db, user.id)
    if not ob:
        raise HTTPException(
            status_code=400,
            detail="Complete onboarding first so your profile and portfolio can be used for the proposal.",
        )
    profile_summary = build_profile_summary(ob)
    proposal_text = await generate_personalized_proposal(
        job_description=body.job_description,
        profile_summary=profile_summary,
        platform=body.platform,
        job_budget=body.job_budget,
        hourly_rate=body.hourly_rate,
    )
    row = ProposalHistory(
        user_id=user.id,
        job_description=body.job_description.strip(),
        client_name=(body.client_name or "").strip(),
        platform=(body.platform or "").strip(),
        job_budget=(body.job_budget or "").strip(),
        hourly_rate=(body.hourly_rate or "").strip(),
        proposal=proposal_text,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return ApiResponse(
        success=True,
        data=GenerateProposalResponse(proposal=proposal_text, id=row.id),
    )


@router.get("", response_model=ApiResponse[PaginatedProposals])
async def list_proposals(
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(5, ge=1, le=50, description="Items per page"),
):
    """List the current user's saved proposals, newest first, with pagination."""
    user = await user_service.get_or_create(db, payload)
    count_result = await db.execute(
        select(func.count()).select_from(ProposalHistory).where(ProposalHistory.user_id == user.id)
    )
    total = count_result.scalar_one() or 0
    offset = (page - 1) * page_size
    result = await db.execute(
        select(ProposalHistory)
        .where(ProposalHistory.user_id == user.id)
        .order_by(ProposalHistory.created_at.desc())
        .limit(page_size)
        .offset(offset)
    )
    rows = result.scalars().all()
    return ApiResponse(
        success=True,
        data=PaginatedProposals(items=[_to_item(r) for r in rows], total=total),
    )


@router.get("/{proposal_id}", response_model=ApiResponse[ProposalItem])
async def get_proposal(
    proposal_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Get a single saved proposal by id (must belong to current user)."""
    user = await user_service.get_or_create(db, payload)
    result = await db.execute(
        select(ProposalHistory).where(
            ProposalHistory.id == proposal_id,
            ProposalHistory.user_id == user.id,
        )
    )
    row = result.scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return ApiResponse(success=True, data=_to_item(row))


@router.patch("/{proposal_id}", response_model=ApiResponse[ProposalItem])
async def update_proposal(
    proposal_id: uuid.UUID,
    body: UpdateProposalRequest,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Update a saved proposal (any subset of fields). Must belong to current user."""
    user = await user_service.get_or_create(db, payload)
    result = await db.execute(
        select(ProposalHistory).where(
            ProposalHistory.id == proposal_id,
            ProposalHistory.user_id == user.id,
        )
    )
    row = result.scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Proposal not found")
    if body.job_description is not None:
        row.job_description = body.job_description
    if body.client_name is not None:
        row.client_name = body.client_name
    if body.platform is not None:
        row.platform = body.platform
    if body.job_budget is not None:
        row.job_budget = body.job_budget
    if body.hourly_rate is not None:
        row.hourly_rate = body.hourly_rate
    if body.proposal is not None:
        row.proposal = body.proposal
    await db.commit()
    await db.refresh(row)
    return ApiResponse(success=True, data=_to_item(row))


@router.delete("/{proposal_id}", response_model=ApiResponse[None])
async def delete_proposal(
    proposal_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    payload: NextAuthPayload = Depends(get_current_user_payload),
):
    """Delete a saved proposal. Must belong to current user."""
    user = await user_service.get_or_create(db, payload)
    result = await db.execute(
        select(ProposalHistory).where(
            ProposalHistory.id == proposal_id,
            ProposalHistory.user_id == user.id,
        )
    )
    row = result.scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Proposal not found")
    await db.delete(row)
    await db.commit()
    return ApiResponse(success=True, data=None)
