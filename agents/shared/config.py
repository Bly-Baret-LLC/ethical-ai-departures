"""Agent pipeline configuration loaded from environment."""

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class AgentConfig:
    supabase_url: str
    supabase_service_role_key: str
    anthropic_api_key: str
    firecrawl_api_key: str
    schedule_hours: int = 4

    @classmethod
    def from_env(cls) -> "AgentConfig":
        return cls(
            supabase_url=os.environ["SUPABASE_URL"],
            supabase_service_role_key=os.environ["SUPABASE_SERVICE_ROLE_KEY"],
            anthropic_api_key=os.environ["ANTHROPIC_API_KEY"],
            firecrawl_api_key=os.environ.get("FIRECRAWL_API_KEY", ""),
            schedule_hours=int(os.environ.get("AGENT_SCHEDULE_HOURS", "4")),
        )
