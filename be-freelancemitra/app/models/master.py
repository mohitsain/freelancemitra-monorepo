"""Master data models: Skill and Specialization (read-only reference data)."""
from sqlalchemy import Integer, String, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Skill(Base):
    """Skill master - name, category, display_order for UI."""

    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    __table_args__ = (
        Index("ix_skills_category", "category"),
        {"comment": "Master list of skills for onboarding"},
    )


class Specialization(Base):
    """Specialization master - name, category, display_order for UI."""

    __tablename__ = "specializations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    __table_args__ = (
        Index("ix_specializations_category", "category"),
        {"comment": "Master list of specializations for onboarding"},
    )


class Language(Base):
    """Language master - name, optional code, display_order for UI."""

    __tablename__ = "languages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(16), nullable=False, default="")
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    __table_args__ = (
        {"comment": "Master list of languages for onboarding"},
    )
