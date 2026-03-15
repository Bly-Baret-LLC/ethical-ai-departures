"""Verification Agent implementation.

Confirms: employment at AI company, departure is real (primary source),
and stated reason references safety/ethical concerns.
"""

from dataclasses import dataclass
from agents.shared.logger import log_action


@dataclass
class VerifiedProfile:
    """A verified departure profile ready for editorial review."""
    person_name: str
    company: str
    role: str
    departure_date: str
    stated_reason: str
    direct_quotes: list[dict]  # [{text, source_url}]
    source_urls: list[str]
    concern_tags: list[str]
    confidence: str  # "high", "medium", "low"


@dataclass
class RejectionRecord:
    """Record of a rejected departure signal."""
    person_name: str
    company: str
    reason: str  # "not_ai_company", "rumor", "not_safety_motivated"


def verify_signal(signal: dict) -> VerifiedProfile | RejectionRecord:
    """Verify a departure signal from the Scout Agent.

    This is a stub implementation. The full version uses Claude
    to analyze sources and confirm the departure.
    """
    with log_action("verification", "verify", f"Verifying {signal.get('person_name', 'unknown')}") as log:
        # TODO: Confirm AI company employment
        # TODO: Confirm departure via primary source
        # TODO: Confirm safety/ethical motivation
        # TODO: Extract direct quotes with source URLs
        # TODO: Assign confidence level
        log["output_summary"] = "Stub: verification not yet implemented"
        log["confidence_score"] = 0.0

        return RejectionRecord(
            person_name=signal.get("person_name", ""),
            company=signal.get("company", ""),
            reason="not_implemented",
        )
