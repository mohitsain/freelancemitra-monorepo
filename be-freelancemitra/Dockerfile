# Backend (FastAPI) - FreelanceMitra
FROM python:3.12-slim

WORKDIR /app

# Install system deps if needed (e.g. for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY alembic.ini .
COPY app ./app
COPY alembic ./alembic
COPY scripts ./scripts
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

# Non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Run migrations then uvicorn
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
