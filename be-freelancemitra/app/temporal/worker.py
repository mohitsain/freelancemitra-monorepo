"""Temporal worker: runs workflows and activities. Run as a separate process."""
import asyncio
import logging
from pathlib import Path

from temporalio.client import Client
from temporalio.worker import Worker

from app.config import get_settings
from app.temporal.activities import greet, send_notification
from app.temporal.workflows import GreetWorkflow, NotifyWorkflow

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main() -> None:
    """Run the Temporal worker."""
    settings = get_settings()
    client = await Client.connect(
        settings.temporal_address,
        namespace=settings.temporal_namespace,
    )
    worker = Worker(
        client,
        task_queue=settings.temporal_task_queue,
        workflows=[GreetWorkflow, NotifyWorkflow],
        activities=[greet, send_notification],
    )
    logger.info(
        "Starting worker: address=%s namespace=%s task_queue=%s",
        settings.temporal_address,
        settings.temporal_namespace,
        settings.temporal_task_queue,
    )
    await worker.run()


if __name__ == "__main__":
    # Ensure app is on path when running: python -m app.temporal.worker
    sys_path = str(Path(__file__).resolve().parents[2])
    if sys_path not in __import__("sys").path:
        __import__("sys").path.insert(0, sys_path)
    asyncio.run(main())
