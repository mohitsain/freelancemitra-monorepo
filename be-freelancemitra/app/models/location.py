"""Country and State (subdivision) models for locations."""
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    pass


class Country(Base):
    """Country - ISO 3166-1, name, code (abbreviation), phone_code, optional region. display_order for UI."""

    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(3), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    region: Mapped[str] = mapped_column(String(64), default="")
    phone_code: Mapped[str] = mapped_column(String(16), default="")
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    states: Mapped[list["State"]] = relationship(
        "State",
        back_populates="country",
        cascade="all, delete-orphan",
        lazy="selectin",  # load states when country is loaded (optional; we usually fetch separately)
    )

    __table_args__ = (
        Index("ix_countries_region", "region"),
        {"comment": "Countries with optional region for filtering"},
    )


class State(Base):
    """State / province / subdivision of a country. display_order for UI."""

    __tablename__ = "states"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    country_id: Mapped[int] = mapped_column(
        ForeignKey("countries.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    code: Mapped[str] = mapped_column(String(32), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    country: Mapped["Country"] = relationship("Country", back_populates="states")

    __table_args__ = (
        Index("ix_states_country_id", "country_id"),
        Index("ix_states_country_code", "country_id", "code", unique=True),
        {"comment": "States/provinces per country"},
    )
