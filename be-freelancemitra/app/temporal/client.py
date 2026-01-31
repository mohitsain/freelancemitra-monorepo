"""Temporal client helper for starting workflows from the API."""
from temporalio.client import Client

from app.config import get_settings


async def get_temporal_client() -> Client:
    """Create a Temporal client (connect to server)."""
    settings = get_settings()
    return await Client.connect(
        settings.temporal_address,
        namespace=settings.temporal_namespace,
    )
