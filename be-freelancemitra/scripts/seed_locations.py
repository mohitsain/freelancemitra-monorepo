"""
Seed countries and states from a JSON file.

Phone codes are master data: saved by us (from app/data/country_dial_codes.json), not by users.
Run scripts/build_country_dial_codes.py to regenerate country_dial_codes.json if needed.

JSON format (e.g. from https://github.com/stefanbinder/countries-states):
  [ { "code2": "US", "name": "United States", "region": "Americas", "states": [ {"code": "CA", "name": "California"}, ... ] }, ... ]

Usage:
  From repo root (be-freelancemitra): python scripts/seed_locations.py [path/to/countries.json]
  Or set LOCATIONS_JSON_PATH env var. Default: app/data/countries-states.json

Download the JSON:
  curl -o app/data/countries-states.json https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json
"""
import asyncio
import json
import os
import sys
from pathlib import Path

# Add app to path when running as script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text

from app.database import AsyncSessionLocal, engine
from app.models.location import Country, State

DATA_DIR = Path(__file__).resolve().parent.parent / "app" / "data"


def load_json(path: str) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_dial_codes() -> dict[str, str]:
    """Load master phone codes (ISO 3166-1 alpha-2 -> E.164 dial code)."""
    path = DATA_DIR / "country_dial_codes.json"
    if path.exists():
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}


def normalize_region(raw: str | None) -> str:
    if not raw:
        return ""
    r = (raw or "").strip()
    # Map common region names to a small set for UI filters
    region_map = {
        "Americas": "Americas",
        "Africa": "Africa",
        "Asia": "Asia",
        "Europe": "Europe",
        "Oceania": "Oceania",
        "Antarctica": "Antarctica",
        "Polar": "Polar",
    }
    return region_map.get(r, r) if r else ""


async def seed_from_json(json_path: str, dial_codes: dict[str, str]) -> tuple[int, int]:
    data = load_json(json_path)
    total_states = 0
    async with AsyncSessionLocal() as session:
        # Clear existing (optional; comment out to only add new)
        await session.execute(State.__table__.delete())
        await session.execute(Country.__table__.delete())
        await session.commit()

        for idx, item in enumerate(data):
            code = (item.get("code2") or item.get("code") or "").strip()
            name = (item.get("name") or "").strip()
            if not code or not name:
                continue
            region = normalize_region(item.get("region"))
            phone_code = (dial_codes.get(code) or "").strip()
            country = Country(
                code=code,
                name=name,
                region=region,
                phone_code=phone_code,
                display_order=idx,
            )
            session.add(country)
            await session.flush()  # get country.id

            for s in item.get("states") or []:
                sc = (s.get("code") or "").strip() or str(s.get("name", ""))
                sn = (s.get("name") or "").strip()
                if sn:
                    session.add(
                        State(country_id=country.id, code=sc, name=sn)
                    )
                    total_states += 1

        await session.commit()
    return len(data), total_states


async def main() -> None:
    json_path = (
        os.environ.get("LOCATIONS_JSON_PATH")
        or (sys.argv[1] if len(sys.argv) > 1 else None)
        or str(Path(__file__).resolve().parent.parent / "app" / "data" / "countries-states.json")
    )
    if not os.path.isfile(json_path):
        print(f"JSON file not found: {json_path}")
        print(
            "Download with: curl -o app/data/countries-states.json "
            "https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json"
        )
        sys.exit(1)

    # Ensure tables exist and have phone_code, display_order (master data columns)
    async with engine.begin() as conn:
        await conn.execute(
            text("""
                CREATE TABLE IF NOT EXISTS countries (
                    id SERIAL PRIMARY KEY,
                    code VARCHAR(3) NOT NULL UNIQUE,
                    name VARCHAR(128) NOT NULL,
                    region VARCHAR(64) DEFAULT '',
                    phone_code VARCHAR(16) DEFAULT '',
                    display_order INTEGER DEFAULT 0
                )
            """)
        )
        # Add columns if table already existed without them (e.g. from an older run)
        await conn.execute(
            text("ALTER TABLE countries ADD COLUMN IF NOT EXISTS phone_code VARCHAR(16) DEFAULT ''")
        )
        await conn.execute(
            text("ALTER TABLE countries ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0")
        )
        await conn.execute(
            text("""
                CREATE TABLE IF NOT EXISTS states (
                    id SERIAL PRIMARY KEY,
                    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
                    code VARCHAR(32) NOT NULL,
                    name VARCHAR(128) NOT NULL
                )
            """)
        )
        await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_states_country_id ON states (country_id)"))
        await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_states_country_code ON states (country_id, code)"))

    dial_codes = load_dial_codes()
    countries_count, states_count = await seed_from_json(json_path, dial_codes)
    print(f"Seeded {countries_count} countries and {states_count} states from {json_path}")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
