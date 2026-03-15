"""Scout Agent implementation.

Monitors X/Twitter, LinkedIn, Substack, Reddit, and tech news outlets
for safety-motivated AI departures using Firecrawl web crawling.
"""

from dataclasses import dataclass
from agents.shared.logger import log_action
from agents.shared.db import get_supabase


@dataclass
class DepartureSignal:
    """A candidate departure signal detected by the Scout Agent."""
    person_name: str
    company: str
    source_urls: list[str]
    concern_keywords: list[str]
    confidence: float
    platform: str


DEPARTURE_KEYWORDS = [
    "resigned", "departed", "left", "quit", "stepped down",
    "safety concerns", "ethical concerns", "AI safety",
    "responsible AI", "alignment", "existential risk",
    "whistleblower", "raised concerns", "moral objections",
]


def crawl_sources() -> list[DepartureSignal]:
    """Crawl configured sources for departure signals.

    This is a stub implementation. The full version integrates
    Firecrawl API for web crawling and uses semantic search
    for safety-motivated departures.
    """
    with log_action("scout", "crawl", "Scanning configured sources") as log:
        # TODO: Integrate Firecrawl API
        # TODO: Implement semantic search
        # TODO: Deduplicate against existing profiles
        signals: list[DepartureSignal] = []
        log["output_summary"] = f"Found {len(signals)} candidate signals"
        log["confidence_score"] = 0.0
        return signals


def deduplicate(signals: list[DepartureSignal]) -> list[DepartureSignal]:
    """Remove signals that match existing profiles in the database."""
    supabase = get_supabase()
    result = supabase.table("profiles").select("name, company").execute()
    existing = {(r["name"].lower(), r["company"].lower()) for r in result.data}

    return [
        s for s in signals
        if (s.person_name.lower(), s.company.lower()) not in existing
    ]
