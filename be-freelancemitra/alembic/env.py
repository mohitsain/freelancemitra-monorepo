"""
Alembic migration environment.

- Loads DATABASE_URL from app.config (.env).
- Uses a sync URL (postgresql+psycopg2) for running migrations.
- Imports all models so Base.metadata is populated for autogenerate.
"""
from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine
from sqlalchemy.engine import Connection

from app.config import get_settings
from app.database import Base

# Import all models so they are registered on Base.metadata (required for autogenerate)
from app.models import Country, State, Session, User, UserOnboarding  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_sync_url() -> str:
    """Convert async DATABASE_URL to sync (postgresql+psycopg2) for Alembic."""
    url = get_settings().database_url
    if "+asyncpg" in url:
        return url.replace("+asyncpg", "+psycopg2", 1)
    if url.startswith("postgresql://") and "+" not in url.split("//")[0]:
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generate SQL only, no DB connection)."""
    context.configure(
        url=get_sync_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (connect to DB with sync engine)."""
    connectable = create_engine(
        get_sync_url(),
        poolclass=context.config.attributes.get("poolclass"),
    )
    with connectable.connect() as connection:
        do_run_migrations(connection)


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
