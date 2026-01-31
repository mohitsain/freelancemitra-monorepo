"""
Clear onboarding data for one user (by email) or all users.

Resets:
  - Deletes the user's row in user_onboarding (if any).
  - Sets user.onboarding_completed_at = NULL so the app shows onboarding again.

Usage:
  From be-freelancemitra:
    python scripts/clear_onboarding.py --email user@example.com
    python scripts/clear_onboarding.py --all

  Requires DATABASE_URL in .env (or environment).
"""
import argparse
import asyncio
import sys
from pathlib import Path

# Add app to path when running as script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import AsyncSessionLocal, engine
from app.models.user import User
from app.models.onboarding import UserOnboarding


async def clear_onboarding_for_user(session, user: User) -> bool:
    """Clear onboarding for one user. Returns True if anything was cleared."""
    had_onboarding = False
    if user.onboarding:
        await session.delete(user.onboarding)
        had_onboarding = True
    if user.onboarding_completed_at is not None:
        user.onboarding_completed_at = None
        had_onboarding = True
    return had_onboarding


async def run(email: str | None, clear_all: bool) -> int:
    async with AsyncSessionLocal() as session:
        if clear_all:
            result = await session.execute(
                select(User).options(selectinload(User.onboarding))
            )
            users = list(result.scalars().all())
        elif email:
            result = await session.execute(
                select(User)
                .where(User.email == email.strip())
                .options(selectinload(User.onboarding))
            )
            user = result.scalar_one_or_none()
            if not user:
                print(f"No user found with email: {email}", file=sys.stderr)
                return 1
            users = [user]
        else:
            print("Use --email <email> or --all. Run with --help for usage.", file=sys.stderr)
            return 1

        cleared = 0
        for u in users:
            if await clear_onboarding_for_user(session, u):
                cleared += 1
                print(f"Cleared onboarding for: {u.email or u.id}")

        await session.commit()
        if not cleared and users:
            print("No onboarding data found for the given user(s).")
        elif not cleared:
            print("No users in database.")
        return 0


async def main_async(email: str | None, clear_all: bool) -> int:
    try:
        return await run(email, clear_all)
    finally:
        await engine.dispose()


def main():
    parser = argparse.ArgumentParser(
        description="Clear onboarding data for a user (by email) or all users."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--email", type=str, help="User email to clear onboarding for")
    group.add_argument("--all", action="store_true", dest="clear_all", help="Clear onboarding for all users")
    args = parser.parse_args()

    exit_code = asyncio.run(main_async(args.email, args.clear_all))
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
