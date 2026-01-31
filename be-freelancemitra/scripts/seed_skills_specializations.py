"""
Seed skills, specializations, and languages master tables from JSON or embedded data.

Usage:
  From be-freelancemitra: python scripts/seed_skills_specializations.py

Optional env vars:
  SKILLS_JSON_PATH, SPECIALIZATIONS_JSON_PATH, LANGUAGES_JSON_PATH
Defaults: app/data/skills.json, app/data/specializations.json, app/data/languages.json

If JSON files are missing, small embedded fallbacks are used so the API returns data.
Languages are used by GET /api/v1/languages; frontend loads them via getLanguages().
"""
import asyncio
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.master import Skill, Specialization, Language

DATA_DIR = Path(__file__).resolve().parent.parent / "app" / "data"

# Fallback if JSON not found (minimal set)
SKILLS_FALLBACK = [
    {"name": "JavaScript", "category": "Programming Languages"},
    {"name": "Python", "category": "Programming Languages"},
    {"name": "React", "category": "Web Technologies"},
    {"name": "Figma", "category": "Design Tools"},
    {"name": "SEO", "category": "Marketing & SEO"},
]
SPECIALIZATIONS_FALLBACK = [
    {"name": "E-commerce Websites", "category": "Web Development"},
    {"name": "UI Design", "category": "Design"},
    {"name": "SEO Content Writing", "category": "Content & Writing"},
]
LANGUAGES_FALLBACK = [
    {"name": "English", "code": "en"},
    {"name": "Hindi", "code": "hi"},
    {"name": "Spanish", "code": "es"},
]


def load_json(path: Path) -> list[dict] | None:
    if not path.exists():
        return None
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else None


async def seed():
    skills_path = Path(os.environ.get("SKILLS_JSON_PATH", str(DATA_DIR / "skills.json")))
    specs_path = Path(os.environ.get("SPECIALIZATIONS_JSON_PATH", str(DATA_DIR / "specializations.json")))
    langs_path = Path(os.environ.get("LANGUAGES_JSON_PATH", str(DATA_DIR / "languages.json")))

    skills_data = load_json(skills_path) or SKILLS_FALLBACK
    specs_data = load_json(specs_path) or SPECIALIZATIONS_FALLBACK
    languages_data = load_json(langs_path) or LANGUAGES_FALLBACK

    async with AsyncSessionLocal() as session:
        for i, row in enumerate(skills_data):
            name = (row.get("name") or "").strip()
            category = (row.get("category") or "").strip()
            if not name:
                continue
            existing = await session.execute(select(Skill).where(Skill.name == name))
            if existing.scalar_one_or_none() is None:
                session.add(Skill(name=name, category=category, display_order=i))

        for i, row in enumerate(specs_data):
            name = (row.get("name") or "").strip()
            category = (row.get("category") or "").strip()
            if not name:
                continue
            existing = await session.execute(select(Specialization).where(Specialization.name == name))
            if existing.scalar_one_or_none() is None:
                session.add(Specialization(name=name, category=category, display_order=i))

        for i, row in enumerate(languages_data):
            name = (row.get("name") or "").strip()
            code = (row.get("code") or "").strip()
            if not name:
                continue
            existing = await session.execute(select(Language).where(Language.name == name))
            if existing.scalar_one_or_none() is None:
                session.add(Language(name=name, code=code, display_order=i))

        await session.commit()
    print(f"Seeded {len(skills_data)} skills, {len(specs_data)} specializations, {len(languages_data)} languages (new rows only).")


def main():
    asyncio.run(seed())


if __name__ == "__main__":
    main()
