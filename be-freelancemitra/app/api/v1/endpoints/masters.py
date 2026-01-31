"""Public endpoints for master data: skills, specializations, languages (no auth)."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.master import Skill, Specialization, Language
from app.schemas.master import SkillOut, SpecializationOut, LanguageOut
from app.schemas.response import ApiResponse
from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/skills", response_model=ApiResponse[list[SkillOut]])
async def list_skills(db: AsyncSession = Depends(get_db)):
    """List all skills. Ordered by display_order then name. No auth required."""
    q = select(Skill).order_by(Skill.display_order, Skill.name)
    result = await db.execute(q)
    rows = result.scalars().all()
    data = [SkillOut(id=s.id, name=s.name, category=s.category or "") for s in rows]
    return ApiResponse(success=True, data=data)


@router.get("/specializations", response_model=ApiResponse[list[SpecializationOut]])
async def list_specializations(db: AsyncSession = Depends(get_db)):
    """List all specializations. Ordered by display_order then name. No auth required."""
    q = select(Specialization).order_by(Specialization.display_order, Specialization.name)
    result = await db.execute(q)
    rows = result.scalars().all()
    data = [SpecializationOut(id=s.id, name=s.name, category=s.category or "") for s in rows]
    return ApiResponse(success=True, data=data)


@router.get("/languages", response_model=ApiResponse[list[LanguageOut]])
async def list_languages(db: AsyncSession = Depends(get_db)):
    """List all languages. Ordered by display_order then name. No auth required."""
    q = select(Language).order_by(Language.display_order, Language.name)
    result = await db.execute(q)
    rows = result.scalars().all()
    data = [LanguageOut(id=l.id, name=l.name, code=l.code or "") for l in rows]
    return ApiResponse(success=True, data=data)
