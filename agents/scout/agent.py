"""Scout Agent implementation.

Monitors tech news, social media, and research communities for
safety-motivated AI departures using Firecrawl web search + Claude extraction.

IMPORTANT: This agent uses Firecrawl credits. Do not run without confirming
available credits. One full scan uses ~len(SEARCH_QUERIES) credits.
"""

import json
import os
from dataclasses import dataclass, asdict

from anthropic import Anthropic
from firecrawl import FirecrawlApp

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
    raw_excerpt: str = ""


# Keyword combinations for Firecrawl search queries.
# Each query costs 1 Firecrawl credit.
SEARCH_QUERIES = [
    '"AI safety" researcher resigned OR departed OR quit 2026',
    '"left OpenAI" OR "left Google DeepMind" OR "left Anthropic" safety concerns',
    'AI ethics whistleblower departure 2026',
    '"stepped down" AI company "safety concerns" OR "ethical concerns"',
    'AI alignment researcher quit OR resigned',
]

# Companies we specifically track
TRACKED_COMPANIES = [
    "OpenAI", "Google DeepMind", "Anthropic", "Meta AI", "xAI",
    "Microsoft AI", "Amazon AI", "Apple AI", "Cohere", "Mistral",
    "Stability AI", "Inflection", "Character AI",
]

DEPARTURE_KEYWORDS = [
    "resigned", "departed", "left", "quit", "stepped down",
    "safety concerns", "ethical concerns", "AI safety",
    "responsible AI", "alignment", "existential risk",
    "whistleblower", "raised concerns", "moral objections",
]

EXTRACTION_PROMPT = """Analyze the following article text for safety-motivated departures from AI companies.

A valid departure signal must have ALL of these:
1. A specific person (full name) who left or is leaving an AI company
2. The company they departed from
3. Evidence the departure was motivated by safety, ethical, or alignment concerns

Return a JSON array of departure signals. Each object should have:
- "person_name": Full name of the person
- "company": Company they departed from
- "concern_keywords": Array of relevant concern categories from this list: ["Safety culture", "Governance gaps", "Deployment speed", "Existential risk", "Military applications", "Surveillance", "Labor displacement", "Misinformation", "Child safety", "Alignment", "Ethics", "Whistleblower retaliation"]
- "confidence": Number 0-1, where 1 = explicitly confirmed safety-motivated departure, 0.5 = implied/rumored
- "excerpt": A brief quote or summary (under 200 chars) from the article supporting this signal

If no valid departure signals are found, return an empty array: []

IMPORTANT: Only include signals where there is clear evidence of safety/ethical motivation.
Do not include departures for compensation, personal reasons, or career moves.

Article from {source_url}:
{content}"""


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


def _extract_signals_from_content(
    anthropic: Anthropic,
    content: str,
    source_url: str,
) -> list[DepartureSignal]:
    """Use Claude to extract departure signals from article text."""
    if not content or len(content.strip()) < 100:
        return []

    # Truncate to avoid excessive token usage
    truncated = content[:10000]

    prompt = EXTRACTION_PROMPT.format(source_url=source_url, content=truncated)

    response = anthropic.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    # Parse the JSON response
    response_text = response.content[0].text
    # Find the JSON array in the response
    start = response_text.find("[")
    end = response_text.rfind("]") + 1
    if start == -1 or end == 0:
        return []

    try:
        raw_signals = json.loads(response_text[start:end])
    except json.JSONDecodeError:
        return []

    signals = []
    for raw in raw_signals:
        if not raw.get("person_name") or not raw.get("company"):
            continue
        signals.append(DepartureSignal(
            person_name=raw["person_name"],
            company=raw["company"],
            source_urls=[source_url],
            concern_keywords=raw.get("concern_keywords", []),
            confidence=float(raw.get("confidence", 0.5)),
            platform=_classify_platform(source_url),
            raw_excerpt=raw.get("excerpt", "")[:200],
        ))

    return signals


def _classify_platform(url: str) -> str:
    """Classify a URL into a platform category."""
    url_lower = url.lower()
    if "twitter.com" in url_lower or "x.com" in url_lower:
        return "twitter"
    if "linkedin.com" in url_lower:
        return "linkedin"
    if "substack.com" in url_lower:
        return "substack"
    if "reddit.com" in url_lower:
        return "reddit"
    if "arxiv.org" in url_lower:
        return "arxiv"
    return "news"


def _merge_signals(all_signals: list[DepartureSignal]) -> list[DepartureSignal]:
    """Merge duplicate signals about the same person from different sources."""
    by_person: dict[str, DepartureSignal] = {}

    for signal in all_signals:
        key = (signal.person_name.lower(), signal.company.lower())
        if key in by_person:
            existing = by_person[key]
            # Merge source URLs
            for url in signal.source_urls:
                if url not in existing.source_urls:
                    existing.source_urls.append(url)
            # Keep higher confidence
            existing.confidence = max(existing.confidence, signal.confidence)
            # Merge keywords
            for kw in signal.concern_keywords:
                if kw not in existing.concern_keywords:
                    existing.concern_keywords.append(kw)
        else:
            by_person[key] = signal

    return list(by_person.values())


def crawl_sources() -> list[DepartureSignal]:
    """Crawl web sources for departure signals using Firecrawl search + Claude.

    Each search query costs 1 Firecrawl credit. The current configuration
    uses len(SEARCH_QUERIES) credits per run.
    """
    firecrawl = _get_firecrawl()
    anthropic = _get_anthropic()
    all_signals: list[DepartureSignal] = []

    with log_action("scout", "crawl", f"Running {len(SEARCH_QUERIES)} search queries") as log:
        for query in SEARCH_QUERIES:
            with log_action("scout", "search", query):
                try:
                    results = firecrawl.search(query, params={"limit": 5})

                    for result in results:
                        content = result.get("markdown", "") or result.get("content", "")
                        url = result.get("url", "unknown")

                        extracted = _extract_signals_from_content(anthropic, content, url)
                        all_signals.extend(extracted)

                except Exception as e:
                    # Log error but continue with remaining queries
                    with log_action("scout", "search_error", f"Query failed: {query}") as err_log:
                        err_log["error_detail"] = str(e)[:500]

        # Merge signals about the same person from different search results
        merged = _merge_signals(all_signals)

        log["output_summary"] = (
            f"Found {len(merged)} unique signals from {len(all_signals)} raw hits "
            f"across {len(SEARCH_QUERIES)} queries"
        )
        log["confidence_score"] = (
            sum(s.confidence for s in merged) / len(merged) if merged else 0.0
        )

        return merged


def deduplicate(signals: list[DepartureSignal]) -> list[DepartureSignal]:
    """Remove signals that match existing profiles in the database."""
    supabase = get_supabase()
    result = supabase.table("profiles").select("name, company").execute()
    existing = {(r["name"].lower(), r["company"].lower()) for r in result.data}

    return [
        s for s in signals
        if (s.person_name.lower(), s.company.lower()) not in existing
    ]
