---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: complete
completedAt: '2026-03-12'
inputDocuments: ['docs/prd.md', 'docs/prd-validation-report.md', '_bmad-output/planning-artifacts/ux-design-specification.md']
workflowType: 'architecture'
project_name: 'warning-collective'
user_name: 'Jax'
date: '2026-03-12'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The PRD defines 8 public-facing feature areas (8.1–8.8) and a 7-part AI agent architecture (9.1–9.7), phased across 5 implementation phases.

**MVP (Phase 2) — 4 feature areas:**

1. **Momentum Ticker (8.1)** — Real-time departure counter, embeddable widget, dynamic OG images, share button. _Architectural implications:_ SSR for instant render, real-time subscription for live updates, OG image generation pipeline, embed script hosting.
2. **Researcher Profiles (8.2, content only)** — Profile pages with sourced quotes, timeline, taxonomy tags, calls for change, filtering by 5 facets. _Architectural implications:_ Relational data model, slug-based dynamic routes, client-side filtering (TanStack Table for 40–60 profiles), CSV/JSON export, URL-as-state.
3. **Editorial Transparency (8.7)** — About page, editorial standards, corrections log, funding disclosure, advisory board. _Architectural implications:_ Simple — static/MDX content pages, corrections log as append-only data.
4. **Journalist Tooling (8.8)** — Permalink queries, data export, press page, notification signup. _Architectural implications:_ URL-as-state pattern, client-side export, email list integration, embeddable statistics widgets.

**Growth (Phases 3–4) — 4 additional feature areas:**

5. **Predictions Tracker (8.3)** — Community forecasting with insider-gated voting, resolution framework, credibility index. _Architectural implications:_ Voting data model, rate limiting, fingerprint-based deduplication, anomaly detection, two-reviewer resolution workflow.
6. **Theme Synthesis (8.4)** — AI-generated taxonomy, theme map, trend analysis, "State of the Alarm" summaries. _Architectural implications:_ Vector embeddings (pgvector), AI synthesis pipeline, scheduled full-corpus re-analysis.
7. **Community Layer (8.2 extension)** — Fan letters, kudos, moderated discussions. _Architectural implications:_ User-generated content pipeline, moderation queue, spam filtering, rate limiting.
8. **Anonymous Signal (8.6)** — Zero-PII anonymous form with aggregate counter. _Architectural implications:_ Privacy-by-design data model, abuse prevention without storing PII, pre-launch legal review requirement.

**AI Agent Pipeline (all phases):**

5 specialized agents (Scout, Verification, Synthesis, Predictions Tracker) coordinated by an Orchestrator, running on n8n schedules (default: every 4 hours). All outputs pass through a human editorial dashboard before publication. CrewAI framework with Firecrawl for web data and Claude API for reasoning. Graceful degradation: site must work without agents — they accelerate editorial work, not replace it.

**Non-Functional Requirements:**

| Category | Key Requirements | Architectural Impact |
|---|---|---|
| Performance | <2s homepage load, <60s ticker update, <500ms search | SSR with edge caching, real-time subscriptions, client-side filtering for MVP scale |
| Reliability | 99.5% uptime, agent failures ≠ frontend outage | Fully decoupled frontend/agent architecture, independent deployment |
| Security & Privacy | Zero PII for anonymous signal, GDPR/CCPA, no user accounts, all agent activity logged with 12-month retention | Privacy-by-design data models, audit logging pipeline, data subject rights workflows |
| Accessibility | WCAG 2.1 AA, keyboard navigable, screen reader compatible | Semantic HTML, ARIA, Radix UI primitives, axe-core + Lighthouse CI merge gates |
| Accuracy & Credibility | Every claim sourced, corrections policy, no AI content without human review | `source_url NOT NULL` constraint, editorial review workflow, corrections log |
| Editorial Staffing | 1 lead editor + 1 moderator at launch, scaling to 2–3 | Editorial dashboard as primary workflow surface, agent pipeline reduces manual discovery burden |

### Scale & Complexity Assessment

| Indicator | Assessment |
|---|---|
| Real-time features | Limited — ticker updates and vote bar refreshes, not real-time collaboration |
| Multi-tenancy | None — single editorial team |
| Regulatory compliance | GDPR/CCPA, data subject rights, anonymous signal privacy audit |
| Integration complexity | Medium-High — 5 AI agents, Claude API, Firecrawl, Supabase, n8n, Plausible |
| User interaction complexity | Low-Medium — browse, filter, vote (no accounts, no forms beyond anonymous signal) |
| Data complexity | Medium — profiles, predictions, taxonomy, votes, agent logs, moderation queue, OG metadata cache |

- **Primary domain:** Full-stack web application with AI agent backend
- **Complexity level:** Medium — content-heavy editorial platform with moderate AI pipeline complexity
- **Estimated architectural components:** ~12 (frontend app, API layer, database, localStorage session management, agent orchestrator, 4 agent services, editorial dashboard, OG image generator, email notification service, embed widget)

### Technical Constraints & Dependencies

**PRD-specified stack (Section 10):**

| Layer | Technology | Constraint Level |
|---|---|---|
| Frontend | Next.js on Vercel | Fixed |
| Styling | Tailwind CSS + shadcn/ui | Fixed |
| Database | Supabase (PostgreSQL + pgvector) | Fixed |
| Agent framework | CrewAI + Firecrawl + Claude API | Fixed |
| Workflow scheduling | n8n (self-hosted) | Fixed |
| Analytics | Plausible (privacy-first) | Fixed |
| Agent hosting | Railway or Fly.io | Flexible |

**UX-derived constraints:**

- Self-hosted Source Serif 4 font — no third-party font services (privacy requirement)
- localStorage for all session continuity — no user accounts, no server-side sessions
- Client-side filtering via TanStack Table for MVP (40–60 profiles)
- URL-as-state for filter persistence and permalink sharing (human-readable params)
- Dynamic OG image generation with daily count refresh
- JSON-LD structured data on all page types (WebSite, Person, Article, Claim)
- Print stylesheet for journalist profile printing
- Dark mode semantic token architecture ready at launch (light-only MVP, flip-on later)
- axe-core + Lighthouse accessibility scores as CI merge gates
- Company aggregate pages as a new page type (from SEO architecture)

**External service dependencies:**

| Service | Purpose | Failure Impact |
|---|---|---|
| Anthropic API (Claude) | AI reasoning for all agents | Agent pipeline stops; frontend unaffected |
| Firecrawl | Web scraping for Scout agent | Discovery stops; existing content unaffected |
| Supabase | Database, real-time subscriptions, vector search | Critical — frontend data source |
| Vercel | Frontend hosting, edge functions, OG generation | Critical — site unavailable |
| n8n (self-hosted) | Workflow scheduling | Agent scheduling stops; manual triggers available |
| Plausible | Analytics | Non-critical — analytics gap only |

**Key architectural constraint:** No user accounts. All personalization (ticker delta, insider verification, vote state) lives in localStorage. This eliminates auth complexity but means no cross-device persistence and no server-side user data. Duplicate votes across devices are accepted as a known limitation.

### Cross-Cutting Concerns

1. **Editorial Review Pipeline** — Every content path (profiles, predictions, fan letters, anonymous signals) converges on a human review queue before publication. The editorial dashboard is the system's central nervous system. Must support multi-reviewer workflows (prediction resolution requires two independent reviews).

2. **Source Verification Chain** — Every published claim must have a verified source URL. Enforced at the data model level (`source_url NOT NULL`), flowing through Scout → Verification → Editorial Review → Publication. Source metadata (OG title, domain, date) cached at publication time for hover previews.

3. **Rate Limiting & Abuse Prevention** — Voting, kudos, fan letters, and anonymous signals all need rate limiting. Fingerprint-based deduplication without PII storage. Anomaly detection on prediction vote spikes. Consistent approach needed across all interactive features.

4. **Real-time Updates** — Ticker count, vote bars, and Latest Activity need near-real-time updates (within 60 seconds). Supabase real-time subscriptions handle this. Frontend must manage subscription lifecycle, reconnection, and graceful fallback (stale-while-revalidate).

5. **SEO & Social Sharing** — Every page type needs optimized meta tags, JSON-LD structured data, canonical URLs (especially for filtered views), and dynamic OG images. Cross-cutting concern touching routing, data fetching, build pipeline, and content publishing workflow.

6. **Privacy by Design** — No PII in anonymous signals, no user accounts, privacy-first analytics (Plausible), self-hosted fonts, GDPR/CCPA compliance by design. Privacy shapes every data flow and eliminates common patterns (sessions, user profiles, tracking pixels).

7. **Phased Feature Rollout** — Architecture must support clean feature boundaries for the 5-phase plan. MVP ships 4 of 8 feature areas. Data model and API must accommodate growth features (predictions voting, community layer, anonymous signal) without schema-breaking migrations. Feature flags at the route/page level, not the component level.

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application — content-heavy editorial platform with SSR requirements, real-time subscriptions, and AI agent backend. The PRD (Section 10) specifies the stack explicitly: Next.js, Tailwind CSS, Supabase, with shadcn/ui and TanStack Table confirmed in the UX specification.

### Technical Preferences (from PRD)

| Category | Decision | Source |
|---|---|---|
| Language | TypeScript | PRD Section 10 |
| Frontend framework | Next.js (App Router) | PRD Section 10 |
| Styling | Tailwind CSS + shadcn/ui | PRD Section 10 + UX Spec |
| Database | Supabase (PostgreSQL + pgvector) | PRD Section 10 |
| Data grid | TanStack Table | UX Spec |
| Agent framework | CrewAI + Firecrawl + Claude API | PRD Section 9/10 |
| Workflow scheduling | n8n (self-hosted) | PRD Section 10 |
| Analytics | Plausible | PRD Section 10 |
| Frontend hosting | Vercel | PRD Section 10 |
| Agent hosting | Railway or Fly.io | PRD Section 10 |

### Starter Options Considered

**Option A: Community starters (supa-next-starter, nextbase, etc.)**
Multiple community templates exist that bundle Next.js + Supabase + Tailwind + shadcn/ui. However, they all include authentication scaffolding (login flows, session management, protected routes) — which this project explicitly does not need. The Warning Collective has no user accounts. Stripping auth from an auth-first starter creates more work than adding Supabase to a clean starter.

**Option B: create-t3-app**
The T3 stack bundles tRPC (typed API layer) and Prisma (ORM). This project uses Supabase client libraries (not Prisma) and Next.js API routes (not tRPC). T3's opinions conflict with the PRD-specified stack.

**Option C: create-next-app (official) + shadcn init + manual additions** ✅
The official Next.js starter provides a minimal, unopinionated foundation. shadcn/ui has its own CLI init. Supabase and TanStack Table are added as dependencies. Maximum control, no unwanted scaffolding, exact alignment with PRD stack.

### Selected Starter: create-next-app + shadcn/ui CLI

**Rationale:** The PRD already specifies every major technology decision. No starter template makes all these decisions simultaneously without also imposing opinions we don't want (auth, ORM, API patterns). The official `create-next-app` + `shadcn init` approach gives us the exact foundation with zero unwanted scaffolding.

**Initialization Sequence:**

```bash
# 1. Create Next.js project (Next.js 16, App Router, TypeScript, Tailwind, ESLint)
npx create-next-app@latest warning-collective --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Initialize shadcn/ui (configures Tailwind, adds cn utility, sets up CSS variables)
cd warning-collective
npx shadcn@latest init

# 3. Add Supabase client libraries
npm install @supabase/supabase-js @supabase/ssr

# 4. Add TanStack Table
npm install @tanstack/react-table

# 5. Add Plausible analytics
npm install next-plausible
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript strict mode, Next.js 16 with App Router
- React 19 with Server Components as default
- Node.js runtime for API routes, Edge runtime available for middleware

**Styling Solution:**
- Tailwind CSS 4 with CSS variables for theming
- shadcn/ui component primitives (copy-paste model, owned code)
- Radix UI accessibility primitives underneath
- CSS variable-based design tokens for light/dark mode

**Build Tooling:**
- Turbopack for development (Next.js 16 default)
- Webpack for production builds
- Vercel deployment optimization built-in

**Testing Framework:**
- Not included by starter — to be decided in architectural decisions (Step 4)
- Candidates: Vitest (unit/integration) + Playwright (E2E + accessibility)

**Code Organization:**
- `src/` directory with App Router structure
- `src/app/` for routes and layouts
- `src/components/` for UI components (shadcn installs here)
- `src/lib/` for utilities and Supabase client setup
- `@/*` import alias for clean imports

**Development Experience:**
- Turbopack hot reload in development
- TypeScript type checking
- ESLint with Next.js recommended rules
- Vercel CLI for preview deployments

**Post-Initialization Setup (first implementation story):**

1. Configure Supabase client (server + browser clients per @supabase/ssr pattern)
2. Set up environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY)
3. Install shadcn/ui components: Button, Badge, Card, DropdownMenu, Popover, Tooltip, Table, Toast, NavigationMenu
4. Configure design tokens (Slate & Ink palette, Source Serif 4 font, spacing system)
5. Set up Plausible analytics provider
6. Configure axe-core + Lighthouse CI for accessibility merge gates

**Note:** Project initialization using this sequence should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Data model schema design — profiles, predictions, taxonomy, votes, editorial queue
2. Supabase client architecture — server vs. browser client pattern with @supabase/ssr
3. Real-time subscription strategy — ticker updates, vote bar refresh
4. Editorial dashboard authentication — Supabase Auth for editors
5. Testing framework — Vitest + Playwright with axe-core CI gates

**Important Decisions (Shape Architecture):**
6. Validation strategy — Zod shared schemas
7. OG image generation — next/og with Satori
8. Caching and data fetching — ISR + React Server Components + client-side TanStack Table
9. Rate limiting approach — fingerprint-based, edge middleware
10. Agent ↔ database communication — Supabase service role key

**Deferred Decisions (Post-MVP):**
- Algolia vs. Supabase full-text search migration (deferred until 500+ profiles)
- Agent hosting provider final selection (Railway vs. Fly.io — evaluate during Phase 2)
- Dark mode color values (tokens defined, light-only MVP)
- Public API design (Phase 5)
- Prediction market evolution (open question from PRD)

### Data Architecture

**Database: Supabase PostgreSQL + pgvector**
- Decision: Fixed by PRD Section 10
- Version: Supabase latest (PostgreSQL 15+, pgvector 0.7+)
- Rationale: Relational data model for structured profiles/predictions, pgvector for semantic theme synthesis, real-time subscriptions for ticker/voting, Row Level Security for editorial access control

**Data Modeling Approach:**
- Decision: Relational schema with Supabase, Row Level Security (RLS) policies
- Rationale: Profiles, predictions, votes, and editorial queue are inherently relational. RLS policies enforce that only authenticated editors can write, while the public can read published content. No ORM — use Supabase client library directly for type-safe queries.
- Affects: All feature areas

**Core Schema Outline:**

| Table | Purpose | Key Columns |
|---|---|---|
| `profiles` | Researcher departure records | id, slug, name, company, role, departure_date, status (draft/published), source_urls (JSONB), concern_tags, calls_for_change_tags, created_at, updated_at |
| `profile_quotes` | Sourced quotes per profile | id, profile_id (FK), quote_text, source_url (NOT NULL), source_title, source_domain, og_metadata (JSONB) |
| `profile_timeline` | Career timeline entries | id, profile_id (FK), event_type, event_date, description, source_url |
| `predictions` | Extracted falsifiable predictions | id, profile_id (FK), prediction_text, source_url, resolution_target_date, status (open/confirmed/disproven/partial), resolution_date, resolution_evidence_url, resolution_rationale |
| `prediction_votes` | Insider votes on predictions | id, prediction_id (FK), vote (agree/disagree), fingerprint_hash, is_insider (boolean), created_at |
| `concern_taxonomy` | Concern categories | id, slug, label, description, parent_id (self-referencing for two-level) |
| `calls_for_change` | Specific proposals | id, slug, label, description, proposal_type, legislation_flag |
| `editorial_queue` | Agent output review queue | id, source_agent, content_type, content_payload (JSONB), confidence_level (high/medium/low), status (pending/approved/rejected), reviewer_id, reviewed_at |
| `corrections` | Public corrections log | id, profile_id (FK), correction_text, correction_date, original_text |
| `ticker_stats` | Cached aggregate stats | id, total_count, recent_90d_count, company_count, senior_pct, last_updated |
| `companies` | Company aggregate data | id, slug, name, logo_url, profile_count, departure_timeline (JSONB) |

**Phase 3+ tables (schema reserved, not populated in MVP):**

| Table | Purpose |
|---|---|
| `fan_letters` | Community support messages |
| `kudos` | Simple support counter per profile |
| `discussions` | Moderated comment threads |
| `anonymous_signals` | Zero-PII anonymous signals |
| `agent_logs` | Agent activity audit trail |

**Source URL constraint:** Every `profile_quotes` row has `source_url NOT NULL`. Every profile must have at least one sourced quote. This is the credibility enforcement at the data layer.

**Validation Strategy:**
- Decision: Zod for shared validation schemas
- Version: Zod 3.x
- Rationale: Single schema definition shared between server (API routes, Server Actions) and client (form validation). `safeParse()` for non-throwing validation. Type inference from schemas eliminates duplicate TypeScript types.
- Pattern: Schema files in `src/lib/schemas/` — imported by both server and client code

**Migration Approach:**
- Decision: Supabase CLI migrations (SQL-based)
- Rationale: Supabase provides `supabase migration new` and `supabase db push` commands. SQL migrations are version-controlled, deterministic, and agent-readable. No ORM migration abstraction layer.
- Pattern: `supabase/migrations/` directory in repo, applied via CI

**Caching Strategy:**

| Data Type | Caching Pattern | TTL |
|---|---|---|
| Homepage ticker stats | `ticker_stats` table + ISR revalidation | 60 seconds (matches NFR) |
| Profile pages | Next.js ISR with on-demand revalidation on publish | Revalidate on editorial publish action |
| Profile list (browse) | React Server Component fetch + TanStack Table client-side | ISR 5 minutes |
| Prediction vote counts | Supabase real-time subscription (client-side) | Real-time |
| OG metadata for source previews | Cached in `profile_quotes.og_metadata` JSONB at publish time | Permanent (refresh on editorial update) |
| Company aggregate pages | ISR with on-demand revalidation | Revalidate on profile publish |

**Real-time Strategy:**
- Decision: Supabase Realtime subscriptions for ticker and vote bars
- Pattern: Subscribe to `ticker_stats` table changes for ticker. Subscribe to `prediction_votes` aggregate for vote bars. Client-side subscription management with reconnection handling.
- Fallback: If subscription disconnects, stale data displayed (already SSR'd). No error state — stale-while-revalidate.

### Authentication & Security

**Public Features: No Authentication**
- Decision: No user accounts for any public-facing feature (confirmed by PRD)
- Rationale: Reduces friction to zero for all three audiences. Insider voting uses honor-system self-identification via localStorage. All personalization (ticker delta, vote state, insider verification) is device-local.
- Trade-off: No cross-device persistence. Accepted as a known limitation for MVP.

**Editorial Dashboard: Supabase Auth**
- Decision: Supabase Auth with email/password for editorial team (1–3 editors at launch)
- Rationale: Native integration with Supabase RLS. No OAuth complexity needed for a small internal team. Magic link as backup auth method.
- RLS Policy: Published content is public-read. Draft content and editorial queue require authenticated editor role.

**Agent → Database: Service Role Key**
- Decision: Supabase service role key for agent access (bypasses RLS)
- Rationale: Agents need write access to editorial queue and read access to all content. Service role key is used server-side only, never exposed to client. Stored in agent deployment environment variables.
- Security: Service role key is never in frontend code, never in git. Stored in Railway/Fly.io environment config.

**Rate Limiting & Abuse Prevention:**
- Decision: Fingerprint-based rate limiting without PII storage
- Implementation: Hash of User-Agent + Accept-Language + screen resolution (via client-side collection) → stored as `fingerprint_hash` in votes table. No IP logging beyond what hosting providers do by default.
- Limits: 1 vote per prediction per fingerprint, 1 kudos per profile per session, fan letters require moderation (no rate limit on submission, moderation queue is the gate).
- Anomaly detection: Scheduled query checks for vote spike patterns (>3x normal rate on any prediction within 1 hour). Flagged for editorial review before updating public-facing percentages.

**API Security:**
- Next.js API routes protected by Supabase RLS (public read, authenticated write)
- Server Actions validate all inputs with Zod schemas
- CORS: Default Vercel/Next.js CORS — same-origin for API routes
- Content Security Policy: Strict CSP header — no inline scripts, self-hosted fonts only, Plausible analytics domain allowed
- No API keys exposed to client (Supabase publishable key is designed for client use)

### API & Communication Patterns

**Primary API Pattern: Next.js Server Components + Supabase Client**
- Decision: No separate REST API layer. Data fetched directly in React Server Components via Supabase client. Interactive mutations via Next.js Server Actions.
- Rationale: Profiles and predictions are read-heavy. Server Components fetch data at render time with zero client-side JavaScript for initial load. Mutations (voting, export triggers) use Server Actions with Zod validation.
- Pattern: `src/lib/supabase/server.ts` (server client), `src/lib/supabase/browser.ts` (browser client for real-time subscriptions)

**Agent → Database Communication:**
- Decision: Direct Supabase access via service role key from agent backend
- Pattern: CrewAI agents write to `editorial_queue` table. n8n workflows trigger agent runs and read results. No API gateway between agents and database.
- Rationale: Agents run server-side with full trust. RLS bypass via service role is appropriate for a backend service. Simplest possible integration.

**Error Handling Standards:**

| Layer | Pattern |
|---|---|
| Server Components | Try/catch with error.tsx boundary. Log to server, show generic message to user. |
| Server Actions | Zod `safeParse()` → return `{ success: false, errors: [...] }` for validation failures. Generic "Something went wrong" for unexpected errors. |
| Real-time subscriptions | Silent reconnection. Stale data displayed without error state. |
| Agent pipeline | Errors logged to `agent_logs` table. Editorial dashboard surfaces agent errors. Frontend never sees agent failures. |
| Source preview tooltips | OG data unavailable → no tooltip shown, standard link behavior. Silent degradation. |

**Inter-Service Communication:**

| From | To | Pattern |
|---|---|---|
| Frontend (SSR) | Supabase | Server client, direct query |
| Frontend (client) | Supabase | Browser client, real-time subscriptions |
| Agents (CrewAI) | Supabase | Service role key, direct write to editorial_queue |
| n8n | Agents | HTTP trigger / cron schedule |
| n8n | Supabase | Service role key for workflow queries |
| Editorial dashboard | Supabase | Authenticated client (editor role) |

### Frontend Architecture

**State Management:**
- Decision: No global state management library. Three state sources:
  1. **URL state** — filter params, sort order, view mode (TanStack Table syncs with URL)
  2. **localStorage** — insider verification, vote state, last-seen ticker count, hasVisited flag
  3. **Server state** — React Server Components for initial data, Supabase real-time for live updates
- Rationale: No user accounts means no auth state. No complex client-side state trees. URL is the shareable source of truth for all filter/sort state. localStorage handles the thin client-side personalization layer.

**Component Architecture:**
- Decision: shadcn/ui primitives + 8 custom components (from UX specification)
- Pattern: `src/components/ui/` for shadcn components, `src/components/custom/` for the 8 custom components (Ticker Block, Stats Bridge, Profile Card, Profile Page Layout, Insider Vote Bar, Filter Panel, Source Preview Tooltip, Latest Activity Slot)
- Design tokens: CSS variables defined in `src/app/globals.css`, following Slate & Ink palette from UX spec

**Data Fetching Pattern:**

| Page | Fetch Strategy | Rationale |
|---|---|---|
| Homepage | ISR (60s revalidate) for ticker stats. Server Component for Latest Activity. | Ticker NFR: update within 60 seconds. |
| Profile browse | ISR (5min) for profile list. TanStack Table client-side filtering. | 40–60 profiles fit in client memory. Instant filtering, no loading states. |
| Individual profile | ISR with on-demand revalidation. Server Component. | Revalidated when editor publishes update. |
| Predictions | ISR (5min) for prediction list. Real-time subscription for vote counts. | Votes update live. Prediction list is moderately dynamic. |
| Company aggregate | ISR with on-demand revalidation. | New page type — revalidated on profile publish. |
| Static pages (about, standards) | Static generation at build time. | Content changes rarely. |

**Routing Structure:**

```
src/app/
├── page.tsx                          # Homepage (ticker, stats bridge, latest activity, profile browse)
├── profiles/
│   ├── page.tsx                      # Profile browse with filtering
│   └── [slug]/page.tsx               # Individual profile
├── predictions/
│   └── page.tsx                      # Predictions tracker
├── calls-for-change/
│   └── page.tsx                      # Aggregated calls for change
├── companies/
│   └── [slug]/page.tsx               # Company aggregate page
├── about/page.tsx                    # About page
├── editorial-standards/page.tsx      # Editorial standards
├── press/page.tsx                    # Press page + media kit
├── api/
│   ├── og/route.tsx                  # Dynamic OG image generation
│   ├── export/route.ts               # CSV/JSON export endpoint
│   └── revalidate/route.ts           # On-demand ISR revalidation webhook
├── layout.tsx                        # Root layout (nav, Plausible, fonts)
├── globals.css                       # Design tokens (Slate & Ink palette)
└── error.tsx                         # Global error boundary
```

**OG Image Generation:**
- Decision: `next/og` (ImageResponse) with Satori, running on Vercel Edge Runtime
- Pattern: `src/app/api/og/route.tsx` generates dynamic OG images
- Templates: Homepage OG (dark ticker block with count), Profile OG (name + company + quote), Prediction OG (prediction text + sentiment bar)
- Refresh: Homepage OG regenerated daily via cron. Profile/prediction OG generated on publish.
- Dimensions: 1200×630px (standard OG), dark background matching `--surface-inverse`
- Font: Inter loaded as ArrayBuffer for Satori (Source Serif 4 for headings in OG images)

**SEO Implementation:**
- JSON-LD via `<script type="application/ld+json">` in page layouts
- Canonical URLs set via Next.js metadata API — filtered views point canonical to unfiltered page
- XML sitemap generated at build time via `next-sitemap` or custom route handler
- Meta descriptions auto-generated from profile data
- `robots.txt` allows all crawlers

**Performance Budget:**

| Metric | Target | Enforcement |
|---|---|---|
| LCP (Largest Contentful Paint) | <2.0s | Lighthouse CI |
| FID (First Input Delay) | <100ms | Lighthouse CI |
| CLS (Cumulative Layout Shift) | <0.1 | Lighthouse CI — SSR ticker prevents shift |
| Bundle size (first load JS) | <150KB | Build output check |
| Profile page TTI | <1.5s | Lighthouse CI |

### Infrastructure & Deployment

**Hosting Topology:**

```
┌─────────────────────────────────────────────────────┐
│                    Vercel                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Next.js App  │  │ Edge Functions│  │ OG Image   │ │
│  │  (SSR + ISR)  │  │ (middleware)  │  │ Generation │ │
│  └──────┬───────┘  └──────────────┘  └────────────┘ │
└─────────┼───────────────────────────────────────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────────┐
│      Supabase       │     │   Railway / Fly.io      │
│  ┌───────────────┐  │     │  ┌───────────────────┐  │
│  │  PostgreSQL   │  │◄────│  │  CrewAI Agents    │  │
│  │  + pgvector   │  │     │  │  (Scout, Verify,  │  │
│  ├───────────────┤  │     │  │   Synth, Predict) │  │
│  │  Realtime     │  │     │  └───────────────────┘  │
│  ├───────────────┤  │     │  ┌───────────────────┐  │
│  │  Auth         │  │     │  │  n8n (self-hosted)│  │
│  │  (editors)    │  │     │  │  Workflow scheduler│  │
│  └───────────────┘  │     │  └───────────────────┘  │
└─────────────────────┘     └─────────────────────────┘
          │
          ▼
┌─────────────────────┐
│  External Services   │
│  Anthropic API       │
│  Firecrawl           │
│  Plausible           │
└─────────────────────┘
```

**CI/CD Pipeline:**
- Decision: GitHub Actions for CI, Vercel for frontend CD, separate pipeline for agent deployment
- Frontend: Push to main → GitHub Actions (lint, type check, Vitest unit tests, Playwright E2E + axe-core accessibility) → Vercel auto-deploy
- Agent backend: Push to agent branch → GitHub Actions (Python lint, agent unit tests) → Deploy to Railway/Fly.io
- Merge gates: Zero axe-core AA violations, Lighthouse accessibility ≥95, all tests pass

**Testing Framework:**
- Decision: Vitest (unit/integration) + Playwright (E2E + accessibility)
- Vitest: Fast, ESM-native, Jest-compatible API. Shared Vite/Turbopack config. Component testing with @testing-library/react.
- Playwright: Cross-browser E2E testing. @axe-core/playwright for accessibility CI gate. Multi-browser (Chromium, Firefox, WebKit).
- Pattern: `src/**/*.test.ts` for unit tests (Vitest), `tests/e2e/**/*.spec.ts` for E2E (Playwright)

**Environment Configuration:**

| Environment | Purpose | Config |
|---|---|---|
| Development | Local development | `.env.local` with Supabase dev project |
| Preview | PR preview deployments | Vercel preview with Supabase staging |
| Production | Live site | Vercel production with Supabase production |

**Environment Variables:**

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client + Server | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin access for API routes, revalidation |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Client | Plausible analytics domain |
| `ANTHROPIC_API_KEY` | Agent backend only | Claude API access |
| `FIRECRAWL_API_KEY` | Agent backend only | Firecrawl access |

**Monitoring & Observability:**
- Vercel Analytics: Web Vitals (LCP, FID, CLS), function execution times
- Plausible: Privacy-first page views, referral sources, geographic distribution
- Supabase Dashboard: Database performance, real-time connection count, query performance
- Agent logs: `agent_logs` table with agent name, action type, timestamp, input/output summary, confidence score (per NFR)
- Alerting: Vercel deployment failure notifications, Supabase connection limit alerts

### Decision Impact Analysis

**Implementation Sequence:**

1. **Project initialization** — create-next-app + shadcn init + deps (Story 1)
2. **Design tokens** — Slate & Ink palette, Source Serif 4, spacing system (Story 2)
3. **Supabase schema** — Core tables (profiles, quotes, taxonomy, companies, ticker_stats) + RLS policies (Story 3)
4. **Supabase client setup** — Server and browser clients per @supabase/ssr pattern (Story 4)
5. **Ticker Block + homepage** — SSR ticker, ISR revalidation, real-time subscription (Story 5)
6. **Profile pages** — Browse (TanStack Table + cards) + individual profile pages (Stories 6-7)
7. **Journalist tooling** — Filtering, URL-as-state, export, permalinks (Story 8)
8. **Editorial dashboard** — Auth, review queue, publish workflow (Stories 9-10)
9. **Content seeding** — Manual profile entry for first 20-30 profiles (parallel with dev)
10. **OG images + SEO** — Dynamic OG generation, JSON-LD, sitemap (Story 11)
11. **Testing + CI gates** — Vitest, Playwright, axe-core, Lighthouse (continuous from Story 1)

**Cross-Component Dependencies:**

| Decision | Depends On | Blocks |
|---|---|---|
| Supabase schema | — | All data-dependent features |
| Supabase client setup | Schema | Ticker, profiles, predictions, editorial |
| Design tokens | — | All UI components |
| ISR revalidation | Supabase client, editorial workflow | Ticker accuracy, profile freshness |
| Real-time subscriptions | Supabase client | Ticker live updates, vote bar updates |
| Editorial auth | Supabase Auth | Editorial dashboard, content publishing |
| Rate limiting | Fingerprint approach | Prediction voting, kudos |
| OG image generation | Profile data, design tokens | Social sharing, SEO |

## Implementation Patterns & Consistency Rules

_These patterns exist to prevent conflicts when multiple AI agents implement different stories against the same codebase. Every pattern addresses a specific decision point where agents could reasonably make different choices._

### Naming Patterns

**Database Naming Conventions:**

| Element | Convention | Example |
|---|---|---|
| Tables | lowercase plural snake_case | `profiles`, `prediction_votes`, `editorial_queue` |
| Columns | lowercase snake_case | `departure_date`, `source_url`, `fingerprint_hash` |
| Foreign keys | `{singular_referenced_table}_id` | `profile_id`, `prediction_id` |
| Boolean columns | `is_` or `has_` prefix | `is_insider`, `has_photo`, `is_published` |
| Timestamps | `_at` suffix | `created_at`, `updated_at`, `reviewed_at` |
| JSON columns | noun describing the content | `og_metadata`, `source_urls`, `departure_timeline` |
| Indexes | `idx_{table}_{columns}` | `idx_profiles_company`, `idx_predictions_status` |
| Enum-like columns | Use text with CHECK constraint | `status TEXT CHECK (status IN ('draft', 'published', 'archived'))` |

**URL & Route Naming:**

| Element | Convention | Example |
|---|---|---|
| Page routes | lowercase kebab-case | `/profiles`, `/calls-for-change`, `/editorial-standards` |
| Dynamic segments | `[slug]` (not `[id]`) for public pages | `/profiles/[slug]`, `/companies/[slug]` |
| API routes | `/api/{resource}` lowercase | `/api/og`, `/api/export`, `/api/revalidate` |
| Query parameters | snake_case (matches DB columns) | `?company=openai&concern=safety-deprioritization` |
| Slugs | lowercase kebab-case from name | `elena-rodriguez`, `openai`, `safety-deprioritization` |

**TypeScript Code Naming:**

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `TickerBlock`, `ProfileCard`, `InsiderVoteBar` |
| Component files | PascalCase.tsx | `TickerBlock.tsx`, `ProfileCard.tsx` |
| Utility files | camelCase.ts | `formatDate.ts`, `supabaseClient.ts` |
| Functions | camelCase | `getProfiles()`, `formatDepartureDate()` |
| Variables | camelCase | `profileCount`, `isInsider`, `lastSeenCount` |
| Constants | SCREAMING_SNAKE_CASE | `TICKER_REVALIDATE_SECONDS`, `MAX_LATEST_ACTIVITY` |
| Types/Interfaces | PascalCase, singular | `Profile`, `Prediction`, `InsiderVote` |
| Zod schemas | camelCase + `Schema` suffix | `profileSchema`, `predictionVoteSchema` |
| Hooks | `use` prefix, camelCase | `useTickerSubscription`, `useFilterState` |
| Server Actions | camelCase, verb-first | `castVote`, `exportProfiles`, `revalidateProfile` |

### Structure Patterns

**Project Organization:**

```
src/
├── app/                          # Next.js App Router (routes + layouts)
│   ├── (public)/                 # Public page group
│   │   ├── profiles/
│   │   ├── predictions/
│   │   ├── calls-for-change/
│   │   ├── companies/
│   │   ├── about/
│   │   ├── editorial-standards/
│   │   └── press/
│   ├── (editorial)/              # Editor-authenticated pages
│   │   └── dashboard/
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Design tokens
│   └── error.tsx                 # Global error boundary
├── components/
│   ├── ui/                       # shadcn/ui components (auto-installed)
│   ├── custom/                   # 8 custom components from UX spec
│   │   ├── TickerBlock.tsx
│   │   ├── StatsBridge.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── ProfilePageLayout.tsx
│   │   ├── InsiderVoteBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── SourcePreviewTooltip.tsx
│   │   └── LatestActivitySlot.tsx
│   └── shared/                   # Shared composed components
│       ├── Navigation.tsx
│       ├── Footer.tsx
│       └── ShareButton.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # Server-side Supabase client
│   │   ├── browser.ts            # Browser-side Supabase client
│   │   └── types.ts              # Database types (generated by Supabase CLI)
│   ├── schemas/                  # Zod validation schemas
│   │   ├── profile.ts
│   │   ├── prediction.ts
│   │   └── vote.ts
│   ├── utils/                    # Pure utility functions
│   │   ├── formatDate.ts
│   │   ├── slugify.ts
│   │   └── fingerprint.ts
│   └── constants.ts              # App-wide constants
├── hooks/                        # Custom React hooks
│   ├── useTickerSubscription.ts
│   ├── useFilterState.ts
│   └── useLocalStorage.ts
├── types/                        # Shared TypeScript types (non-Zod)
│   └── index.ts
└── actions/                      # Next.js Server Actions
    ├── castVote.ts
    ├── exportProfiles.ts
    └── revalidateProfile.ts
```

**File Co-location Rules:**

| File Type | Location | Naming |
|---|---|---|
| Unit tests | Co-located with source | `TickerBlock.test.tsx` next to `TickerBlock.tsx` |
| E2E tests | `tests/e2e/` at project root | `homepage.spec.ts`, `journalist-workflow.spec.ts` |
| Storybook stories | Not used (no Storybook for MVP) | — |
| Component styles | Tailwind classes inline (no CSS modules) | — |
| Type definitions | `src/lib/supabase/types.ts` (generated) + `src/types/` (manual) | PascalCase.ts |

**Import Order Convention:**

```typescript
// 1. React/Next.js imports
import { Suspense } from 'react'
import Link from 'next/link'

// 2. Third-party libraries
import { useReactTable } from '@tanstack/react-table'

// 3. Internal: lib/utils
import { createServerClient } from '@/lib/supabase/server'
import { formatDepartureDate } from '@/lib/utils/formatDate'

// 4. Internal: components
import { TickerBlock } from '@/components/custom/TickerBlock'
import { Button } from '@/components/ui/button'

// 5. Internal: types
import type { Profile } from '@/lib/supabase/types'
```

### Format Patterns

**Server Action Response Format:**

All Server Actions return the same shape:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

Example:
```typescript
// Good
return { success: true, data: { voteCount: 48 } }
return { success: false, error: 'Vote already recorded for this prediction.' }

// Bad — never throw from Server Actions, never return raw data
throw new Error('Vote failed')
return { count: 48 }
```

**Date/Time Formats:**

| Context | Format | Example |
|---|---|---|
| Database storage | ISO 8601 (PostgreSQL TIMESTAMPTZ) | `2026-03-12T14:30:00Z` |
| JSON exchange | ISO 8601 string | `"2026-03-12T14:30:00Z"` |
| Display (dates) | `Month YYYY` or `Month DD, YYYY` | "March 2026" or "March 12, 2026" |
| Display (relative) | Relative for <30 days, absolute otherwise | "3 days ago" or "March 2026" |
| URL parameters | `YYYY` for year filter | `?year=2025` |

**JSON Field Naming in API/Database:**

| Layer | Convention | Example |
|---|---|---|
| Database | snake_case | `departure_date`, `profile_id` |
| Supabase client response | snake_case (matches DB) | `profile.departure_date` |
| TypeScript types | camelCase (transformed) | `profile.departureDate` |
| URL parameters | snake_case (matches DB for simplicity) | `?concern=safety-deprioritization` |

**Transform rule:** Supabase returns snake_case. Define TypeScript types with camelCase. Transform at the Supabase client boundary using a utility. Components always use camelCase.

**Null Handling:**
- Database: Use NULL for optional fields. Never use empty string as substitute for NULL.
- TypeScript: Use `null` (not `undefined`) for database-sourced optional fields.
- Display: Omit the element entirely for null fields. Never show "N/A" or "Unknown."

### Communication Patterns

**Supabase Real-time Event Handling:**

```typescript
// Channel naming: {table}:{filter}
const channel = supabase
  .channel('ticker-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'ticker_stats',
  }, handleTickerUpdate)
  .subscribe()

// Always clean up subscriptions
useEffect(() => {
  const channel = subscribeToTicker()
  return () => { supabase.removeChannel(channel) }
}, [])
```

**localStorage Key Naming:**

| Key | Type | Purpose |
|---|---|---|
| `wc:lastCount` | number | Last seen ticker count for delta badge |
| `wc:lastVisit` | ISO string | Date of last visit |
| `wc:hasVisited` | boolean | First-visit detection |
| `wc:insiderVerified` | boolean | Insider self-identification status |
| `wc:votes` | `Record<string, 'agree' \| 'disagree'>` | Prediction vote state by prediction ID |

**Prefix rule:** All localStorage keys prefixed with `wc:` (Warning Collective) to avoid collisions.

**Logging Standards:**

| Level | When to use | Example |
|---|---|---|
| `error` | Unexpected failures, broken invariants | DB connection failed, Supabase query error |
| `warn` | Recoverable issues, degraded behavior | Real-time subscription reconnecting, OG metadata fetch failed |
| `info` | Significant events | Profile published, prediction resolved, export generated |
| `debug` | Development-only details | Query params, filter state, subscription lifecycle |

Server-side only. Never `console.log` in production client code. Use Vercel's built-in function logging.

### Process Patterns

**Error Handling:**

| Layer | Pattern |
|---|---|
| Server Components | `try/catch` wrapping Supabase queries. Error → `error.tsx` boundary with generic message. Log details server-side. |
| Server Actions | Zod `safeParse()` first. If invalid: return `{ success: false, fieldErrors }`. If unexpected error: log, return `{ success: false, error: 'Something went wrong.' }`. Never expose internal errors. |
| Client Components | Real-time subscription errors: silent retry. localStorage failures: degrade gracefully (no delta badge, no vote persistence). |
| API Routes | Validate inputs, return appropriate HTTP status codes. 400 for validation, 401 for unauthorized editorial access, 500 for unexpected errors. |

**Loading States:**

| Scenario | Pattern |
|---|---|
| Initial page load | SSR — no loading state. Content visible on first paint. |
| Client-side filtering | Instant (TanStack Table, no loading indicator). |
| Page navigation | Next.js link prefetching. No spinner. Skeleton for <100ms gap only. |
| Real-time updates | No loading state. New data merges silently with current view. |
| Export | Button shows "Exporting..." text swap during generation (client-side, <500ms). |
| OG image | Generated at publish time, not on request. |

**No loading spinners anywhere in the MVP.** The architecture (SSR + client-side filtering + cached data) eliminates the need. If a loading state is needed, it's a skeleton matching the content shape, visible for <500ms.

**Validation Pattern:**

```typescript
// 1. Define schema once in src/lib/schemas/
export const predictionVoteSchema = z.object({
  predictionId: z.string().uuid(),
  vote: z.enum(['agree', 'disagree']),
  isInsider: z.boolean(),
  fingerprintHash: z.string().min(16),
})

// 2. Use in Server Action
export async function castVote(formData: FormData) {
  'use server'
  const parsed = predictionVoteSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: 'Invalid vote data.', fieldErrors: parsed.error.flatten().fieldErrors }
  }
  // ... proceed with validated data
}
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. Follow the naming conventions in this document exactly — no "creative" alternatives
2. Place files in the specified directories — do not create new top-level directories without architectural review
3. Use the Server Action response format (`{ success, data/error }`) for all mutations
4. Validate all inputs with Zod schemas from `src/lib/schemas/` — never inline validation
5. Transform Supabase snake_case to TypeScript camelCase at the client boundary — never use snake_case in component props
6. Prefix all localStorage keys with `wc:`
7. Never add loading spinners — use SSR and skeletons only
8. Never expose internal error details to the client
9. Co-locate unit tests with source files — E2E tests go in `tests/e2e/`
10. Use `@/` import alias — never relative imports beyond `./` (same directory)

**Anti-Patterns:**

```typescript
// BAD: Direct Supabase snake_case in components
<p>{profile.departure_date}</p>

// GOOD: Transform to camelCase at boundary
<p>{profile.departureDate}</p>

// BAD: Inline validation in Server Action
if (!data.predictionId || typeof data.predictionId !== 'string') { ... }

// GOOD: Zod schema
const parsed = predictionVoteSchema.safeParse(data)

// BAD: Throwing from Server Actions
throw new Error('Vote failed')

// GOOD: Return structured error
return { success: false, error: 'Vote could not be recorded.' }

// BAD: Custom localStorage key
localStorage.setItem('insiderStatus', 'true')

// GOOD: Prefixed key
localStorage.setItem('wc:insiderVerified', 'true')

// BAD: Adding a loading spinner
{isLoading && <Spinner />}

// GOOD: Skeleton while SSR hydrates (rare, <500ms)
<Suspense fallback={<ProfileCardSkeleton />}>
  <ProfileCard profile={profile} />
</Suspense>
```

## Project Structure & Boundaries

### Complete Project Directory Structure

**Frontend Application (Next.js — deployed to Vercel):**

```
warning-collective/
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Lint, type check, Vitest, Playwright, axe-core
│       └── deploy-agents.yml             # Agent backend deployment pipeline
├── .env.example                          # Template with all env vars documented
├── .env.local                            # Local dev (git-ignored)
├── .gitignore
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── components.json                       # shadcn/ui configuration
│
├── public/
│   ├── fonts/
│   │   ├── SourceSerif4-Bold.woff2
│   │   ├── SourceSerif4-SemiBold.woff2
│   │   └── SourceSerif4-Regular.woff2
│   ├── images/
│   │   └── logo.svg
│   ├── robots.txt
│   └── sitemap.xml                       # Generated at build time
│
├── supabase/
│   ├── config.toml                       # Supabase project config
│   ├── seed.sql                          # Initial seed data for development
│   └── migrations/
│       ├── 001_create_profiles.sql
│       ├── 002_create_predictions.sql
│       ├── 003_create_taxonomy.sql
│       ├── 004_create_editorial.sql
│       ├── 005_create_ticker_stats.sql
│       ├── 006_create_companies.sql
│       └── 007_create_rls_policies.sql
│
├── src/
│   ├── app/
│   │   ├── globals.css                   # Design tokens (Slate & Ink), font-face declarations
│   │   ├── layout.tsx                    # Root layout: nav, fonts, Plausible, JSON-LD (WebSite)
│   │   ├── page.tsx                      # Homepage: ticker, stats bridge, latest activity, profile preview
│   │   ├── error.tsx                     # Global error boundary
│   │   ├── not-found.tsx                 # 404 page
│   │   │
│   │   ├── profiles/
│   │   │   ├── page.tsx                  # Profile browse: TanStack Table, filter panel, card/table toggle
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Individual profile page
│   │   │
│   │   ├── predictions/
│   │   │   └── page.tsx                  # Predictions tracker: list, vote bars, resolution status
│   │   │
│   │   ├── calls-for-change/
│   │   │   └── page.tsx                  # Aggregated calls for change with cross-links
│   │   │
│   │   ├── companies/
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Company aggregate: timeline, concern breakdown, profiles
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx                  # About: mission, team, advisory board
│   │   │
│   │   ├── editorial-standards/
│   │   │   └── page.tsx                  # Methodology, verification process, corrections policy
│   │   │
│   │   ├── press/
│   │   │   └── page.tsx                  # Media kit, stats, citation format, press contact
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                # Editorial auth gate (Supabase Auth check)
│   │   │   ├── page.tsx                  # Dashboard home: review queue summary
│   │   │   ├── queue/
│   │   │   │   └── page.tsx              # Editorial review queue
│   │   │   ├── profiles/
│   │   │   │   ├── page.tsx              # Profile management list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Profile editor
│   │   │   ├── predictions/
│   │   │   │   └── page.tsx              # Prediction management + resolution workflow
│   │   │   └── login/
│   │   │       └── page.tsx              # Editor login (Supabase Auth)
│   │   │
│   │   └── api/
│   │       ├── og/
│   │       │   └── route.tsx             # Dynamic OG image generation (Edge Runtime)
│   │       ├── export/
│   │       │   └── route.ts              # CSV/JSON export endpoint
│   │       ├── revalidate/
│   │       │   └── route.ts              # On-demand ISR revalidation webhook
│   │       └── sitemap/
│   │           └── route.ts              # Dynamic sitemap generation
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui installed components
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── navigation-menu.tsx
│   │   │
│   │   ├── custom/                       # 8 custom components (UX spec)
│   │   │   ├── TickerBlock.tsx
│   │   │   ├── TickerBlock.test.tsx
│   │   │   ├── StatsBridge.tsx
│   │   │   ├── StatsBridge.test.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   ├── ProfileCard.test.tsx
│   │   │   ├── ProfilePageLayout.tsx
│   │   │   ├── ProfilePageLayout.test.tsx
│   │   │   ├── InsiderVoteBar.tsx
│   │   │   ├── InsiderVoteBar.test.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── FilterPanel.test.tsx
│   │   │   ├── SourcePreviewTooltip.tsx
│   │   │   ├── SourcePreviewTooltip.test.tsx
│   │   │   ├── LatestActivitySlot.tsx
│   │   │   └── LatestActivitySlot.test.tsx
│   │   │
│   │   └── shared/                       # Composed shared components
│   │       ├── Navigation.tsx
│   │       ├── Navigation.test.tsx
│   │       ├── Footer.tsx
│   │       ├── ShareButton.tsx
│   │       ├── ConcernTag.tsx
│   │       ├── ChangeTag.tsx
│   │       ├── ExternalLink.tsx
│   │       ├── SkipLinks.tsx
│   │       └── PrintStylesheet.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts                 # createServerClient (SSR, Server Actions)
│   │   │   ├── browser.ts               # createBrowserClient (real-time subscriptions)
│   │   │   ├── middleware.ts             # Supabase auth middleware for editorial routes
│   │   │   └── types.ts                 # Generated database types (supabase gen types)
│   │   │
│   │   ├── schemas/                      # Zod validation schemas
│   │   │   ├── profile.ts
│   │   │   ├── prediction.ts
│   │   │   ├── vote.ts
│   │   │   └── export.ts
│   │   │
│   │   ├── queries/                      # Supabase query functions (reusable)
│   │   │   ├── profiles.ts              # getProfiles, getProfileBySlug, getProfilesByCompany
│   │   │   ├── predictions.ts           # getPredictions, getPredictionVotes
│   │   │   ├── ticker.ts               # getTickerStats
│   │   │   ├── companies.ts            # getCompany, getCompanyProfiles
│   │   │   ├── taxonomy.ts             # getConcerns, getCallsForChange
│   │   │   └── latestActivity.ts       # getLatestActivity (priority queue)
│   │   │
│   │   ├── transforms/                   # snake_case → camelCase transforms
│   │   │   ├── profile.ts
│   │   │   ├── prediction.ts
│   │   │   └── company.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDate.ts
│   │   │   ├── slugify.ts
│   │   │   ├── fingerprint.ts           # Client fingerprint generation (no PII)
│   │   │   ├── cn.ts                    # Tailwind class merge utility (shadcn)
│   │   │   └── exportData.ts            # CSV/JSON generation logic
│   │   │
│   │   └── constants.ts                  # TICKER_REVALIDATE_SECONDS, MAX_LATEST_ACTIVITY, etc.
│   │
│   ├── hooks/
│   │   ├── useTickerSubscription.ts      # Supabase real-time for ticker updates
│   │   ├── useFilterState.ts            # URL-as-state for TanStack Table filters
│   │   ├── useLocalStorage.ts           # Type-safe localStorage with wc: prefix
│   │   ├── useInsiderGate.ts            # Insider verification state management
│   │   └── useVoteState.ts             # Prediction vote state (localStorage)
│   │
│   ├── types/
│   │   └── index.ts                      # Shared TypeScript types (camelCase versions)
│   │
│   ├── actions/
│   │   ├── castVote.ts                   # Server Action: record prediction vote
│   │   ├── exportProfiles.ts            # Server Action: generate export file
│   │   └── revalidateProfile.ts         # Server Action: trigger ISR revalidation
│   │
│   └── middleware.ts                     # Next.js middleware: editorial auth, CSP headers
│
└── tests/
    ├── e2e/
    │   ├── homepage.spec.ts              # Ticker, stats bridge, latest activity
    │   ├── profile-browse.spec.ts        # Filtering, card/table toggle, URL state
    │   ├── profile-detail.spec.ts        # Profile page, source links, share
    │   ├── journalist-workflow.spec.ts   # Filter → export → permalink (60-second test)
    │   ├── insider-vote.spec.ts          # Insider gate, vote, persistence
    │   ├── accessibility.spec.ts         # axe-core AA validation across all pages
    │   └── seo.spec.ts                  # JSON-LD, canonical URLs, meta tags
    ├── fixtures/
    │   ├── profiles.ts                   # Mock profile data
    │   ├── predictions.ts                # Mock prediction data
    │   └── taxonomy.ts                   # Mock taxonomy data
    └── utils/
        └── setup.ts                      # Playwright + axe-core config
```

**Agent Backend (Python — deployed to Railway/Fly.io):**

```
agents/
├── README.md
├── pyproject.toml                        # Python project config (dependencies)
├── Dockerfile
├── .env.example
│
├── src/
│   ├── orchestrator/
│   │   ├── __init__.py
│   │   └── main.py                       # Master scheduling and dispatch
│   │
│   ├── agents/
│   │   ├── scout/
│   │   │   ├── __init__.py
│   │   │   ├── agent.py                  # CrewAI Scout Agent definition
│   │   │   └── tools.py                 # Firecrawl tools, source extractors
│   │   │
│   │   ├── verification/
│   │   │   ├── __init__.py
│   │   │   ├── agent.py                  # CrewAI Verification Agent definition
│   │   │   └── tools.py                 # Multi-source verification tools
│   │   │
│   │   ├── synthesis/
│   │   │   ├── __init__.py
│   │   │   ├── agent.py                  # CrewAI Synthesis Agent definition
│   │   │   └── tools.py                 # Taxonomy tagging, theme extraction
│   │   │
│   │   └── predictions/
│   │       ├── __init__.py
│   │       ├── agent.py                  # CrewAI Predictions Tracker Agent
│   │       └── tools.py                 # Resolution evidence search
│   │
│   ├── shared/
│   │   ├── supabase_client.py            # Supabase service role client
│   │   ├── models.py                     # Pydantic models matching DB schema
│   │   └── logging.py                   # Structured logging to agent_logs table
│   │
│   └── config/
│       └── settings.py                   # Environment config, API keys
│
└── tests/
    ├── test_scout.py
    ├── test_verification.py
    ├── test_synthesis.py
    └── test_predictions.py
```

### Architectural Boundaries

**Boundary 1: Frontend ↔ Database (Supabase)**

```
┌──────────────────────────────────────────┐
│            Next.js Application           │
│                                          │
│  Server Components ──► server.ts ──► Supabase (read)
│  Server Actions    ──► server.ts ──► Supabase (read/write)
│  Client Components ──► browser.ts ──► Supabase Realtime (subscribe)
│                                          │
│  RULE: No direct Supabase imports in     │
│  components. Always go through lib/      │
│  supabase/ clients and lib/queries/.     │
└──────────────────────────────────────────┘
```

**Boundary 2: Agent Backend ↔ Database (Supabase)**

```
┌──────────────────────────────────────────┐
│          Agent Backend (Python)           │
│                                          │
│  Agents ──► supabase_client.py ──► Supabase (service role)
│                                          │
│  RULE: Agents write ONLY to              │
│  editorial_queue table. Never directly   │
│  to profiles or predictions.             │
│  Editorial dashboard approves → moves    │
│  to public tables.                       │
└──────────────────────────────────────────┘
```

**Boundary 3: Editorial Dashboard ↔ Public Site**

```
┌────────────────────┐    ┌────────────────────┐
│  Editorial Dashboard│    │    Public Site      │
│  /dashboard/*       │    │    /* (everything   │
│                     │    │     else)           │
│  Requires Supabase  │    │  No auth required   │
│  Auth (editor role) │    │  localStorage only  │
│                     │    │                     │
│  Writes to:         │    │  Reads from:        │
│  - profiles         │    │  - profiles (pub)   │
│  - predictions      │    │  - predictions (pub)│
│  - editorial_queue  │    │  - ticker_stats     │
│  - corrections      │    │  - taxonomy         │
└────────────────────┘    └────────────────────┘
```

**Boundary 4: n8n ↔ Agent Backend**

```
┌──────────────────┐    HTTP trigger    ┌──────────────────┐
│  n8n (scheduler)  │ ─────────────────► │  Agent Backend   │
│                   │                    │                   │
│  Cron: every 4h   │    Status check   │  CrewAI Agents   │
│  Event triggers   │ ◄───────────────── │  run and return  │
│                   │                    │  results to DB   │
└──────────────────┘                    └──────────────────┘
```

### Requirements to Structure Mapping

**PRD Feature → Directory Mapping:**

| PRD Feature | Primary Location | Supporting Files |
|---|---|---|
| 8.1 Momentum Ticker | `src/components/custom/TickerBlock.tsx`, `src/app/page.tsx` | `src/lib/queries/ticker.ts`, `src/hooks/useTickerSubscription.ts` |
| 8.2 Profiles (content) | `src/app/profiles/`, `src/components/custom/ProfileCard.tsx`, `ProfilePageLayout.tsx` | `src/lib/queries/profiles.ts`, `src/lib/schemas/profile.ts` |
| 8.2 Filtering | `src/components/custom/FilterPanel.tsx`, `src/app/profiles/page.tsx` | `src/hooks/useFilterState.ts`, TanStack Table config |
| 8.3 Predictions | `src/app/predictions/page.tsx`, `src/components/custom/InsiderVoteBar.tsx` | `src/lib/queries/predictions.ts`, `src/hooks/useInsiderGate.ts`, `src/actions/castVote.ts` |
| 8.4 Theme Synthesis | `src/app/calls-for-change/page.tsx` | `src/lib/queries/taxonomy.ts`, `agents/src/agents/synthesis/` |
| 8.7 Editorial Transparency | `src/app/about/`, `src/app/editorial-standards/` | Static MDX or page.tsx content |
| 8.8 Journalist Tooling | `src/app/api/export/`, `src/app/press/` | `src/lib/utils/exportData.ts`, `src/actions/exportProfiles.ts` |
| 9.1–9.5 Agent Pipeline | `agents/src/` | `agents/src/orchestrator/`, `agents/src/agents/` |
| 9.7 Editorial Dashboard | `src/app/dashboard/` | `src/lib/supabase/middleware.ts` |
| SEO (from UX) | `src/app/api/og/`, `src/app/api/sitemap/` | `src/app/layout.tsx` (JSON-LD), `next.config.ts` |
| Company Aggregates (from UX) | `src/app/companies/[slug]/` | `src/lib/queries/companies.ts` |

**Cross-Cutting Concerns → Location:**

| Concern | Files |
|---|---|
| Design tokens | `src/app/globals.css` |
| Supabase clients | `src/lib/supabase/server.ts`, `browser.ts`, `middleware.ts` |
| Validation | `src/lib/schemas/*.ts` |
| Data transforms | `src/lib/transforms/*.ts` |
| Error handling | `src/app/error.tsx`, Server Action return format |
| Accessibility | Radix primitives (in shadcn), `src/components/shared/SkipLinks.tsx`, `tests/e2e/accessibility.spec.ts` |
| Rate limiting | `src/lib/utils/fingerprint.ts`, Supabase RLS + edge function |
| Print stylesheet | `src/components/shared/PrintStylesheet.tsx` (CSS media query) |

### Data Flow

**Read Path (public visitor):**

```
Browser → Vercel Edge → Next.js SSR → Supabase (read) → HTML response
                                    ↓
                              ISR cache hit? → Serve cached page
```

**Write Path (insider vote):**

```
Browser → InsiderVoteBar (client) → castVote Server Action
       → Zod validation → fingerprint check → Supabase insert
       → Return updated vote count → Client re-renders vote bar
       → Supabase Realtime → Other connected clients update
```

**Agent Pipeline Path:**

```
n8n cron → HTTP trigger → Orchestrator → Scout Agent (Firecrawl)
         → Verification Agent (Claude) → Supabase editorial_queue INSERT
         → Editorial dashboard shows pending items
         → Editor approves → Supabase profiles INSERT + ticker_stats UPDATE
         → ISR revalidation webhook → Homepage refreshes
         → Supabase Realtime → Connected browsers update ticker
```

**Export Path (journalist):**

```
Browser → Filter profiles (TanStack Table, client-side)
       → Click "Export CSV" → exportProfiles Server Action
       → Query Supabase with filter params → Generate CSV/JSON
       → Return file → Browser downloads
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are verified compatible:
- Next.js 16 + Tailwind CSS 4 + shadcn/ui: Native integration, shadcn CLI generates Tailwind-configured components
- Supabase + @supabase/ssr: Official SSR package designed for Next.js App Router
- TanStack Table + shadcn Table: TanStack provides logic, shadcn provides styled wrapper
- Vitest + Playwright: Independent test runners, no conflicts. Vitest for unit, Playwright for E2E
- Zod + Server Actions: First-class pattern documented by Next.js team
- Supabase Realtime + ISR: Complementary — ISR serves initial load, Realtime pushes updates after hydration
- No contradictory decisions identified

**Pattern Consistency:**
- Database naming (snake_case) matches Supabase conventions and PostgreSQL best practices
- TypeScript naming (camelCase) follows React/Next.js ecosystem conventions
- Transform boundary (snake_case → camelCase at Supabase client layer) is clean and documented
- All localStorage keys use consistent `wc:` prefix
- Server Action response format is uniform: `{ success, data/error }`
- Import ordering convention is explicit and enforceable

**Structure Alignment:**
- App Router structure maps cleanly to URL patterns defined in UX spec SEO architecture
- Component boundaries (ui/ custom/ shared/) match the UX spec's component strategy
- `lib/queries/` centralizes all database access, preventing direct Supabase imports in components
- Agent backend is fully isolated in its own directory with independent deployment

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| PRD Feature | Arch Coverage | Notes |
|---|---|---|
| 8.1 Momentum Ticker | ✅ Full | SSR, ISR 60s, Realtime subscription, OG generation, embed (Phase 4) |
| 8.2 Profiles (content) | ✅ Full | Data model, slug routing, source_url NOT NULL, timeline, taxonomy |
| 8.2 Filtering & Discovery | ✅ Full | TanStack Table, FilterPanel, URL-as-state, 5 facets |
| 8.2 Community Layer | ✅ Schema reserved | fan_letters, kudos, discussions tables defined for Phase 4 |
| 8.3 Predictions Tracker | ✅ Full | Voting model, fingerprint dedup, anomaly detection, resolution workflow |
| 8.4 Theme Synthesis | ✅ Full | pgvector, Synthesis Agent, concern_taxonomy table, calls_for_change |
| 8.5 Regulatory Ideas | ✅ Full | calls_for_change table with proposal_type, legislation_flag |
| 8.6 Anonymous Signal | ✅ Schema reserved | Deferred to Phase 4, zero-PII design constraint documented |
| 8.7 Editorial Transparency | ✅ Full | Static pages, corrections table, advisory board on about page |
| 8.8 Journalist Tooling | ✅ Full | Export endpoint, URL-as-state permalinks, press page, sitemap |
| 9.1 Orchestrator | ✅ Full | `agents/src/orchestrator/`, n8n scheduling |
| 9.2 Scout Agent | ✅ Full | `agents/src/agents/scout/`, Firecrawl tools |
| 9.3 Verification Agent | ✅ Full | `agents/src/agents/verification/`, confidence levels |
| 9.4 Synthesis Agent | ✅ Full | `agents/src/agents/synthesis/`, taxonomy tagging |
| 9.5 Predictions Tracker Agent | ✅ Full | `agents/src/agents/predictions/`, resolution search |
| 9.7 Human-in-the-Loop | ✅ Full | Editorial dashboard, review queue, Supabase Auth |
| Company aggregates (UX) | ✅ Full | `/companies/[slug]` route, companies table, ISR |
| SEO architecture (UX) | ✅ Full | JSON-LD, canonical URLs, sitemap, meta descriptions, OG images |

**Non-Functional Requirements Coverage:**

| NFR | Arch Decision | Status |
|---|---|---|
| Homepage <2s load | SSR + ISR + edge caching + performance budget (LCP <2.0s) | ✅ |
| Ticker <60s update | ISR 60s revalidation + Supabase Realtime subscription | ✅ |
| Search <500ms | TanStack Table client-side filtering (40-60 profiles in memory) | ✅ |
| 99.5% uptime | Vercel hosting + decoupled agent backend | ✅ |
| Agent failures ≠ frontend outage | Fully decoupled architecture, separate deployments | ✅ |
| Zero PII for anonymous signal | Privacy-by-design data model, no user accounts | ✅ |
| GDPR/CCPA compliance | No PII stored, Plausible analytics, data subject rights workflow | ✅ |
| WCAG 2.1 AA | Radix primitives, axe-core + Lighthouse CI merge gates | ✅ |
| Every claim sourced | `source_url NOT NULL` constraint, corrections table | ✅ |
| All agent activity logged | agent_logs table, 12-month retention, dashboard access | ✅ |
| No AI content without human review | editorial_queue → editor approval → publish pipeline | ✅ |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical decisions documented with technology versions
- Technology stack fully specified (no "to be decided" items blocking MVP)
- Deferred decisions explicitly listed with rationale

**Structure Completeness:**
- Complete directory tree for both frontend and agent backend
- Every file and directory has a purpose annotation
- Integration points mapped with data flow diagrams

**Pattern Completeness:**
- Naming conventions cover database, URL, TypeScript code, and localStorage
- Import ordering convention specified
- Server Action response format standardized
- Error handling patterns defined per layer
- Anti-patterns documented with correct alternatives

### Gap Analysis Results

**No Critical Gaps.** All MVP features are architecturally supported.

**Important Gaps (address in Phase 2-3):**

| Gap | Impact | Resolution |
|---|---|---|
| Email notification service not specified | Journalist notification signup (8.8) needs an email provider | Select during Phase 2: Resend or Postmark. Add `RESEND_API_KEY` env var. Simple — send on profile publish event. |
| Embeddable ticker widget approach undefined | Phase 4 feature, not MVP | Define in Phase 4 story: likely `<iframe>` or web component with `postMessage` communication. |
| Content seeding editorial workflow | Manual entry of 20-30 profiles in Phase 2 | Covered by editorial dashboard. No additional architecture needed — dashboard is the tool. |
| Agent cost monitoring not detailed | PRD requires cost modeling in Phase 1 | Track via Anthropic API usage dashboard + n8n run logs. Add cost tracking to agent_logs table in Phase 3. |

**Nice-to-Have Gaps (Phase 5+):**
- Public API specification (OpenAPI/Swagger) — deferred to Phase 5
- CDN strategy for OG images — Vercel handles this automatically
- Database read replicas — not needed at MVP scale (40-60 profiles)
- Agent auto-scaling — single instance sufficient for 4-hour cycle

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (8 FR areas, 7 agent systems)
- [x] Scale and complexity assessed (Medium — editorial platform with AI pipeline)
- [x] Technical constraints identified (no user accounts, PRD-specified stack, privacy-first)
- [x] Cross-cutting concerns mapped (7 concerns: editorial pipeline, source chain, rate limiting, real-time, SEO, privacy, phased rollout)

**✅ Technology Stack**
- [x] Starter template evaluated and selected (create-next-app + shadcn init)
- [x] All framework versions verified via web search (Next.js 16, Supabase, TanStack Table)
- [x] External service dependencies mapped with failure impact analysis
- [x] Initialization sequence documented with exact commands

**✅ Architectural Decisions**
- [x] Data architecture: schema, validation (Zod), migrations, caching, real-time
- [x] Authentication: no public auth, Supabase Auth for editors, service role for agents
- [x] API patterns: Server Components + Server Actions + Supabase client (no REST API layer)
- [x] Frontend architecture: state management, component architecture, data fetching, routing, SEO
- [x] Infrastructure: hosting topology, CI/CD, environments, monitoring

**✅ Implementation Patterns**
- [x] Naming conventions: database, URL, TypeScript, localStorage
- [x] Structure patterns: directory organization, file co-location, import ordering
- [x] Format patterns: Server Action responses, date/time, JSON fields, null handling
- [x] Communication patterns: real-time subscriptions, localStorage keys, logging
- [x] Process patterns: error handling, loading states, validation
- [x] Enforcement guidelines with anti-pattern examples

**✅ Project Structure**
- [x] Complete directory tree: frontend (Next.js) + agent backend (Python)
- [x] Architectural boundaries: 4 boundaries documented with diagrams
- [x] Requirements to structure mapping: every PRD feature → specific files
- [x] Data flow diagrams: read path, write path, agent pipeline, export path

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — all MVP features are architecturally specified, technology stack is proven and compatible, patterns prevent agent implementation conflicts.

**Key Strengths:**
1. **Clean separation of concerns** — frontend, editorial dashboard, and agent backend are independently deployable with well-defined integration points
2. **No auth complexity** — zero user accounts eliminates the most common source of architectural bugs
3. **Source verification at the data layer** — `source_url NOT NULL` ensures credibility is enforced architecturally, not just editorially
4. **Privacy by design** — no PII in the data model means GDPR/CCPA compliance is structural, not procedural
5. **Phased feature boundaries** — schema reserved for Phase 3-4 features, no breaking migrations needed

**Areas for Future Enhancement:**
1. Search infrastructure migration path (Supabase full-text → Algolia at 500+ profiles)
2. Agent cost monitoring and optimization
3. Public API design (Phase 5)
4. Dark mode visual polish (tokens ready, values TBD)
5. Embeddable widget specification (Phase 4)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented in this document
- Use implementation patterns consistently — naming, structure, format, process
- Respect project structure and boundaries — no new top-level directories without review
- Transform Supabase snake_case to TypeScript camelCase at the client boundary
- Every Server Action returns `{ success: true, data }` or `{ success: false, error }`
- Every source link has `source_url NOT NULL` in the database
- No loading spinners — SSR + ISR + client-side filtering eliminates the need
- Refer to this document for all architectural questions before making independent decisions

**First Implementation Priority:**
1. Run starter initialization sequence (create-next-app + shadcn init + dependencies)
2. Configure design tokens (Slate & Ink palette, Source Serif 4, spacing)
3. Create Supabase schema (migrations 001-007)
4. Set up Supabase client (server + browser per @supabase/ssr pattern)
5. Build Ticker Block component (the visual signature and first visible feature)
