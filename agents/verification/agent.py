"""Verification Agent implementation.

Confirms: employment at AI company, departure is real (primary source),
and stated reason references safety/ethical concerns.

Uses Firecrawl to scrape source URLs and Claude to analyze content.
Each source URL scrape costs 1 Firecrawl credit.
"""

import json
import os
from dataclasses import dataclass

from anthropic import Anthropic
from firecrawl import FirecrawlApp

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
    reason: str  # "not_ai_company", "rumor", "not_safety_motivated", "insufficient_evidence"


VERIFICATION_PROMPT = """You are verifying a reported safety-motivated departure from an AI company.

Reported signal:
- Person: {person_name}
- Company: {company}

Source material (from {num_sources} source(s)):
{sources_text}

Verify ALL of the following:
1. Did this person actually work at this company (or a subsidiary/division)?
2. Is the departure confirmed (not just rumored)?
3. Is the departure motivated by safety, ethical, or alignment concerns (not compensation, personal, or career reasons)?

Return a JSON object with:
{{
  "verified": true/false,
  "role": "Their role/title at the company (or 'unknown')",
  "departure_date": "YYYY-MM or 'unknown'",
  "stated_reason": "Brief summary of their stated reason for leaving",
  "direct_quotes": [
    {{"text": "Exact quote from the person", "source_url": "URL where quote was found"}}
  ],
  "concern_tags": ["Safety culture", "Governance gaps", etc.],
  "confidence": "high" / "medium" / "low",
  "rejection_reason": "Only if verified=false: 'not_ai_company', 'rumor', 'not_safety_motivated', or 'insufficient_evidence'"
}}

Rules:
- "high" confidence: Primary source (person's own statement, official announcement) + corroboration
- "medium" confidence: Credible secondary reporting (major outlet, multiple sources)
- "low" confidence: Single secondary source or social media only
- If you cannot confirm safety motivation, set verified=false
- Direct quotes must be exact text from the source, not paraphrased"""


def _get_firecrawl() -> FirecrawlApp:
    api_key = os.environ.get("FIRECRAWL_API_KEY", "")
    if not api_key:
        raise RuntimeError("FIRECRAWL_API_KEY not set")
    return FirecrawlApp(api_key=api_key)


def _get_anthropic() -> Anthropic:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not set")
    return Anthropic(api_key=api_key)


def _scrape_sources(firecrawl: FirecrawlApp, urls: list[str]) -> list[dict]:
    """Scrape source URLs to get full article content. Each scrape = 1 credit."""
    scraped = []
    for url in urls[:3]:  # Cap at 3 sources per signal to conserve credits
        try:
            result = firecrawl.scrape_url(url, params={"formats": ["markdown"]})
            content = result.get("markdown", "")
            if content:
                scraped.append({"url": url, "content": content[:8000]})
        except Exception:
            # Source unavailable — continue with others
            scraped.append({"url": url, "content": "(could not scrape)"})
    return scraped


def verify_signal(signal: dict) -> VerifiedProfile | RejectionRecord:
    """Verify a departure signal from the Scout Agent.

    Scrapes the source URLs for full content, then uses Claude to
    verify employment, departure, and safety motivation.
    """
    person_name = signal.get("person_name", "unknown")
    company = signal.get("company", "unknown")
    source_urls = signal.get("source_urls", [])

    with log_action("verification", "verify", f"Verifying {person_name}") as log:
        firecrawl = _get_firecrawl()
        anthropic = _get_anthropic()

        # Scrape source URLs for full content
        scraped = _scrape_sources(firecrawl, source_urls)

        if not any(s["content"] != "(could not scrape)" for s in scraped):
            log["output_summary"] = f"Rejected {person_name}: no scrapeable sources"
            log["confidence_score"] = 0.0
            return RejectionRecord(
                person_name=person_name,
                company=company,
                reason="insufficient_evidence",
            )

        # Build source text for the prompt
        sources_text = ""
        for s in scraped:
            sources_text += f"\n--- Source: {s['url']} ---\n{s['content']}\n"

        prompt = VERIFICATION_PROMPT.format(
            person_name=person_name,
            company=company,
            num_sources=len(scraped),
            sources_text=sources_text,
        )

        response = anthropic.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )

        # Parse response
        response_text = response.content[0].text
        start = response_text.find("{")
        end = response_text.rfind("}") + 1

        if start == -1 or end == 0:
            log["output_summary"] = f"Rejected {person_name}: unparseable response"
            log["confidence_score"] = 0.0
            return RejectionRecord(
                person_name=person_name,
                company=company,
                reason="insufficient_evidence",
            )

        try:
            result = json.loads(response_text[start:end])
        except json.JSONDecodeError:
            log["output_summary"] = f"Rejected {person_name}: invalid JSON"
            log["confidence_score"] = 0.0
            return RejectionRecord(
                person_name=person_name,
                company=company,
                reason="insufficient_evidence",
            )

        if not result.get("verified"):
            reason = result.get("rejection_reason", "insufficient_evidence")
            log["output_summary"] = f"Rejected {person_name}: {reason}"
            log["confidence_score"] = 0.0
            return RejectionRecord(
                person_name=person_name,
                company=company,
                reason=reason,
            )

        confidence = result.get("confidence", "low")
        confidence_score = {"high": 0.9, "medium": 0.7, "low": 0.4}.get(confidence, 0.5)
        log["output_summary"] = f"Verified {person_name} ({confidence} confidence)"
        log["confidence_score"] = confidence_score

        return VerifiedProfile(
            person_name=person_name,
            company=company,
            role=result.get("role", "unknown"),
            departure_date=result.get("departure_date", "unknown"),
            stated_reason=result.get("stated_reason", ""),
            direct_quotes=result.get("direct_quotes", []),
            source_urls=source_urls,
            concern_tags=result.get("concern_tags", []),
            confidence=confidence,
        )
