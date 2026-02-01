"""FastAPI application entrypoint."""
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.core.security import NEXTAUTH_SESSION_COOKIE
from app.database import engine, Base
from app.models import User, Session, UserOnboarding, ProposalHistory, Country, State, Skill, Specialization, Language  # noqa: F401 - register models
from app.api.v1.router import api_router
from app.schemas.response import ApiErrorDetail, ApiResponse

settings = get_settings()


def _error_response(status_code: int, code: str, message: str, detail: str | None = None) -> JSONResponse:
    """Return standard error envelope."""
    body = ApiResponse(
        success=False,
        data=None,
        error=ApiErrorDetail(code=code, message=message, detail=detail),
    )
    return JSONResponse(status_code=status_code, content=body.model_dump())


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB tables on startup (use Alembic in production)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


OPENAPI_TAGS = [
    {
        "name": "auth",
        "description": "Verify NextAuth JWT and get decoded token payload.",
    },
    {
        "name": "users",
        "description": "Current user (get or create from SSO). Requires Bearer token.",
    },
    {
        "name": "sessions",
        "description": "List, create, and revoke server-side sessions. Requires Bearer token.",
    },
    {
        "name": "onboarding",
        "description": "Onboarding status and submit/update onboarding data. Requires Bearer token.",
    },
    {
        "name": "upload",
        "description": "Presigned S3 URLs for onboarding file uploads (profile picture, etc.).",
    },
    {
        "name": "locations",
        "description": "Countries and states (public, no authentication required).",
    },
    {
        "name": "masters",
        "description": "Skills and specializations master data (public, no authentication required).",
    },
    {
        "name": "workflows",
        "description": "Start Temporal workflows (greet, notify). Requires Temporal server and worker.",
    },
    {
        "name": "rag",
        "description": "RAG Agent: query with retrieval-augmented generation (OpenAI). Requires OPENAI_API_KEY.",
    },
    {
        "name": "proposals",
        "description": "Generate personalized freelance proposals from job description + user onboarding. Requires Bearer token and OPENAI_API_KEY.",
    },
]

app = FastAPI(
    title=settings.app_name,
    description="""
Backend API for FreelanceMitra. Authenticated endpoints accept either:

- **Header:** `Authorization: Bearer <NextAuth JWT>`
- **Cookie:** `next-auth.session-token` (same JWT; use this in Swagger after logging in on the frontend)

The JWT is issued by the frontend (NextAuth) and verified by this backend.

**Standard response envelope:** All endpoints return `ApiResponse` with `success`, `data`, and optionally `message` or `error` (see schemas below).
    """.strip(),
    version="1.0.0",
    openapi_tags=OPENAPI_TAGS,
    debug=settings.debug,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    servers=[{"url": "http://localhost:8000", "description": "Local development"}],
    swagger_ui_parameters={"persistAuthorization": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def http_exception_handler(request: Request, exc: Exception):
    """Map HTTPException to standard ApiResponse error envelope."""
    from fastapi import HTTPException

    if isinstance(exc, HTTPException):
        code = "HTTP_ERROR"
        if exc.status_code == 401:
            code = "UNAUTHORIZED"
        elif exc.status_code == 403:
            code = "FORBIDDEN"
        elif exc.status_code == 404:
            code = "NOT_FOUND"
        elif exc.status_code >= 500:
            code = "INTERNAL_ERROR"
        detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail) if exc.detail else None
        return _error_response(exc.status_code, code, detail or "Request failed", detail=None)
    raise exc


app.include_router(api_router, prefix="/api/v1")


def _openapi_with_cookie_auth_or() -> dict[str, Any]:
    """OpenAPI schema with Bearer and cookie auth as alternatives (OR)."""
    from fastapi.openapi.utils import get_openapi

    schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
        servers=app.servers,
    )
    # Ensure cookie auth is documented with a clear description
    components = schema.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})
    if "APIKeyCookie" not in security_schemes:
        security_schemes["APIKeyCookie"] = {
            "type": "apiKey",
            "in": "cookie",
            "name": NEXTAUTH_SESSION_COOKIE,
            "description": "NextAuth session JWT (set after logging in on the frontend). Same value as Bearer.",
        }
    # Convert AND security to OR: [{ "A": [], "B": [] }] -> [{ "A": [] }, { "B": [] }]
    for path, path_item in schema.get("paths", {}).items():
        for method, op in path_item.items():
            if method in ("get", "post", "put", "patch", "delete") and isinstance(op, dict):
                sec = op.get("security")
                if sec and len(sec) == 1:
                    single = sec[0]
                    if isinstance(single, dict) and len(single) > 1:
                        op["security"] = [{k: []} for k in single]
    return schema


app.openapi = _openapi_with_cookie_auth_or


@app.get("/health")
async def health():
    """Health check."""
    return {"status": "ok"}
