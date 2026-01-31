"""API v1 router - mounts all endpoint modules."""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, sessions, onboarding, locations, upload, masters, workflows

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
api_router.include_router(locations.router, tags=["locations"])
api_router.include_router(masters.router, tags=["masters"])
