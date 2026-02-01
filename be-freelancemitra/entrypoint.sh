#!/bin/sh
# Run migrations, then start the app.
# Uses DATABASE_URL from environment (set by docker-compose).

set -e

echo "Running database migrations..."
max_attempts=30
attempt=1
# Write error log under /app (writable by appuser)
last_log=/app/.alembic_last_error.log
while [ $attempt -le $max_attempts ]; do
  if alembic upgrade head >"$last_log" 2>&1; then
    echo "Migrations complete."
    break
  fi
  echo "Migration attempt $attempt/$max_attempts failed, retrying in 2s..."
  echo "--- Last error output ---"
  cat "$last_log" 2>/dev/null || true
  echo "--- end ---"
  attempt=$((attempt + 1))
  sleep 2
done

if [ $attempt -gt $max_attempts ]; then
  echo "Migrations failed after $max_attempts attempts." >&2
  echo "Final error output:" >&2
  cat "$last_log" 2>/dev/null >&2 || true
  exit 1
fi

echo "Seeding master data (skills, specializations, languages)..."
python scripts/seed_skills_specializations.py || true

if [ -f app/data/countries-states.json ]; then
  echo "Seeding locations (countries, states)..."
  python scripts/seed_locations.py || true
fi

echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
