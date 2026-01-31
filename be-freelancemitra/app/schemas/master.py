"""Response schemas for master data (skills, specializations)."""
from pydantic import BaseModel


class SkillOut(BaseModel):
    id: int
    name: str
    category: str


class SpecializationOut(BaseModel):
    id: int
    name: str
    category: str


class LanguageOut(BaseModel):
    id: int
    name: str
    code: str = ""
