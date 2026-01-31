"""Temporal activities: non-deterministic work (DB, HTTP, etc.)."""
from temporalio import activity


@activity.defn
async def greet(name: str) -> str:
    """Example activity: return a greeting."""
    return f"Hello, {name}!"


@activity.defn
async def send_notification(user_id: str, message: str) -> bool:
    """Example activity: send a notification (placeholder)."""
    # In production: email, push, webhook, etc.
    activity.logger.info("send_notification: user_id=%s message=%s", user_id, message)
    return True
