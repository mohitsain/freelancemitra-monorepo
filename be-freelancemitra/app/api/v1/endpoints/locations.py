"""Public endpoints for countries and states (no auth)."""
from fastapi import APIRouter, Depends, Query

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.location import Country, State
from app.schemas.location import CountryOut, StateOut
from app.schemas.response import ApiResponse

router = APIRouter()


@router.get("/countries", response_model=ApiResponse[list[CountryOut]])
async def list_countries(
    db: AsyncSession = Depends(get_db),
    region: str | None = Query(None, description="Filter by region"),
):
    """List all countries, optionally filtered by region. Ordered by display_order then name."""
    q = select(Country).order_by(Country.display_order, Country.name)
    if region:
        q = q.where(Country.region == region)
    result = await db.execute(q)
    rows = result.scalars().all()
    data = [
        CountryOut(
            code=c.code,
            name=c.name,
            region=c.region or "",
            phone_code=getattr(c, "phone_code", None) or "",
            display_order=getattr(c, "display_order", 0) or 0,
        )
        for c in rows
    ]
    return ApiResponse(success=True, data=data)


@router.get("/countries/regions", response_model=ApiResponse[list[str]])
async def list_regions(db: AsyncSession = Depends(get_db)):
    """List distinct region names for filtering. No auth required."""
    q = select(Country.region).where(Country.region != "").distinct().order_by(Country.region)
    result = await db.execute(q)
    data = [r[0] for r in result.all()]
    return ApiResponse(success=True, data=data)


@router.get("/countries/{country_code}/states", response_model=ApiResponse[list[StateOut]])
async def list_states_by_country(
    country_code: str,
    db: AsyncSession = Depends(get_db),
):
    """List states for a country by ISO 3166-1 alpha-2 code (e.g. US, IN). No auth required."""
    q = select(Country).where(Country.code == country_code.upper())
    res = await db.execute(q)
    country = res.scalars().one_or_none()
    if not country:
        return ApiResponse(success=True, data=[])
    q2 = select(State).where(State.country_id == country.id).order_by(State.display_order, State.name)
    result = await db.execute(q2)
    states = result.scalars().all()
    data = [StateOut(code=s.code, name=s.name) for s in states]
    return ApiResponse(success=True, data=data)
