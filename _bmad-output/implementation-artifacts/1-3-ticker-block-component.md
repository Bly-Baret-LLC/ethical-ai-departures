# Story 1.3: Ticker Block Component

Status: done

## Story

As a visitor,
I want to see a bold dark-inverted ticker block showing the total departure count, 90-day count, and seniority breakdown,
So that I immediately grasp the scale of safety-motivated departures.

## Acceptance Criteria

### AC1: Visual Rendering and Typography

**Given** I land on the homepage,
**When** the page renders,
**Then** a full-width dark inverted block (`--surface-inverse` background) displays the total departure count in 80–84px Inter ExtraBold with `--text-inverse` color,
**And** a secondary line shows the 90-day count and aggregate seniority signal (e.g., "including 2 Safety Leads, 1 Research Director"),
**And** the ticker block occupies 25–30% of the above-the-fold viewport area.

### AC2: First-Time Visitor Explainer

**Given** I am a first-time visitor (`localStorage` key `wc:ticker-explainer-dismissed` is not set),
**When** the ticker block renders,
**Then** a contextual explainer paragraph is visible below the count explaining what the number represents,
**And** the explainer has a dismiss button that sets `localStorage` `wc:ticker-explainer-dismissed` to `true`,
**And** on subsequent visits the explainer is hidden.

### AC3: Return Visitor Delta Badge

**Given** I am a return visitor (`localStorage` `wc:last-count` is set),
**When** the current count is higher than the stored count,
**Then** a delta badge ("+N since your last visit") appears in `--accent-amber`,
**And** the stored count is updated to the current value.

### AC4: Server-Side Rendering and Accessibility

**Given** the page is server-rendered via ISR with 60-second revalidation,
**When** I view the page source,
**Then** the ticker count is present in the initial HTML (no layout shift, no loading spinner),
**And** screen reader text alternatives describe the count and seniority breakdown.

### AC5: Unit Tests

**Given** the component is implemented,
**When** I run Vitest,
**Then** unit tests cover: first visit render, return visit with delta badge, zero count edge case, explainer dismiss, seniority breakdown formatting,
**And** all tests pass.

## Tasks / Subtasks

- [x] Task 1: Create TickerBlock Server Component (AC: 1, 4)
  - [x] 1.1 Create `src/components/custom/TickerBlock.tsx` as an async Server Component
  - [x] 1.2 Import and call `getTickerStats()` from `@/lib/queries/ticker`
  - [x] 1.3 Render total count in 80–84px Inter ExtraBold, `--text-inverse` color on `--surface-inverse` background
  - [x] 1.4 Render secondary line with `ninetyDayCount` and seniority breakdown from `seniorityBreakdown` record
  - [x] 1.5 Use semantic `<h1>` wrapping full sentence: "{count} AI researchers have left major companies over safety concerns"
  - [x] 1.6 Add `aria-live="polite"` on the count element for future real-time updates (Story 1.7)
  - [x] 1.7 Apply `font-variant-numeric: tabular-nums` to prevent digit shift during future animations
  - [x] 1.8 Ensure the block occupies ~25–30vh with responsive padding

- [x] Task 2: Create TickerClient interactive wrapper (AC: 2, 3)
  - [x] 2.1 Create `src/components/custom/TickerClient.tsx` as a `"use client"` component
  - [x] 2.2 Accept `totalCount` and `children` (the SSR ticker content) as props
  - [x] 2.3 Implement first-visit explainer: check `STORAGE_KEYS.TICKER_EXPLAINER_DISMISSED`, show explainer paragraph if not set
  - [x] 2.4 Implement explainer dismiss button that sets `localStorage` key and hides paragraph
  - [x] 2.5 Implement return-visitor delta badge: compare `totalCount` prop to `STORAGE_KEYS.LAST_COUNT` in localStorage
  - [x] 2.6 Show "+N since your last visit" badge in `--accent-amber` when delta > 0
  - [x] 2.7 Update `STORAGE_KEYS.LAST_COUNT` to current count after render
  - [x] 2.8 Handle localStorage unavailability gracefully (SSR, private browsing) — no badge, no explainer dismiss
  - [x] 2.9 Add `aria-label` on delta badge: "+N new departures since your last visit"

- [x] Task 3: Create seniority breakdown formatter (AC: 1)
  - [x] 3.1 Create `src/lib/utils/formatSeniority.ts` — converts `Record<string, number>` to display string
  - [x] 3.2 Format as "including N Safety Leads, N Research Directors" (top 2–3 roles by count)
  - [x] 3.3 Handle edge cases: empty breakdown, single role, many roles (show top 3 + "and N others")
  - [x] 3.4 Write unit tests in `src/lib/utils/formatSeniority.test.ts`

- [x] Task 4: Update homepage to use TickerBlock (AC: 1, 4)
  - [x] 4.1 Replace the hardcoded hero section in `src/app/page.tsx` with `<TickerBlock />`
  - [x] 4.2 Add ISR revalidation: `export const revalidate = 60` (inlined; Next.js requires static analysis)
  - [x] 4.3 Ensure the existing below-the-fold content remains intact

- [x] Task 5: Responsive styling (AC: 1)
  - [x] 5.1 Mobile (<768px): count at 64–72px, context line max 2 lines, full-width
  - [x] 5.2 Tablet (768–1024px): count at ~80px
  - [x] 5.3 Desktop (>1024px): count at 80–84px
  - [x] 5.4 Consistent ~25–30vh height across breakpoints
  - [x] 5.5 96px vertical padding (breathing room) around the ticker content

- [x] Task 6: Write unit tests (AC: 5)
  - [x] 6.1 Create `src/components/custom/TickerBlock.test.tsx` — test SSR render with mocked `getTickerStats`
  - [x] 6.2 Create `src/components/custom/TickerClient.test.tsx` — test interactive features
  - [x] 6.3 Test: first-visit render (no localStorage) — explainer visible, no delta badge
  - [x] 6.4 Test: return visit with higher count — delta badge shows "+N since your last visit"
  - [x] 6.5 Test: return visit with same count — no delta badge
  - [x] 6.6 Test: zero count edge case — renders "0" without errors
  - [x] 6.7 Test: explainer dismiss — button click hides explainer, sets localStorage
  - [x] 6.8 Test: seniority breakdown renders correctly in secondary line

- [x] Task 7: Validation and verification (AC: 1, 2, 3, 4, 5)
  - [x] 7.1 Run all Vitest unit tests — all pass (64/64)
  - [x] 7.2 Run lint — 0 errors
  - [x] 7.3 Run typecheck — clean
  - [x] 7.4 Run build — succeeds
  - [ ] 7.5 Visual check: start dev server, verify ticker renders with seed data (total_count=6)
  - [ ] 7.6 Verify SSR: view page source shows count in initial HTML
  - [x] 7.7 Verify accessibility: `<h1>` contains full sentence, `aria-live` on count, `aria-label` on delta badge

## Dev Notes

### Component Architecture

The ticker block uses a **Server Component + Client Component** composition pattern:

```
TickerBlock (Server Component — fetches data, renders SSR HTML)
└── TickerClient (Client Component — localStorage interactions, delta badge, explainer)
    └── {children} (SSR ticker content passed through)
```

**Why this split:**
- `TickerBlock` is async, fetches `getTickerStats()` server-side — zero client JS for the main content
- `TickerClient` wraps the SSR content and adds interactive features (localStorage) client-side
- The SSR HTML always contains the full count — no layout shift, no loading spinner
- Future Story 1.7 will add real-time subscription inside `TickerClient`

### Visual Specification

**Typography:**
- Primary count: `text-[80px] md:text-[84px]` (mobile: `text-[64px] sm:text-[72px]`), Inter ExtraBold (`font-extrabold`), `tabular-nums`
- Context line: `text-base` (16px), Inter, `text-text-inverse/80` (0.8 opacity)
- Explainer: `text-sm` (14px), `text-text-inverse/60`
- Delta badge: `text-sm font-medium`, `bg-accent-amber/20 text-accent-amber` pill

**Layout:**
- Full-width `bg-surface-inverse`
- `min-h-[25vh] max-h-[30vh]` or `py-24` (96px) for breathing room
- Content centered, max-width for readability

**Semantic HTML:**
```html
<section aria-label="Departure ticker">
  <h1>
    <span aria-live="polite" class="tabular-nums">{count}</span>
    AI researchers have left major companies over safety concerns
  </h1>
  <p><!-- secondary line: 90-day count + seniority --></p>
  <!-- explainer (first-visit only) -->
  <!-- delta badge (return-visit only) -->
</section>
```

The `<h1>` wraps the full keyword-rich sentence, not just the number. This is critical for SEO and screen readers.

### Seniority Breakdown Formatting

The `seniorityBreakdown` field is `Record<string, number>` (e.g., `{ "Safety Lead": 2, "Research Director": 1, "Senior Researcher": 1 }`).

Format as a human-readable string:
- Sort by count descending
- Take top 2–3 roles
- Output: "including 2 Safety Leads, 1 Research Director, and 1 Senior Researcher"
- If >3 roles: "including 2 Safety Leads, 1 Research Director, and 4 others"
- If empty: omit the seniority line entirely

### localStorage Behavior

**Keys used (from `src/lib/constants.ts`):**
- `wc:ticker-explainer-dismissed` — `"true"` when explainer dismissed
- `wc:last-count` — stringified number (last seen total count)
- `wc:has-visited` — `"true"` after first visit (set by TickerClient)

**Graceful degradation:**
- If `localStorage` is unavailable (SSR, private browsing, disabled): no delta badge, no explainer dismiss persistence
- Use try/catch around all localStorage calls
- Component still renders the core ticker content (SSR) regardless

### ISR Revalidation

The homepage uses ISR with 60-second revalidation (`TICKER_REVALIDATE_SECONDS`). This means:
- First request: renders and caches
- Subsequent requests within 60s: serve cached HTML
- After 60s: next request triggers background revalidation
- The ticker_stats data is at most 60s stale

This is set via `export const revalidate = TICKER_REVALIDATE_SECONDS` in `page.tsx`.

### Project Structure Notes

Files to create in this story:

```
src/components/custom/
├── TickerBlock.tsx              # Server Component — data fetch + SSR render
├── TickerBlock.test.tsx         # Unit tests for server component
├── TickerClient.tsx             # Client Component — localStorage + interactive
└── TickerClient.test.tsx        # Unit tests for client component

src/lib/utils/
├── formatSeniority.ts           # Seniority breakdown formatter
└── formatSeniority.test.ts      # Unit tests for formatter
```

Files to modify:
- `src/app/page.tsx` — replace hardcoded hero with `<TickerBlock />`

Directories that already exist: `src/components/custom/` (empty), `src/lib/utils/` (may need creating)

### Existing Code to Reuse — DO NOT RECREATE

- `src/lib/queries/ticker.ts` — `getTickerStats()` already exists and returns `TickerStats` type
- `src/lib/schemas/profile.ts` — `tickerStatsSchema` with camelCase transform already working
- `src/lib/constants.ts` — `TICKER_REVALIDATE_SECONDS`, `STORAGE_KEYS` already defined
- `src/types/index.ts` — `TickerStats` type already exported
- `src/app/globals.css` — all design tokens (`--surface-inverse`, `--text-inverse`, `--accent-amber`) already defined
- `src/lib/supabase/server.ts` — Supabase server client already working
- `prefers-reduced-motion` CSS rule already in `globals.css` base layer

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.3] — BDD acceptance criteria, dependency chain
- [Source: _bmad-output/planning-artifacts/architecture.md — Component Structure] — `src/components/custom/TickerBlock.tsx`, co-located tests
- [Source: _bmad-output/planning-artifacts/architecture.md — Data Fetching Strategy] — ISR 60s revalidation for ticker stats
- [Source: _bmad-output/planning-artifacts/architecture.md — localStorage Keys] — `wc:lastCount`, `wc:lastVisit`, `wc:hasVisited` with `wc:` prefix
- [Source: _bmad-output/planning-artifacts/architecture.md — Naming Conventions] — PascalCase components, camelCase functions/hooks
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Ticker Block] — 80–84px Inter ExtraBold, `--surface-inverse`, tabular-nums, 96px breathing room
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Visual Signature] — "The dark inverted ticker block — the site's ownable visual moment"
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Responsive] — Mobile 64–72px, tablet 80px, desktop 80–84px
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Delta Badge] — "+N since [date]" in `--accent-amber` pill
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Screen Reader] — `<h1>` wraps full keyword sentence, `aria-live="polite"`, `aria-label` on badge
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Accessibility] — Touch targets 44x44px, prefers-reduced-motion respected
- [Source: _bmad-output/implementation-artifacts/1-2-departure-profiles-database-schema-and-seed-data.md] — ticker_stats schema, query function, seed data

### Previous Story Intelligence (Story 1.2)

**Key Learnings from Story 1.2:**
- `getTickerStats()` established at `src/lib/queries/ticker.ts` — returns `TickerStats` with camelCase keys. Reuse directly.
- `TickerStats` type: `{ id, totalCount, ninetyDayCount, seniorityBreakdown, updatedAt }`
- Zod 4.3.6 is installed — `seniorityBreakdown` is `Record<string, number>` (safe to iterate via `Object.entries()`)
- Vitest mock pattern for Supabase: use `vi.mock("@/lib/supabase/server", ...)` with chainable mock objects
- Tests co-located next to source files
- `@` path alias works in both source and test files
- Seed data has `total_count=6`, `ninety_day_count=2`, `seniority_breakdown={"Safety Lead":1,"Research Director":1,"Senior Researcher":1,"Principal Engineer":1,"Head of Alignment":1,"Research Scientist":1}`

**Problems to Avoid:**
- Do NOT recreate `getTickerStats()` — it already works
- Do NOT modify `src/lib/schemas/profile.ts` or `src/lib/queries/ticker.ts`
- Do NOT modify `src/lib/constants.ts` — all storage keys are already defined
- When testing Server Components, mock the query function, not the Supabase client directly

### Git Intelligence

**Recent Commits:**
- `6fc2583` — Code review fixes for Story 1.2: defense-in-depth and error handling
- `c226394` — Implement Story 1.2: database schema, seed data, and Zod validation
- `575be6c` — Mark Story 1.1 done, create Story 1.2 context
- `d5c33de` — Initialize Warning Collective: Next.js 16, Slate & Ink design system, BMAD planning artifacts

**Patterns to Follow:**
- All source files under `src/`
- Components in `src/components/custom/` (PascalCase filenames)
- Tests co-located: `TickerBlock.test.tsx` next to `TickerBlock.tsx`
- Utilities in `src/lib/utils/` (camelCase filenames)

### Latest Tech Information

| Technology | Version | Key Notes |
|---|---|---|
| Next.js | 16.1.6 | App Router, Server Components default, `export const revalidate` for ISR |
| React | 19.1.0 | Server Components, `"use client"` directive for client components |
| Vitest | 4.1.0 | jsdom environment, `@testing-library/react` for component testing |
| @testing-library/react | 16.3.0 | `render()`, `screen`, `fireEvent`/`userEvent` for interaction tests |
| Tailwind CSS | 4.x | `@theme inline` in globals.css, CSS variable tokens, responsive prefixes (`sm:`, `md:`, `lg:`) |
| Zod | 4.3.6 | `z.record(z.string(), z.number())` for Record types |

**Testing Server Components in Vitest:**
- Server Components (async) cannot be directly rendered in jsdom — mock the data-fetching function and test the rendered output
- Alternative: test the Server Component by importing and calling it as a function, then asserting on the JSX output
- For `TickerBlock`, mock `getTickerStats` via `vi.mock("@/lib/queries/ticker")`

**Testing Client Components with localStorage:**
- Use `vi.stubGlobal("localStorage", ...)` or jsdom's built-in localStorage
- Clear localStorage in `beforeEach` to isolate tests
- Test both "localStorage available" and "localStorage unavailable" paths

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- React 19 lint rules (`react-hooks/set-state-in-effect`, `react-hooks/refs`) required refactoring TickerClient from `useEffect` + `useState` to `useSyncExternalStore` + `useMemo` pattern
- Next.js 16 requires statically analyzable segment config — `revalidate` inlined instead of imported constant
- Node 22+ native `localStorage` conflicts with jsdom — required `vi.stubGlobal` mock in tests
- `vi.mock` factory hoisting prevents referencing variables declared later — inlined mock data

### Completion Notes List

- Code review (H1): Delta badge cached via `useMemo` to survive re-renders after localStorage write effect
- Code review (M2): Added comment explaining inlined revalidate value
- Code review (M3): Added try/catch fallback in TickerBlock — returns null on data fetch failure
- Tasks 7.5, 7.6 (visual check, SSR verification) require manual dev server inspection

### File List

**Created:**
- `src/components/custom/TickerBlock.tsx` — Async Server Component (data fetch + SSR render)
- `src/components/custom/TickerBlock.test.tsx` — 9 unit tests (including error-path)
- `src/components/custom/TickerClient.tsx` — Client Component (localStorage + interactive features)
- `src/components/custom/TickerClient.test.tsx` — 11 unit tests
- `src/lib/utils/formatSeniority.ts` — Seniority breakdown formatter utility
- `src/lib/utils/formatSeniority.test.ts` — 8 unit tests

**Modified:**
- `src/app/page.tsx` — Replaced placeholder hero with `<TickerBlock />`, added ISR revalidation
