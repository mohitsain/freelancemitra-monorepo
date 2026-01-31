"""Temporal workflow triggers (start workflow from API)."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from temporalio.client import Client

from app.config import get_settings
from app.schemas.response import ApiResponse
from app.temporal.workflows import GreetWorkflow, GreetInput, NotifyWorkflow, NotifyWorkflowInput

router = APIRouter()


class StartGreetRequest(BaseModel):
    """Request body to start the greet workflow."""

    name: str


class StartNotifyRequest(BaseModel):
    """Request body to start the notify workflow."""

    user_id: str
    message: str


async def _get_client() -> Client:
    """Dependency: Temporal client. Raises 503 if Temporal server is unreachable."""
    from app.temporal.client import get_temporal_client
    try:
        return await get_temporal_client()
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Temporal unavailable. Start Temporal (e.g. docker compose -f docker-compose.temporal.yml up -d): {e!s}",
        )


@router.post("/greet/start", response_model=ApiResponse)
async def start_greet_workflow(
    body: StartGreetRequest,
    client: Client = Depends(_get_client),
):
    """Start the Greet workflow. Returns workflow ID; run the worker to process it."""
    settings = get_settings()
    try:
        handle = await client.start_workflow(
            GreetWorkflow.run,
            GreetInput(name=body.name),
            id=f"greet-{body.name.lower().replace(' ', '-')}-{abs(hash(body.name)) % 10**6}",
            task_queue=settings.temporal_task_queue,
        )
        return ApiResponse(success=True, data={"workflow_id": handle.id})
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Temporal unavailable: {e!s}")


@router.post("/notify/start", response_model=ApiResponse)
async def start_notify_workflow(
    body: StartNotifyRequest,
    client: Client = Depends(_get_client),
):
    """Start the Notify workflow."""
    try:
        handle = await client.start_workflow(
            NotifyWorkflow.run,
            NotifyWorkflowInput(user_id=body.user_id, message=body.message),
            id=f"notify-{body.user_id}-{abs(hash(body.message)) % 10**6}",
            task_queue=get_settings().temporal_task_queue,
        )
        return ApiResponse(success=True, data={"workflow_id": handle.id})
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Temporal unavailable: {e!s}")
