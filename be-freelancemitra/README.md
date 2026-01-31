# be-freelancemitra

FastAPI + PostgreSQL backend for FreelanceMitra, with SSO (NextAuth) integration for users, sessions, and onboarding.

## Setup

### 1. Python & venv

```bash
cd be-freelancemitra
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` – PostgreSQL connection (use `postgresql+asyncpg://...` for async).
- `NEXTAUTH_SECRET` – **Must match** `NEXTAUTH_SECRET` in `fe-freelancemitra/.env` so the backend can verify NextAuth JWTs.

### 3. Database & migrations

Create a PostgreSQL database (e.g. `freelancemitra`). Schema is managed with **Alembic**.

- **New database:** run all migrations to create tables.
  ```bash
  alembic upgrade head
  ```
- **Existing database** (tables already created before Alembic): mark the initial revision as applied, then run the rest.
  ```bash
  alembic stamp 001
  alembic upgrade head
  ```
- **Generate a new migration** after changing models in `app/models/`:
  ```bash
  alembic revision --autogenerate -m "describe your change"
  alembic upgrade head
  ```
- **Other commands:** `alembic current`, `alembic history`, `alembic downgrade -1`.

Migrations use `DATABASE_URL` from `.env`; the URL is converted to a sync driver (`postgresql+psycopg2`) for running migrations.

**If you see** `column user_onboarding.country_phone_code does not exist` (or similar) when calling the API, the DB is behind the models. From `be-freelancemitra` run:
```bash
alembic stamp 001
alembic upgrade head
```

### 4. Seed countries and states (optional)

Locations (countries and states) and **country phone codes** (master data) are stored in the DB and served by public API. Phone codes are saved by the seed from `app/data/country_dial_codes.json`, not entered by users. To seed:

```bash
# Download JSON (stefanbinder/countries-states)
curl -o app/data/countries-states.json https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json

# Seed (from be-freelancemitra directory); loads phone_code from app/data/country_dial_codes.json
python scripts/seed_locations.py
# Or: LOCATIONS_JSON_PATH=/path/to/countries.json python scripts/seed_locations.py
```

To regenerate `app/data/country_dial_codes.json` (E.164 dial codes by country code):  
`python scripts/build_country_dial_codes.py`

### 5. Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Note:** If `pip install -r requirements.txt` reports a conflict with `weaviate-client` (e.g. httpx version), that package is not used by this backend—it’s from another project in the same environment. Use a dedicated venv for `be-freelancemitra`, or you can ignore the warning if you don’t use weaviate in this app.

- API: http://localhost:8000  
- Health: http://localhost:8000/health  

## API documentation

Interactive API docs are generated from the OpenAPI schema:

| Link | Description |
|------|-------------|
| [Swagger UI](http://localhost:8000/docs) | Try endpoints from the browser |
| [ReDoc](http://localhost:8000/redoc) | Read-only API reference |
| [openapi.json](http://localhost:8000/openapi.json) | Raw OpenAPI 3.0 schema |

All endpoints are grouped by tag (auth, users, sessions, onboarding, locations). Responses use the standard `ApiResponse` envelope (`success`, `data`, `error`).

## SSO integration (NextAuth)

The frontend (`fe-freelancemitra`) uses NextAuth with Google/GitHub and JWT sessions. This backend:

- Verifies the **same JWT** using `NEXTAUTH_SECRET`.
- Expects `Authorization: Bearer <jwt>` on protected routes.

**Frontend integration:** A Next.js API proxy is provided so the frontend can call the backend without handling the JWT on the client.

1. In `fe-freelancemitra/.env` add: `BACKEND_URL=http://localhost:8000`
2. From the frontend (client or server), call the proxy instead of the backend directly:
   - `fetch('/api/backend/users/me')` → proxies to `GET http://localhost:8000/api/v1/users/me` with NextAuth JWT as Bearer
   - `fetch('/api/backend/onboarding', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })` → proxies to `POST .../api/v1/onboarding`

The proxy route (`/api/backend/[...path]`) uses `getToken({ req, secret, raw: true })` to get the JWT and forwards it to the backend. The backend verifies the same JWT using `NEXTAUTH_SECRET` and creates/returns the user.

## Temporal (workflows)

Workflows and activities run via [Temporal](https://temporal.io). The API can **start** workflows; a separate **worker** process executes them.

### 1. Use your existing Postgres

Create two databases in your existing Postgres (e.g. with `psql` or any client):

```sql
CREATE DATABASE temporal;
CREATE DATABASE temporal_visibility;
```

### 2. Start Temporal server (local)

From the monorepo root, set env (or add a `.env` in the monorepo root) and start:

```bash
# Optional: set in .env at monorepo root (or export)
# TEMPORAL_POSTGRES_SEEDS=host.docker.internal   # Postgres on host (Mac/Win)
# TEMPORAL_POSTGRES_SEEDS=172.17.0.1            # Postgres on host (Linux)
# TEMPORAL_POSTGRES_USER=postgres
# TEMPORAL_POSTGRES_PWD=postgres
# TEMPORAL_POSTGRES_PORT=5432
# TEMPORAL_DBNAME=temporal
# TEMPORAL_VISIBILITY_DBNAME=temporal_visibility

docker compose -f docker-compose.temporal.yml up -d
```

Temporal listens on port **7233**. It uses your existing Postgres (default: `host.docker.internal:5432`; on Linux use your host IP or a Postgres hostname).

### 3. Run the worker

From `be-freelancemitra` (with venv activated):

```bash
python -m app.temporal.worker
```

Keep this running so workflows and activities are processed.

### 4. Start workflows from the API

- `POST /api/v1/workflows/greet/start` — body: `{"name": "World"}` → starts `GreetWorkflow`
- `POST /api/v1/workflows/notify/start` — body: `{"user_id": "...", "message": "..."}` → starts `NotifyWorkflow`

Optional env (see `.env.example`): `TEMPORAL_ADDRESS`, `TEMPORAL_NAMESPACE`, `TEMPORAL_TASK_QUEUE`. Defaults: `localhost:7233`, `default`, `freelancemitra-task-queue`.

## Folder structure

```
be-freelancemitra/
├── alembic/                 # Database migrations
│   ├── env.py               # Migration env (loads .env, sync URL, model discovery)
│   ├── script.py.mako       # Template for new revisions
│   └── versions/            # Migration scripts (001_..., 002_...)
├── app/
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── config.py            # Settings from env
│   ├── database.py          # Async engine, session, Base
│   ├── core/
│   │   └── security.py      # NextAuth JWT verification
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── session.py
│   │   ├── onboarding.py
│   │   └── location.py
│   ├── schemas/             # Pydantic request/response
│   ├── services/            # Business logic
│   └── api/
│       └── v1/
│           ├── router.py
│           └── endpoints/
├── scripts/                 # One-off scripts (seed_locations, clear_onboarding, etc.)
├── alembic.ini              # Alembic config (script_location, logging)
├── requirements.txt
├── .env.example
└── README.md
```

## API overview

| Area        | Method | Path                    | Description                          |
|------------|--------|-------------------------|--------------------------------------|
| Auth       | GET    | `/api/v1/auth/verify`   | Verify Bearer token (NextAuth JWT)   |
| Users      | GET    | `/api/v1/users/me`      | Current user (create from SSO if new) |
| Sessions   | GET    | `/api/v1/sessions`      | List current user’s sessions         |
| Sessions   | POST   | `/api/v1/sessions`      | Register current request as session  |
| Sessions   | DELETE | `/api/v1/sessions/{id}` | Revoke a session                     |
| Onboarding | GET    | `/api/v1/onboarding/status` | Onboarding completion status   |
| Onboarding | GET    | `/api/v1/onboarding`    | Get onboarding data                  |
| Onboarding | POST   | `/api/v1/onboarding`    | Submit onboarding (marks completed)  |
| Onboarding | PATCH  | `/api/v1/onboarding`    | Update onboarding data               |
| Locations  | GET    | `/api/v1/countries`    | List countries (optional `?region=`)  |
| Locations  | GET    | `/api/v1/countries/regions` | List region names for filters  |
| Locations  | GET    | `/api/v1/countries/{code}/states` | List states for country (no auth) |
| Upload     | POST   | `/api/v1/upload/presigned-url`    | Get presigned PUT URL for S3 upload |
| Upload     | GET    | `/api/v1/upload/display-url?key=...` | Get presigned GET URL for S3 object |
| Workflows  | POST   | `/api/v1/workflows/greet/start`      | Start Greet workflow (body: `{"name": "..."}`) |
| Workflows  | POST   | `/api/v1/workflows/notify/start`     | Start Notify workflow (body: `{"user_id", "message"}`) |

Locations endpoints are **public** (no auth). All other endpoints above require `Authorization: Bearer <NextAuth JWT>` (or `next-auth.session-token` cookie).

### S3 file upload (onboarding)

Files are stored in bucket **freelancemitra** under **per-user folders by category**:

- **Path:** `users/{user_id}/{category}/{unique}.ext`
- **Categories:** `profile` (profile picture), `projects` (portfolio project files)

Configure either access keys or CLI profile (see `.env.example`). Frontend requests a presigned PUT URL from `POST /upload/presigned-url` with `category` (profile or projects), uploads directly to S3, then saves the returned key in onboarding. GET onboarding returns presigned display URLs for profile picture; project file keys are stored in portfolio samples.
