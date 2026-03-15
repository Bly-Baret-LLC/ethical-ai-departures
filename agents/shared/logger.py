"""Agent activity logging to Supabase agent_logs table."""

import time
from contextlib import contextmanager
from typing import Generator
from .db import get_supabase


@contextmanager
def log_action(
    agent_name: str,
    action_type: str,
    input_summary: str | None = None,
) -> Generator[dict, None, None]:
    """Context manager that logs agent actions with timing.

    Usage:
        with log_action("scout", "crawl", "Scanning Twitter") as log:
            results = do_work()
            log["output_summary"] = f"Found {len(results)} signals"
            log["confidence_score"] = 0.85
    """
    supabase = get_supabase()
    start = time.time()
    log_data: dict = {
        "output_summary": None,
        "confidence_score": None,
        "error_detail": None,
    }

    try:
        yield log_data

        duration_ms = int((time.time() - start) * 1000)
        supabase.table("agent_logs").insert({
            "agent_name": agent_name,
            "action_type": action_type,
            "status": "success",
            "input_summary": input_summary,
            "output_summary": log_data.get("output_summary"),
            "confidence_score": log_data.get("confidence_score"),
            "duration_ms": duration_ms,
        }).execute()

    except Exception as e:
        duration_ms = int((time.time() - start) * 1000)
        supabase.table("agent_logs").insert({
            "agent_name": agent_name,
            "action_type": action_type,
            "status": "error",
            "input_summary": input_summary,
            "error_detail": str(e)[:500],
            "duration_ms": duration_ms,
        }).execute()
        raise
