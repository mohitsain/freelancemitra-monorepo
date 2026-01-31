"""Temporal workflows: durable orchestration."""
from dataclasses import dataclass
from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from app.temporal.activities import greet, send_notification


@dataclass
class GreetInput:
    """Input for the greet workflow."""

    name: str


@workflow.defn
class GreetWorkflow:
    """Example workflow: greet then optionally notify."""

    @workflow.run
    async def run(self, input: GreetInput) -> str:
        """Run: call greet activity and return result."""
        result = await workflow.execute_activity(
            greet,
            input.name,
            start_to_close_timeout=workflow.Duration(seconds=10),
        )
        return result


@dataclass
class NotifyWorkflowInput:
    """Input for the notify workflow."""

    user_id: str
    message: str


@workflow.defn
class NotifyWorkflow:
    """Workflow that sends a notification via activity."""

    @workflow.run
    async def run(self, input: NotifyWorkflowInput) -> bool:
        """Run: send notification activity."""
        return await workflow.execute_activity(
            send_notification,
            args=[input.user_id, input.message],
            start_to_close_timeout=workflow.Duration(seconds=30),
        )
