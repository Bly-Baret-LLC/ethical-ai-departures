# Story 1.4: Stats Bridge Component

Status: done

## Story

As a visitor,
I want a stats bridge strip below the ticker showing 3 key metrics,
So that I get additional context at a glance.

## Acceptance Criteria

### AC1: Visual Rendering and Layout

**Given** the ticker block has rendered,
**When** I view the area immediately below it,
**Then** a mid-tone surface strip (`--surface-secondary` background) displays exactly 3 stat fragments (e.g., "4 companies represented", "Most common concern: Safety Deprioritization", "67% senior roles"),
**And** stats are separated by middot characters (`·`),
**And** the strip uses 14px Inter Medium (`text-sm font-medium`), centered text.

### AC2: Server-Side Rendering

**Given** the stats bridge is a Server Component,
**When** data is fetched from Supabase,
**Then** the stats render without any loading state (SSR),
**And** the data reflects the most recent ISR revalidation cycle (60s).

### AC3: Responsive Behavior

**Given** I view the page on a mobile device (viewport < 768px),
**When** the stats bridge renders,
**Then** the 3 stats stack vertically instead of displaying horizontally,
**And** each stat remains readable without horizontal scrolling.

### AC4: Error Handling

**Given** the data fetch fails,
**When** the stats bridge tries to render,
**Then** it returns null gracefully (same pattern as TickerBlock),
**And** the homepage still renders without the stats bridge.

### AC5: Unit Tests

**Given** the component is implemented,
**When** I run Vitest,
**Then** unit tests cover: 3-stat rendering, middot separators, responsive stacking, zero/empty data, error fallback,
**And** all tests pass.

## Tasks / Subtasks

- [x] Task 1: Create stats query function (AC: 2)
  - [x] 1.1 Create `src/lib/queries/stats.ts` with `getStatsBridgeData()` function
  - [x] 1.2 Query profiles table for distinct company count (published profiles only)
  - [x] 1.3 Compute senior role percentage from roles (keywords: "Lead", "Director", "Head", "Principal", "Senior")
  - [x] 1.4 Query concern_tags with profile_concern_tags join to find most common concern
  - [x] 1.5 Return typed object: `{ companyCount: number, topConcern: string | null, seniorPct: number }`
  - [x] 1.6 Write unit tests in `src/lib/queries/stats.test.ts` (6 tests)

- [x] Task 2: Create StatsBridge Server Component (AC: 1, 2, 4)
  - [x] 2.1 Create `src/components/custom/StatsBridge.tsx` as an async Server Component
  - [x] 2.2 Call `getStatsBridgeData()` for stats data
  - [x] 2.3 Render 3 stat fragments: "{N} companies", "Top concern: {concern}", "{N}% senior roles"
  - [x] 2.4 Separate stats with ` · ` middot characters on desktop (hidden on mobile via `hidden md:inline`)
  - [x] 2.5 Use `--surface-secondary` background, `text-sm font-medium`, centered
  - [x] 2.6 Apply `<p>` tag with `role="status"` for accessibility
  - [x] 2.7 Add try/catch with `return null` fallback on data fetch error

- [x] Task 3: Responsive styling (AC: 3)
  - [x] 3.1 Desktop/tablet: single horizontal line (`md:flex-row`), stats separated by middots
  - [x] 3.2 Mobile (<768px): stats stack vertically (`flex-col`), middots hidden
  - [x] 3.3 Strip height: 48px desktop (`md:h-12`), auto on mobile for stacking
  - [x] 3.4 Consistent padding and text sizing across breakpoints

- [x] Task 4: Update homepage layout (AC: 1)
  - [x] 4.1 Add `<StatsBridge />` to `src/app/page.tsx` immediately after `<TickerBlock />`
  - [x] 4.2 Ensure visual flow: dark ticker → mid-tone bridge → light body

- [x] Task 5: Write unit tests (AC: 5)
  - [x] 5.1 Create `src/components/custom/StatsBridge.test.tsx` (6 tests)
  - [x] 5.2 Test: renders 3 stat fragments with correct content
  - [x] 5.3 Test: stats separated by middot characters
  - [x] 5.4 Test: renders with zero companies / no concern / 0% senior
  - [x] 5.5 Test: returns null on data fetch error
  - [x] 5.6 Test: has `role="status"` for accessibility
  - [x] 5.7 Create `src/lib/queries/stats.test.ts` for query function (6 tests)

- [x] Task 6: Validation and verification (AC: 1, 2, 3, 4, 5)
  - [x] 6.1 Run all Vitest unit tests — 76/76 pass
  - [x] 6.2 Run lint — 0 errors
  - [x] 6.3 Run typecheck — clean
  - [x] 6.4 Run build — succeeds

## Dev Notes

### Component Architecture

The Stats Bridge is a **simple Server Component** — no client interactivity needed (no localStorage, no event handlers). This is simpler than the TickerBlock/TickerClient composition pattern.

```
StatsBridge (Server Component — fetches data, renders SSR HTML)
```

**Data source:** The stats bridge needs data NOT currently in `ticker_stats`:
- **Company count:** `SELECT COUNT(DISTINCT company) FROM profiles WHERE status = 'published'`
- **Top concern:** Join `profile_concern_tags` + `concern_tags` with published profiles, find most frequent
- **Senior role %:** Compute from `seniority_breakdown` JSONB in `ticker_stats`, or count profiles with senior-level roles

Create a new query function `getStatsBridgeData()` in `src/lib/queries/stats.ts` rather than expanding `getTickerStats()`. This keeps the queries focused and independently cacheable.

### Stat Fragment Computation

**Fragment 1: Company count**
```sql
SELECT COUNT(DISTINCT company) FROM profiles WHERE status = 'published'
```
With seed data: OpenAI(2), Google DeepMind(2), Anthropic(1), Meta FAIR(1) = **4 companies**

**Fragment 2: Most common concern**
```sql
SELECT ct.name, COUNT(*) as cnt
FROM profile_concern_tags pct
JOIN concern_tags ct ON ct.id = pct.concern_tag_id
JOIN profiles p ON p.id = pct.profile_id
WHERE p.status = 'published'
GROUP BY ct.name
ORDER BY cnt DESC
LIMIT 1
```
With seed data: "Safety Deprioritization" appears 3 times = **"Most common concern: Safety Deprioritization"**

**Fragment 3: Senior role percentage**
Approach: Count profiles with senior-level roles (containing "Lead", "Director", "Head", "Principal", "Senior") vs total published profiles.
With seed data: All 6 have senior roles = **100% senior roles**

### Visual Specification

**From UX Design Spec:**
- Mid-tone `--surface-secondary` bar (#f5f5f4)
- 48px height (desktop), auto height (mobile stacking)
- 3 stat fragments separated by middots: "4 companies · Most common concern: Safety Deprioritization · 100% senior roles"
- 14px Inter Medium (`text-sm font-medium`)
- Centered text
- Semantic: `<p>` with `role="status"`

**Responsive:**
- Desktop/tablet: single horizontal line with middot separators
- Mobile (<768px): stats stack vertically, each on its own line

### Supabase Query Pattern

Use the same `createClient()` from `@/lib/supabase/server` that TickerBlock uses. The query function should use Supabase's query builder for the company count and concern aggregation.

**Important:** Supabase JS client doesn't support raw SQL. For the company count and top concern, you'll need to:
1. Fetch published profiles and compute distinct companies client-side, OR
2. Use Supabase RPC (stored function), OR
3. Fetch the necessary data and compute in JS

**Recommended approach:** Fetch profiles (just `company` and `role` columns) and concern tag joins, then compute the 3 stats in JS. This avoids needing new database functions and keeps the logic testable.

```typescript
// Approach: Fetch minimal data, compute stats in JS
const { data: profiles } = await supabase
  .from("profiles")
  .select("company, role")
  .eq("status", "published")

const { data: concerns } = await supabase
  .from("profile_concern_tags")
  .select("concern_tag:concern_tags(name), profile:profiles!inner(status)")
  // Filter by published profiles via the join
```

### Error Handling Pattern

Follow the same try/catch pattern established in TickerBlock:

```typescript
export async function StatsBridge() {
  let stats
  try {
    stats = await getStatsBridgeData()
  } catch (error) {
    console.error("Failed to load stats bridge data:", error)
    return null
  }
  // ... render
}
```

### Project Structure Notes

Files to create:
```
src/lib/queries/stats.ts              # Stats bridge query function
src/lib/queries/stats.test.ts         # Query function tests
src/components/custom/StatsBridge.tsx  # Server Component
src/components/custom/StatsBridge.test.tsx  # Component tests
```

Files to modify:
- `src/app/page.tsx` — add `<StatsBridge />` after `<TickerBlock />`

### Existing Code to Reuse — DO NOT RECREATE

- `src/lib/supabase/server.ts` — Supabase server client (createClient)
- `src/lib/constants.ts` — TICKER_REVALIDATE_SECONDS (if needed for ISR)
- `src/app/globals.css` — `--surface-secondary` (#f5f5f4) design token already defined
- `src/lib/queries/ticker.ts` — Reference for Supabase query pattern
- `src/components/custom/TickerBlock.tsx` — Reference for Server Component + error handling pattern

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.4] — BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md — Component Structure] — `src/components/custom/StatsBridge.tsx`, co-located tests
- [Source: _bmad-output/planning-artifacts/architecture.md — Data Fetching Strategy] — ISR 60s revalidation for ticker stats
- [Source: _bmad-output/planning-artifacts/architecture.md — Primary API Pattern] — Server Components + Supabase client, no separate REST layer
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Stats Bridge Strip] — Mid-tone `--surface-secondary`, 48px height, 3 stat fragments, middots, 14px Inter Medium
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Responsive] — Single line desktop/tablet, may wrap 2 lines mobile
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Accessibility] — `<p>` with `role="status"`
- [Source: _bmad-output/implementation-artifacts/1-3-ticker-block-component.md] — Server Component pattern, error handling, testing approach

### Previous Story Intelligence (Story 1.3)

**Key Learnings from Story 1.3:**
- Server Components can be async and call `await` directly — no `@ts-expect-error` needed in React 19
- `getTickerStats()` established at `src/lib/queries/ticker.ts` — reuse the same Supabase client pattern
- React 19 lint rules (`react-hooks/set-state-in-effect`, `react-hooks/refs`) are strict — but StatsBridge has no client-side state, so this won't apply
- Next.js 16 requires statically analyzable segment config — `revalidate` must be inlined literals
- `vi.mock` factory hoisting: inline mock data in factory, don't reference external variables
- TickerBlock try/catch pattern works well — build succeeds even when Supabase cookies error occurs during static generation
- Vitest + jsdom: use `cleanup()` in `afterEach` to prevent DOM accumulation across tests
- Node 22+ has native `localStorage` — use `vi.stubGlobal` for manual mocking when needed

**Problems to Avoid:**
- Do NOT modify `src/lib/queries/ticker.ts` — create a separate query file for stats bridge
- Do NOT add schema/types unless the Supabase response shape is complex enough to warrant Zod parsing
- Do NOT use `useState` or `"use client"` — this is a pure Server Component, no interactivity
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
- Tests co-located: `StatsBridge.test.tsx` next to `StatsBridge.tsx`
- Query functions in `src/lib/queries/` (camelCase filenames)

### Latest Tech Information

| Technology | Version | Key Notes |
|---|---|---|
| Next.js | 16.1.6 | App Router, Server Components default, `export const revalidate` for ISR |
| React | 19.2.3 | Server Components, async components supported natively |
| Vitest | 4.1.0 | jsdom environment, `@testing-library/react` for component testing |
| @testing-library/react | 16.3.2 | `render()`, `screen`, `cleanup()` in afterEach |
| Tailwind CSS | 4.x | CSS variable tokens, responsive prefixes (`sm:`, `md:`, `lg:`) |
| Supabase JS | 2.99.1 | `.from().select().eq()` query builder, no raw SQL support |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Supabase JS client doesn't support raw SQL — used JS-side computation from fetched data instead
- `profile_concern_tags` join with `profiles!inner(status)` filters to published profiles at DB level
- StatsBridge is async Server Component (needs `await` for data fetch); story note suggested non-async but async is required

### Completion Notes List

- Created `getStatsBridgeData()` query with 3 computed stats from profiles + concern_tags tables
- StatsBridge renders 3 fragments with middot separators, responsive stacking on mobile
- Middots use `hidden md:inline` for clean mobile vertical layout
- Error fallback returns null (same pattern as TickerBlock)
- 12 new tests (6 query + 6 component), 76 total pass

### File List

**Created:**
- `src/lib/queries/stats.ts` — Stats bridge query function with `StatsBridgeData` interface
- `src/lib/queries/stats.test.ts` — 6 unit tests for query function
- `src/components/custom/StatsBridge.tsx` — Async Server Component
- `src/components/custom/StatsBridge.test.tsx` — 6 unit tests for component

**Modified:**
- `src/app/page.tsx` — Added `<StatsBridge />` after `<TickerBlock />`
