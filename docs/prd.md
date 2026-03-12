# The Warning Collective — Product Requirements Document
**warningcollective.com**
Version 1.0 · March 2026 · Bly-Baret LLC
Prepared with BMAD Method framework

---

> *"The people who built AI are warning us. All of them. At the same time."*

---

## Table of Contents

1. Executive Summary
2. Problem Statement
3. Product Vision & North Star
4. Target Audiences
5. Core Engagement Loops
6. User Journeys
7. Product Scope
8. Feature Requirements
9. AI Agent Architecture
10. Technical Stack
11. Non-Functional Requirements
12. BMAD Development Plan
13. Success Metrics
14. Risks & Mitigations
15. Open Questions

---

## 1. Executive Summary

The Warning Collective is a web platform that aggregates, verifies, and amplifies the voices of AI researchers, engineers, and leaders who have publicly departed major AI companies citing moral, ethical, or safety concerns. It transforms isolated acts of conscience into a visible, living movement — making the collective weight of these departures legible to insiders, journalists, policymakers, and the general public.

The site operates as a real-time intelligence layer on the AI safety conversation: tracking who is leaving and why, synthesizing the themes they raise, forecasting whether their predictions will come true, and providing a community space for recognition and discussion.

| Attribute | Value |
|---|---|
| Product Name | The Warning Collective |
| Domain | warningcollective.com (+ .org) |
| Version | 1.0 — MVP |
| Target Launch | Q3 2026 |
| Primary Owner | Bly-Baret LLC |
| Document Status | Draft for Review |

---

## 2. Problem Statement

A significant and accelerating pattern is emerging in the AI industry: senior researchers, safety leads, and technical leaders at the world's most powerful AI companies are leaving their roles and speaking publicly about concerns they could not resolve from within. These departures include figures like Jan Leike (OpenAI Safety Lead), Geoffrey Hinton (Google), Daniel Kokotajlo (OpenAI), Ilya Sutskever (OpenAI), and many others across OpenAI, Google DeepMind, Anthropic, and Meta.

### Baseline Inventory Estimate

Preliminary research identifies approximately 40-60 publicly documented safety-motivated departures from major AI companies as of early 2026. This estimate must be validated through a formal content seeding audit in Phase 1 (see BMAD Development Plan). The addressable pool directly impacts the ticker's emotional impact and the site's ability to sustain the "living, not archival" design principle. If the validated count is below 30, the content strategy must be adjusted before launch — potentially broadening inclusion criteria or supplementing with adjacent categories (e.g., researchers who stayed but published dissenting safety research).

Currently, this pattern is invisible at the level that matters. Each departure is covered as an individual news event — a tweet here, a resignation letter there, a newspaper article. The signal is scattered. No one has aggregated it, verified it, synthesized the themes, or made the cumulative weight of it visible in one place.

### The gaps this creates:

- **Insiders** at AI companies who share these concerns have no social proof that others feel the same — making the psychological cost of speaking up feel much higher than it is
- **Journalists and policymakers** have no single authoritative source for the pattern — they must reconstruct it themselves every time they write about it
- **The general public** has no way to understand the scale or credibility of the concern — individual stories don't add up to a felt sense of momentum
- **The predictions** and warnings made by departing researchers are not tracked against outcomes — so the track record of their accuracy is invisible

> **Opportunity:** Aggregate what's scattered. Verify what's claimed. Synthesize what it means. Make the movement visible.

---

## 3. Product Vision & North Star

The Warning Collective is not a repository. It is a living pulse. It should feel urgent, growing, and real — not archival. Every time someone new leaves, the number goes up. Every time a prediction resolves, it gets marked. Every time someone writes a note of support, it surfaces.

### North Star Statement

> **To be the definitive, factual record of AI's internal conscience — making the collective alarm of its builders impossible to ignore.**

### Editorial Stance

The Warning Collective takes a clear editorial position: these departures are newsworthy, the pattern deserves visibility, and the public has a right to see the collective weight of internal dissent within the AI industry. This is advocacy-through-curation — not neutrality. The site does not pretend to have no perspective. What it commits to absolutely is factual accuracy, source transparency, and intellectual honesty. Every claim is verifiable. Every quote is sourced. Every prediction is tracked against reality, including the ones that turn out to be wrong.

This distinction matters: the site's credibility depends not on the absence of a viewpoint, but on the rigor with which it pursues factual accuracy while holding that viewpoint.

### Design Principles

- **Factual rigor, honest perspective** — Every claim is sourced. Every profile has a link. No speculation. The site's editorial position (that these departures matter) is stated openly, not disguised as neutrality.
- **Living, not archival** — The site updates continuously. It feels like something is happening right now, not a historical record.
- **Collective over individual** — The power is in the pattern, not the profile. Individual stories serve the collective thesis.
- **Credibility as moat** — The site's value to journalists and policymakers depends entirely on its rigor. One wrong attribution destroys it.
- **Courage as contagion** — Every feature should lower the psychological cost of the next person speaking up.

---

## 4. Target Audiences

| Audience | Primary Need & Behavioral Context |
|---|---|
| **Insiders on the fence** | Permission. Social proof that others like them have left and survived. Likely browsing anonymously, cautiously. Need to feel seen and not alone. The fan letter mechanic and momentum counter serve this audience most directly. |
| **Journalists & policymakers** | A database, not a story. They need to filter by company, date, stated concern, seniority. They need quotable sourced claims. They need the pattern synthesized so they don't have to reconstruct it. Credibility is non-negotiable for this group. |
| **General public** | The felt weight of it. They don't want 40 profiles — they want to understand that something serious is happening. The ticker, the predictions tracker, and the movement framing serve this audience. Shareable moments matter. |

### Audience Priority

**Primary:** Insiders and journalists/policymakers — these two audiences create the flywheel. Insiders create new signal (more departures). Journalists amplify the signal (more public awareness and pressure).

**Secondary:** General public — this is the distribution layer. They share, they pressure, they normalize the concern.

---

## 5. Core Engagement Loops

Three interlocking engagement loops drive retention, return visits, and growth. Every major feature maps to one or more of these loops.

### Loop 1 — The Discovery Loop
User lands → sees ticker → browses profiles → feels the weight of the collective → shares or returns when new departures are added.

**Frequency:** Once or twice per user deeply. Drives initial acquisition and word of mouth. Fueled by new departures.

### Loop 2 — The Forecasting Loop
User votes on a prediction → checks back to see community shift → returns when prediction resolves → shares the result.

**Frequency:** Monthly return visits. This is the retention engine. Creates the only reason to come back regularly without a new departure happening.

### Loop 3 — The Community Loop
User writes a fan letter or kudos → engages in discussion thread → follows a researcher's story → becomes an evangelist who recruits others.

**Frequency:** Weekly for the most engaged tier. Drives organic growth and creates the movement feeling.

> **Loop Flywheel:** Every new departure feeds Loop 1 (new profile), creates Loop 2 content (new predictions), and opens Loop 3 opportunities (new discussion). One event activates all three loops.

### Quiet Period Resilience
All three loops depend on external events (new departures, prediction resolutions). During periods with few high-profile departures, the site maintains engagement through:
- **Prediction Spotlight:** Featured predictions approaching their resolution date, surfaced with updated vote trends
- **"State of the Alarm" updates:** Periodic AI-generated synthesis refreshed even without new profiles, highlighting evolving themes
- **"What happened after" updates:** Ongoing tracking of previously profiled researchers' post-departure activity
- **Historical deep dives:** Editorially curated long-form content on significant past departures or thematic analyses

---

## 6. User Journeys

### Journey 1: The Cautious Insider

**Audience:** Current AI company employee with safety concerns
**Entry:** Anonymous link from a colleague, or search for "[company] AI safety departures"
**Engagement Loop:** Discovery → Community → Anonymous Signal

1. Lands on homepage → sees ticker ("73 researchers have left") → immediate social proof that this is real and widespread
2. Browses profiles filtered by their company → reads departure statements from people they may know personally → feels less alone
3. Reads fan letters on a profile → sees public support for people who spoke up → lowers perceived risk
4. Navigates to Anonymous Signal → reads transparency disclosure about what data is/isn't collected → submits anonymous signal ("I work at [company] and I see this too")
5. Returns periodically to check ticker growth and new profiles from their company → considers whether to speak publicly

**Key FRs exercised:** 8.1 Ticker, 8.2 Profiles (content + filtering), 8.2 Community Layer (fan letters), 8.6 Anonymous Signal, 8.7 Editorial Transparency (trust verification)
**Success metric served:** 200+ anonymous signals

---

### Journey 2: The Journalist on Deadline

**Audience:** Tech reporter writing a story about AI safety concerns
**Entry:** Press page link from another journalist, or Google search for "AI researcher departures database"
**Engagement Loop:** Discovery → Journalist Tooling

1. Lands on homepage → sees ticker and aggregate seniority signal → gets the headline number immediately
2. Filters profiles by company and date range → builds a list of relevant departures for their story
3. Opens individual profiles → copies sourced direct quotes with links → verifies against original sources
4. Navigates to Theme Synthesis → sees which concerns are trending → finds the narrative thread
5. Exports filtered profile list as CSV with full citations → has structured data for their editor
6. Checks Predictions Tracker → finds a prediction that recently resolved → adds it as a news hook
7. Copies permalink URL for their filtered view → includes as citation in published article
8. Signs up for journalist notification list → receives alerts for future departures

**Key FRs exercised:** 8.1 Ticker, 8.2 Profiles (content + filtering), 8.4 Theme Synthesis, 8.3 Predictions Tracker, 8.8 Journalist Tooling (export, permalinks, press page, notifications)
**Success metrics served:** 5+ press citations, 50+ journalist registrations

---

### Journey 3: The Concerned Citizen

**Audience:** General public, arrives via social media share
**Entry:** Shared link on X or LinkedIn with pre-populated text ("73 AI researchers have left their companies over safety concerns")
**Engagement Loop:** Discovery → Forecasting

1. Clicks shared link → lands on homepage → sees ticker with animated count → grasps the scale instantly
2. Reads contextual explainer → understands what "safety-motivated departure" means
3. Scrolls to browse a few profiles → reads departure quotes → feels the human weight of the pattern
4. Discovers Predictions Tracker → reads a falsifiable prediction from a prominent researcher → votes on whether they think it will come true
5. Shares the homepage or a specific prediction using the share button → pre-populated text includes the live count
6. Returns a month later when a prediction resolves → sees the outcome → shares the result
7. Over time, writes a fan letter to a researcher whose story resonated → becomes part of the community

**Key FRs exercised:** 8.1 Ticker (share, OG images), 8.2 Profiles (content), 8.3 Predictions Tracker (voting, resolution), 8.2 Community Layer (fan letters, kudos)
**Success metrics served:** 10,000+ monthly visitors, 5,000+ prediction votes, 500+ fan letters/kudos, 10+ ticker embeds

---

### Journey 4: The Policymaker's Staff Researcher

**Audience:** Congressional staffer or regulatory body researcher building a briefing
**Entry:** Referred by a journalist or advocacy organization
**Engagement Loop:** Discovery → Theme Synthesis → Regulatory Ideas

1. Lands on homepage → navigates to Theme Synthesis → sees the top concerns across all departures, organized by frequency and trend
2. Filters themes by concern category (e.g., "governance & oversight") → gets a focused view of what researchers are saying about their area
3. Navigates to Regulatory Ideas → sees specific proposals sourced to named researchers → finds proposals tagged "currently in legislation"
4. Exports profile data filtered by concern category → has a structured dataset for the briefing
5. Bookmarks the "State of the Alarm" page → returns for updated synthesis without re-researching
6. Checks the credibility index → uses the aggregate prediction track record as evidence of researcher foresight

**Key FRs exercised:** 8.4 Theme Synthesis, 8.5 Regulatory Ideas, 8.8 Journalist Tooling (export, permalinks), 8.3 Predictions Tracker (credibility index), 8.1 Ticker
**Success metrics served:** 5+ press citations (via briefing references)

---

### Journey 5: The Editorial Workflow

**Audience:** Warning Collective editorial team
**Entry:** Editorial dashboard (internal)
**Engagement Loop:** Agent pipeline → Human review → Publication

1. Orchestrator agent runs on schedule → Scout Agent flags 3 new candidate departures from overnight monitoring
2. Editor opens editorial dashboard → sees 3 candidates in review queue with confidence levels (1 High, 1 Medium, 1 Low)
3. Reviews High-confidence candidate → Verification Agent has confirmed employment, departure, and sourced quotes → editor approves for publication
4. Reviews Medium-confidence candidate → missing primary source confirmation → editor holds for manual investigation
5. Rejects Low-confidence candidate → routine career move, not safety-motivated
6. Synthesis Agent auto-tags the approved profile with concern taxonomy → editor reviews tags and adjusts
7. Synthesis Agent extracts 2 falsifiable predictions from the departure statement → editor reviews framing for neutrality → publishes predictions
8. Moderates 5 pending fan letters → approves 4, flags 1 as spam
9. Reviews 1 pending anonymous signal → approves for counter inclusion
10. Checks Predictions Tracker Agent output → 1 potential resolution flagged with evidence → editor reviews, confirms, marks resolved with two-reviewer sign-off

**Key FRs exercised:** 9.1 Orchestrator, 9.2 Scout Agent, 9.3 Verification Agent, 9.4 Synthesis Agent, 9.5 Predictions Tracker Agent, 9.7 Human-in-the-Loop, 8.2 Community Layer (moderation), 8.6 Anonymous Signal (moderation), 8.3 Resolution Framework
**Success metrics served:** 150+ verified profiles (pipeline throughput)

---

## 7. Product Scope

### MVP (Phase 2 — Weeks 3–6)

The minimum viable product is a journalist-ready reference site with curated content and core discovery tools.

| Feature | Scope |
|---|---|
| 8.1 Momentum Ticker | Full — live counter, recency counter, seniority signal, embeddable widget, share button, dynamic OG images |
| 8.2 Researcher Profiles | Content only — name, photo, company, date, quotes, timeline, "what happened after." No community layer |
| 8.2 Filtering & Discovery | Full — filter by company, year, seniority, concern, country; sort; search |
| 8.7 Editorial Transparency | Full — about page, editorial standards, corrections log, funding transparency, contact |
| 8.7 Institutional Credibility | Advisory board listed on about page (recruited in Phase 1) |
| 8.8 Journalist Tooling | Full — permalink queries, data export (CSV/JSON), press page, journalist notification signup |

**Out of MVP:** Predictions Tracker, Theme Synthesis, Regulatory Ideas, Anonymous Signal, Community Layer (fan letters, kudos, discussions)

### Growth (Phases 3–4 — Weeks 7–18)

Intelligence and community features that activate all three engagement loops.

| Feature | Phase | Scope |
|---|---|---|
| 8.3 Predictions Tracker | 3 | Full — voting, resolution, editorial standards, resolution framework, credibility index |
| 8.4 Theme Synthesis Engine | 3 | Full — taxonomy tagging, theme map, trend analysis, emerging themes, "State of the Alarm" |
| 8.2 Community Layer | 4 | Full — fan letters, kudos, discussion threads, moderation |
| 8.5 Regulatory Ideas | 4 | Full — proposals, community voting, legislation flags |
| 8.6 Anonymous Signal | 4 | Full — anonymous form, aggregate counter, trust & safety (post legal review) |
| 8.7 Trust Verification | 4 | Privacy audit, transparency document |
| Embeddable ticker widget | 4 | Public embed code |

### Vision (Phase 5+ — Weeks 19+)

Scale, distribution, and programmatic access.

- SEO optimization — profile pages as long-tail search assets
- Public API for researchers and journalists
- Predictions Tracker Agent v2 — automated resolution detection
- Embeddable statistics cards (beyond ticker widget)
- Third-party privacy audit of anonymous signal feature
- International scope expansion (non-US AI companies)
- Prediction market evolution with reputation scoring (open question)

### Explicitly Out of Scope

- Native mobile apps — web-only, responsive
- User accounts or login for core features
- Original editorial opinion or commentary — curation only
- Private or leaked materials — public sources only
- Real-time chat or messaging
- Revenue model implementation (open question — resolved before Phase 3)

---

## 8. Feature Requirements

### 8.1 The Momentum Ticker

A persistent, prominent live counter displayed above the fold on the homepage showing the total number of verified departures tracked. This is the first thing a visitor sees and sets the emotional tone.

#### Functional Requirements
- Display total verified departure count, updated in real time as new profiles are added
- Show a secondary counter for "departures in the last 90 days" to convey recency and momentum
- Display aggregate seniority signal — e.g., "including X Safety Leads, X Research Directors, X Co-founders"
- Animate the counter incrementing when a new departure is added
- The ticker must be embeddable as a widget for third-party sites and social media
- Contextual explainer: a brief inline description ("researchers and leaders who have publicly left major AI companies citing safety or ethical concerns") visible to first-time visitors, dismissible after first visit
- Homepage share button with pre-populated text including the live count — e.g., "X AI researchers have left their companies over safety concerns"
- Dynamic Open Graph images: auto-generated OG image for homepage and theme pages that includes the current ticker count, updated daily — optimized for X, LinkedIn, and Facebook previews

#### Non-Functional Requirements
- Counter must update within 60 seconds of a new profile being published
- The ticker element must occupy 25-30% of above-the-fold viewport area on all screen sizes and be the first interactive element in the visual hierarchy

---

### 8.2 Researcher Profiles

Individual profile pages for each verified departure. These are the atomic unit of the site — everything else aggregates from them.

#### Functional Requirements — Profile Content
- Full name, photo (where publicly available), most recent AI company, role/title
- Date of departure (verified)
- Stated reason for departure — direct quotes from their public statements, sourced with links
- Concern taxonomy tags — categorized from their stated reasons (see Section 8.5)
- Links to all public statements: tweets, LinkedIn posts, interviews, resignation letters
- A timeline of their career at the AI company
- "What happened after" section — updated over time with their post-departure activity, speaking, writing

#### Functional Requirements — Community Layer
- Fan letter / note of support input — any visitor can write a public note to the researcher
- Kudos counter — a simple count of expressions of support (no login required)
- Discussion thread — moderated comments on the profile
- Share buttons with pre-populated text optimized for X and LinkedIn
- Rate limiting on kudos: maximum 1 per profile per client session, with fingerprinting-based deduplication
- Fan letters and comments require human moderation approval before public display
- Spam and abuse filtering on all user-submitted text (automated pre-filter + human review)

#### Filtering & Discovery
- Filter profiles by: company, year, seniority level, concern category, country
- Sort by: date, most kudos, most discussed, most recently updated
- Search by name, company, or keyword from their stated concerns

---

### 8.3 Predictions Tracker & Community Forecasting

The most differentiated feature. A community forecasting layer built on the stated predictions of departing researchers. Users vote on whether they believe predictions will come true, creating a living record of collective belief that updates over time and resolves when evidence emerges.

#### Prediction Sources
- **Primary:** Extracted directly from public statements by tracked researchers at or after departure
- **Secondary:** Curated historical predictions from the broader AI safety community (with clear source attribution)
- All predictions must have: a named source, a date, a link, and a resolution target date or condition

#### Functional Requirements — Voting
- Any visitor can vote: "I think this will come true" / "I don't think this will come true"
- No login required for initial vote; email optional for notifications when prediction resolves
- Votes are timestamped — the distribution can be shown over time as a trend
- Display current community split as a percentage with total vote count
- Show the gap between public vote distribution and the researcher's own stated confidence (where available)
- Rate limiting: maximum 1 vote per prediction per client session, with fingerprinting-based deduplication to prevent ballot stuffing
- Anomaly detection: flag sudden vote spikes for editorial review before updating public-facing percentages
- Lightweight follow options beyond email: RSS feed for all prediction resolutions, and bookmarkable prediction pages with visible status indicators for return visitors

#### Functional Requirements — Resolution
- When a prediction resolves (true or false), a human editor marks it with: outcome, date, source link
- All users who voted are notified (if they provided email)
- Resolved predictions are displayed with outcome prominently — this is a shareable moment
- Track record scorecard per researcher: X of Y predictions resolved true
- Aggregate track record across all researchers — the "credibility index" — displayed with published methodology, sample size caveats, and a link to the full resolution log

#### Editorial Standards
- Predictions must be falsifiable — vague claims ("AI will cause problems") are not eligible
- Prediction framing must be neutral — the site does not editorialize on whether a prediction is alarming or not
- The gap visualization between expert prediction and public belief is a core editorial feature, not commentary

#### Resolution Framework
- Each prediction must have a defined resolution criteria at time of publication — specifying what evidence constitutes "resolved true" or "resolved false"
- Predictions may be marked "partially resolved" with an explanation when evidence is mixed or incomplete
- Resolution decisions require two independent editorial reviews before publication
- A public corrections/appeals mechanism allows users to submit counter-evidence for any resolution decision
- Resolution rationale (evidence links + editorial reasoning) is published alongside the outcome

---

### 8.4 Theme Synthesis Engine

An AI-powered synthesis layer that continuously analyzes the corpus of departure statements and surfaces the recurring themes, their frequency, evolution over time, and distribution across companies. This is what turns 200 profiles into intelligence.

#### Functional Requirements
- Auto-extract and tag concern themes from all profile statements using the AI Synthesis Agent
- Display a living "Theme Map" showing the top N concerns mentioned across departures, with frequency
- Show theme trends over time — are concerns about X increasing or decreasing in recent departures?
- Show theme distribution by company — which companies have departures citing which concerns?
- Surface "emerging themes" — concerns that appear in recent departures but weren't prevalent earlier
- Generate a periodic "State of the Alarm" summary — a 3-5 sentence synthesis of what departing researchers are collectively saying right now

#### Concern Taxonomy (v1)
- **Safety culture** — "the company deprioritizes safety relative to capability/commercialization"
- **Race dynamics** — "competitive pressure between labs prevents adequate safety work"
- **Deceptive alignment** — "AI systems may develop goals misaligned with stated objectives"
- **Governance & oversight** — "insufficient external oversight of AI development"
- **Whistleblower suppression** — "internal concerns are dismissed or penalized"
- **Existential risk** — "the technology poses catastrophic long-term risks"
- **Near-term harms** — "current systems are causing concrete harm now"
- **Regulatory concerns** — "regulation is inadequate or being actively resisted"

---

### 8.5 Regulatory Ideas Section

A curated, sourced collection of specific regulatory and governance proposals that have been publicly advocated by departing researchers. This is not the site's opinion — it is a synthesis of what the experts themselves have proposed.

#### Functional Requirements
- Each proposal linked to its source researcher(s) and their original public statement
- Proposals tagged by type: compute governance, liability frameworks, transparency requirements, international coordination, whistleblower protection, mandatory safety evaluations
- Community voting on which proposals users find most compelling (no login required)
- Filter by proposal type, country applicability, researcher source
- "Currently in legislation" flag for proposals that have been picked up in actual regulatory proceedings

---

### 8.6 Anonymous Signal Feature

A mechanism for people currently inside AI companies to signal that they see the same concerns — without going public. This is one of the most psychologically important features for the insider audience.

#### Functional Requirements
- A simple, anonymous form: "I work at an AI company and I see this too"
- Collect: company (optional), concern category (required), free text (optional, moderated before display)
- Display aggregate signals as a counter: "X people currently inside AI companies have signaled they share these concerns"
- Zero personally identifiable information collected or stored
- Clear, prominent disclosure of what is and is not collected

#### Trust & Safety Requirements
- No IP logging beyond what is required for abuse prevention
- Signals are reviewed by a human moderator before contributing to any public-facing counter
- The feature must have a clear legal review before launch

---

### 8.7 Editorial Transparency & About

Trust is the site's moat. Every audience segment — insiders, journalists, and the general public — needs to understand who operates the site, how editorial decisions are made, and what standards govern content before they engage.

#### Functional Requirements
- **About page:** Organization identity, founding story, mission statement, and the people behind the editorial operation (names and roles of editorial board members)
- **Editorial standards page:** Published methodology for profile verification, prediction resolution criteria, and the human-in-the-loop review process
- **Corrections log:** A public, chronological list of all corrections made to profiles or predictions, with date and explanation
- **Funding transparency:** How the site is funded, with disclosure of any organizational affiliations or sponsors
- **Contact:** Press contact email, general inquiries, and takedown/correction request submission form

#### Institutional Credibility (Launch Requirement)
Content rigor alone is insufficient for journalist and policymaker adoption. The site must have at least one institutional credibility signal at launch:
- **Advisory board:** 3-5 recognized figures in AI safety, journalism ethics, or public interest technology — listed on the About page with their roles
- **Academic or nonprofit affiliation:** Partnership with a university research center, AI safety organization, or journalism institute that lends institutional weight
- **Endorsement:** At least one public endorsement from a recognized figure in the AI safety community before launch
- The advisory board or equivalent must be recruited during Phase 1 (Planning) — this is a prerequisite for journalist outreach, not a Phase 5 concern

#### Trust Verification for Anonymous Signal Feature
- Publish a technical transparency document explaining what data is and is not collected, how abuse prevention works, and what server-side logging exists
- Complete third-party privacy audit of the anonymous signal feature within 90 days of launch, with no critical findings unresolved
- Open-source the anonymous signal submission component by Phase 4 to allow independent verification of privacy claims

---

### 8.8 Journalist Tooling

Journalists and policymakers are a primary audience and the growth flywheel. They need professional-grade tools from launch, not Phase 5.

#### Functional Requirements
- **Permalink queries:** Every filtered view (e.g., "all safety leads who departed in 2025") generates a stable, citation-ready URL
- **Data export:** Export filtered profile lists as CSV or JSON with full source citations — available without login
- **Press page:** Media kit with key statistics, suggested citation format, high-resolution assets, and press contact
- **Journalist notification list:** Email signup for journalists to receive alerts when new profiles are published or predictions resolve — available at launch
- **Embeddable statistics:** Beyond the ticker widget, embeddable cards for specific statistics (e.g., "departures by company" chart, "prediction track record" summary)

---

## 9. AI Agent Architecture

The Warning Collective operates as an AI-native product. The backend is not a traditional CMS with manual data entry — it is an orchestrated system of specialized AI agents that continuously find, verify, synthesize, and update content. Human editors operate as a quality gate, not as primary content producers.

### Architecture Overview

- **Agent Framework:** CrewAI
- **Web Data Layer:** Firecrawl
- **AI Reasoning Engine:** Claude via Anthropic API (claude-sonnet-4-6)
- **Complex Stateful Workflows:** LangGraph (where needed)
- **Vector Database:** Supabase with pgvector

---

### 9.1 The Orchestrator

A master scheduling and routing agent that runs on a configurable schedule (default: every 4 hours). It does not perform tasks itself — it determines what needs to happen, dispatches the appropriate specialist agents, monitors their outputs, and routes results to the human review queue.

**Responsibilities:**
- Monitor trigger sources for new departure signals (news, X, LinkedIn, Reddit)
- Dispatch Scout Agent when new signals are detected
- Route Scout outputs to Verification Agent
- Route verified profiles to Synthesis Agent for tagging and theme analysis
- Dispatch Predictions Tracker Agent on schedule
- Flag items requiring human review and surface them in the editorial dashboard
- Log all agent actions for auditability

---

### 9.2 Scout Agent

Responsible for continuous discovery. Monitors public sources for signals of AI company departures citing ethical or safety concerns. Outputs candidate profiles to the verification queue — it does not make quality judgments.

**Skills:**
- Web crawling via Firecrawl — monitors X/Twitter, LinkedIn, Substack, Reddit AI communities, major tech news outlets
- Keyword and semantic search — context-aware detection of safety-motivated departures
- Deduplication — avoids surfacing the same departure from multiple sources as multiple candidates
- Source metadata extraction — captures original URL, date, platform, author for every candidate

---

### 9.3 Verification Agent

The credibility guardian. Takes Scout candidates and performs multi-source verification before routing to human review. Nothing reaches the human queue without passing verification checks.

**Verification Checks:**
- Confirm the person's employment at the AI company (LinkedIn, company pages, published papers)
- Confirm the departure is real (not a rumor) with at least one primary source
- Confirm the stated reason references ethical, safety, or moral concerns (not a routine career move)
- Extract and source all direct quotes — every quote must have a direct URL
- Flag confidence level: High (primary source), Medium (secondary source confirms), Low (single unverified source)
- Low confidence items are held for human investigation, not published

---

### 9.4 Synthesis Agent

Takes verified profiles and performs the intelligent analysis that creates the site's editorial value. Runs after each new profile is approved and on a weekly full-corpus re-analysis schedule.

**Tasks:**
- Tag each profile with concern taxonomy categories
- Extract falsifiable predictions from departure statements and route to Predictions Tracker
- Update the Theme Map with new frequency data
- Generate or update the "State of the Alarm" summary
- Identify connections between profiles — shared concerns, shared companies, shared time periods
- Flag "emerging themes" when a new concern appears in 3+ recent profiles without historical precedent

---

### 9.5 Predictions Tracker Agent

Monitors for evidence that tracked predictions have resolved — either confirmed or falsified. Runs on a weekly schedule and is also triggered by major AI news events.

**Tasks:**
- For each open prediction, search for recent news/research that constitutes evidence of resolution
- Flag potential resolutions with evidence links for human editor confirmation
- Monitor prediction vote distributions for anomalies
- Generate "Prediction Spotlight" content for predictions approaching their resolution date

---

### 9.6 Agent Quality Expectations

The agent pipeline solves a needle-in-a-haystack problem: safety-motivated departures are rare events in a noisy social media landscape. Quality expectations must be set explicitly to right-size the editorial review burden.

- **Scout Agent expected false positive rate:** Target <50% — i.e., at least half of flagged candidates should be genuine safety-motivated departures after human review. If false positive rate exceeds 70%, reduce source breadth or tighten detection criteria.
- **Verification Agent expected accuracy:** Target >90% agreement with human editorial judgment on confidence level assignment. Track agreement rate monthly.
- **Editorial review burden per agent run:** Track average time-to-review per Scout candidate and per Verification output. If editorial burden exceeds 2 hours per agent cycle, adjust agent frequency or detection thresholds.
- **Graceful degradation:** If agent quality is insufficient at any phase, the site falls back to fully manual curation. The product must work without agents — they accelerate editorial work, they don't replace it.

---

### 9.7 Human-in-the-Loop Editorial Layer

All agent outputs pass through human review before becoming public. The editorial dashboard surfaces the agent's work and requires human approval for:

- Publishing a new researcher profile
- Marking a prediction as resolved
- Publishing a new prediction
- Approving anonymous signals for inclusion in the counter
- Approving fan letters and discussion comments

---

## 10. Technical Stack

| Layer | Technology & Rationale |
|---|---|
| Frontend | Next.js (React) — SEO-friendly, fast, excellent for dynamic content and real-time updates |
| Styling | Tailwind CSS — rapid development, consistent design system |
| Backend / API | Next.js API routes + Supabase — serverless, scalable, real-time subscriptions for live ticker |
| Database | Supabase (PostgreSQL + pgvector) — relational data for profiles/predictions + vector search for semantic synthesis |
| Agent Framework | CrewAI — role-based multi-agent orchestration, fastest path to production, strong MCP support |
| Web Data Layer | Firecrawl — JavaScript rendering, anti-bot handling, MCP server for native agent integration |
| AI Reasoning | Claude via Anthropic API (claude-sonnet-4-6) — strongest reasoning for nuanced judgment calls on departure context |
| Workflow Scheduling | n8n (self-hosted) — visual workflow orchestration for agent scheduling and triggers |
| Search | Algolia or Supabase full-text — fast faceted search across profiles and predictions |
| Analytics | Plausible (privacy-first) — fits the site's values; no Google Analytics |
| Hosting | Vercel (frontend) + Railway or Fly.io (agent backend) |
| Domain | warningcollective.com + warningcollective.org |

---

## 11. Non-Functional Requirements

### Performance
- Homepage loads in under 2 seconds on a 4G connection
- Ticker updates within 60 seconds of a new profile being published
- Search returns results in under 500ms

### Reliability
- 99.5% uptime target
- Agent failures must not affect site availability — agent backend is fully decoupled from frontend

### Security & Privacy
- Anonymous signal feature: zero PII stored, legal review required pre-launch
- No user accounts required for any core features
- GDPR and CCPA compliant by design — validated through a pre-launch compliance self-assessment checklist covering data inventory, consent mechanisms, right-to-deletion flows, and privacy policy accuracy
- All agent activity logged for auditability — logs must include agent name, action type, timestamp, input/output summary, and confidence score; retained for 12 months; accessible to editorial team via dashboard
- Data subject rights: researchers profiled on the site can request corrections or removal of their profile via a published process
- Takedown request handling: documented policy with SLA (respond within 5 business days), published on the site
- All profile content limited to publicly available information — no private or leaked materials

### Accessibility
- WCAG 2.1 AA compliance across all public-facing pages
- Keyboard navigable: all interactive elements (voting, kudos, filters, search) accessible without a mouse
- Screen reader compatible: all data visualizations (ticker, theme map, prediction charts) have text alternatives
- Color contrast ratios meet AA standards for all text and interactive elements

### Editorial Staffing & Sustainability
- **Minimum editorial team at launch:** 1 lead editor (profile review, prediction resolution, editorial standards) + 1 community moderator (fan letters, comments, anonymous signals)
- **At success metric targets** (150+ profiles, 500+ fan letters, 5,000+ votes): editorial review throughput requires approximately 2-3 editorial staff — this must be budgeted before Phase 3
- **Fallback model:** If editorial staffing cannot scale with content volume, reduce agent scheduling frequency and gate community features behind moderation queue capacity rather than lowering review standards
- Human-in-the-loop is non-negotiable — the staffing model must scale with content, not the reverse

### Accuracy & Credibility
- Every published claim has a source link — enforced at the data model level
- Corrections policy: visible correction notice on any profile where information is updated
- No AI-generated content is published without human editorial review

---

## 12. BMAD Development Plan

Development follows the BMAD Method (Breakthrough Method for Agile AI-Driven Development). This document serves as the BMAD Project Brief input.

### Phase 1 — Planning (Weeks 1–2)
- **Content seeding audit:** Validate the baseline departure inventory — research and list all publicly documented safety-motivated departures. If the validated count is below 30, adjust inclusion criteria or content strategy before proceeding.
- **Advisory board recruitment:** Identify and recruit 3-5 advisory board members from AI safety, journalism ethics, or public interest technology
- **Agent pipeline cost modeling:** Estimate monthly operational costs for all agents at planned scheduling frequencies
- **Editorial staffing plan:** Define minimum team, roles, and budget required through Phase 3
- BMAD Architect Agent: Design full system architecture — data models, API contracts, agent communication protocols, deployment topology
- BMAD PM Agent: Convert PRD into epics and user stories with acceptance criteria
- Output: Architecture Decision Records (ADRs), Epic/Story backlog, technical spec, validated departure inventory, cost model

### Phase 2 — Foundation (Weeks 3–6)
- Core data models and Supabase schema
- Basic frontend — homepage with ticker (static data), profile page template
- Scout Agent v1 — manual trigger, single source (X/Twitter)
- Editorial dashboard v1 — review queue, publish/reject
- **Content seeding:** Manual editorial research to create first 20-30 profiles from known historical departures (Hinton, Leike, Saunders, etc.) — this is the launch inventory, not agent-generated
- **Seed predictions:** Curate 15-20 falsifiable predictions from existing public statements to populate the Predictions Tracker at launch
- About page, editorial standards page, and corrections log — live at launch
- Press page with media kit, journalist notification signup, and press contact
- Permalink queries and CSV/JSON data export for filtered profile views
- Dynamic OG images for homepage and profile pages
- **Goal:** First 10 profiles live, ticker working, shareable, journalist-ready

### Phase 3 — Intelligence (Weeks 7–12)
- Verification Agent — automated multi-source verification
- Synthesis Agent — taxonomy tagging, Theme Map
- Predictions Tracker — data model, voting UI, first 20 predictions
- Scout Agent v2 — multi-source, scheduled runs
- **Goal:** Full agent pipeline running, predictions live, site feels alive

### Phase 4 — Community (Weeks 13–18)
- Fan letters and kudos system
- Discussion threads (moderated)
- Anonymous signal feature (post legal review)
- Regulatory ideas section
- Embeddable ticker widget
- **Goal:** All three engagement loops active

### Phase 5 — Growth (Weeks 19–24)
- SEO optimization — profile pages as long-tail search assets
- Public API for researchers and journalists to query the database programmatically
- Predictions Tracker Agent v2 — automated resolution detection
- Third-party privacy audit of anonymous signal feature
- Embeddable statistics cards (beyond ticker widget)
- **Goal:** First major press pickup, 1,000+ monthly active users

---

## 13. Success Metrics

| Metric | Target — 6 Months Post-Launch |
|---|---|
| Verified profiles published | 150+ researchers tracked |
| Monthly unique visitors | 10,000+ |
| Press citations | 5+ major outlets citing the site as a source |
| Prediction votes cast | 5,000+ votes across all open predictions |
| Fan letters / kudos | 500+ expressions of support published |
| Anonymous signals | 200+ signals from current AI employees |
| Return visit rate | 30%+ of users return within 30 days |
| Ticker embeds | 10+ third-party sites embedding the widget |
| Journalist registrations | 50+ journalists subscribed to updates |

---

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| False attribution | Verification Agent + human editorial gate. Low-confidence items never publish. Corrections policy visible on site. |
| Legal exposure from AI companies | All content is factual and sourced. No speculation. Legal review of anonymous signal feature before launch. Editorial policy document published publicly. |
| Perceived bias undermining journalist credibility | Strict factual framing throughout. No site editorializing. Predictions feature includes voting for skeptics. Corrections visible. |
| Agent pipeline quality degradation | Human-in-the-loop is non-negotiable. Agents surface, humans decide. Monitoring and alerting on agent confidence scores. |
| Insider audience afraid to use the site | Anonymous signal feature requires no account. Privacy policy is prominent. No tracking beyond basic analytics. |
| Site becomes echo chamber | Predictions feature explicitly invites skeptical votes. Regulatory section presents proposals, not advocacy. Balanced tone in all synthesized content. |
| Vote manipulation / bot abuse | Rate limiting, fingerprinting-based deduplication, anomaly detection on vote spikes. No public-facing counter updates without passing integrity checks. |
| GDPR/data subject rights claims from profiled researchers | Published takedown policy with 5-day SLA. All content limited to publicly available sources. Corrections mechanism visible on every profile. |
| Agent pipeline operational costs exceed budget | Cost modeling required in Phase 1. Agent scheduling frequency tunable. Fallback to manual editorial workflows if costs spike. Revenue model decision (Open Question) must be resolved before Phase 3. |
| Content stagnation during low-departure periods | Quiet period content strategy: prediction spotlights, "what happened after" updates, historical deep dives, periodic synthesis refreshes. |

---

## 15. Open Questions

- **Legal structure:** Should The Warning Collective operate as a nonprofit (501c3) or LLC? Nonprofit status strengthens credibility with journalists and policymakers but adds operational overhead.
- **Moderation at scale:** Fan letters and discussion threads require human moderation. What is the moderation model and cost structure as the site scales?
- **Researcher consent:** Should researchers be contacted before their profile is published? This adds friction but may generate goodwill and better profile quality.
- **International scope:** Version 1 focuses on US-headquartered AI companies. When and how does the site expand to DeepMind UK, Mistral, and others?
- **Revenue model:** Is this a public interest project funded by grants/donations, or does it have a commercial angle (API access for journalists, premium research reports)?
- **Prediction market evolution:** Does the forecasting feature evolve into a proper prediction market with reputation scoring over time?
- **Relationship with AI safety orgs:** Should The Warning Collective actively partner with organizations like the Center for AI Safety, ARC, or Alignment Forum — or maintain editorial independence?
- **Agent pipeline cost modeling:** What is the projected monthly cost of running 5 AI agents (Claude API, Firecrawl, vector DB operations) at specified frequencies? This must be modeled in Phase 1 before committing to agent scheduling frequency.

---

*The Warning Collective · PRD v1.0 · March 2026 · Bly-Baret LLC*
