"""
Add country_phone_code column to user_onboarding if missing.

The model was updated to include country_phone_code (for country code + phone number split),
but existing databases may not have this column. Run once to update the table.

Usage (from be-freelancemitra):
  python scripts/add_country_phone_code_column.py

Requires DATABASE_URL in .env (or environment).
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text

from app.database import engine


async def main() -> int:
    async with engine.begin() as conn:
        await conn.execute(text("""
            ALTER TABLE user_onboarding
            ADD COLUMN IF NOT EXISTS country_phone_code VARCHAR(16) DEFAULT ''
        """))
    print("Done: user_onboarding.country_phone_code column ensured.")
    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
