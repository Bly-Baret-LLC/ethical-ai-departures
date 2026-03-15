# Story 1.5: Latest Activity Slot

Status: done

## Story

As a visitor,
I want to see a Latest Activity feed showing recent departures,
So that I know the site is actively maintained and up to date.

## Acceptance Criteria

### AC1: Desktop Activity Display

**Given** I visit the homepage on desktop as a return visitor,
**When** I scroll past the stats bridge,
**Then** 3 Latest Activity items are displayed showing recent departures,
**And** each item shows the person's name, role, company, and a human-readable timestamp,
**And** each item links to its detail page (slug-based URL).

### AC2: Mobile First-Visit Hiding

**Given** I visit on mobile for the first time (localStorage `wc:has-visited` is not set),
**When** the page renders,
**Then** the Latest Activity slot is hidden visually,
**And** the content remains in the DOM for SEO (detected client-side, no SEO impact),
**And** `wc:has-visited` is already set by TickerClient on mount.

### AC3: Responsive Item Counts

**Given** I am a return visitor,
**When** the page renders at different breakpoints,
**Then** desktop (>1024px) shows 3 items,
**And** tablet (768-1024px) shows 2 items,
**And** mobile (<768px) shows 1 item.

### AC4: Empty State

**Given** no published profiles exist in the database,
**When** the Latest Activity slot queries for content,
**Then** the component returns null gracefully (slot is hidden),
**And** the homepage still renders without the Latest Activity section.

### AC5: Unit Tests

**Given** the component is implemented,
**When** I run Vitest,
**Then** unit tests cover: activity item rendering, responsive item counts, first-visit hiding, empty data fallback, error fallback, link generation,
**And** all tests pass.

## Tasks / Subtasks

- [x] Task 1: Create latest activity query function (AC: 1, 4)
  - [x] 1.1 Create `src/lib/queries/latestActivity.ts` with `getLatestActivity()` function
  - [x] 1.2 Query `profiles` table for recent published profiles, ordered by `departure_date DESC`, limited to 3
  - [x] 1.3 Select: `slug, name, company, role, departure_date`
  - [x] 1.4 Return typed array: `ActivityItem[]`
  - [x] 1.5 Write unit tests in `src/lib/queries/latestActivity.test.ts`

- [x] Task 2: Create LatestActivitySlot Server Component (AC: 1, 4)
  - [x] 2.1 Create `src/components/custom/LatestActivitySlot.tsx` as an async Server Component
  - [x] 2.2 Call `getLatestActivity()` for data
  - [x] 2.3 Render `<section aria-label="Latest activity">` containing `<article>` elements
  - [x] 2.4 Each article: name (linked), role · company, human-readable date
  - [x] 2.5 Add try/catch with `return null` fallback on data fetch error
  - [x] 2.6 Return null if no items returned

- [x] Task 3: Create LatestActivityClient wrapper (AC: 2, 3)
  - [x] 3.1 Create `src/components/custom/LatestActivityClient.tsx` with `"use client"`
  - [x] 3.2 Use `useSyncExternalStore` to read `wc:has-visited` from localStorage
  - [x] 3.3 On mobile first-visit: hide section with CSS class (content stays in DOM for SEO)
  - [x] 3.4 Responsive item visibility via CSS: 1st item always, 2nd `md:block`, 3rd `lg:block`

- [x] Task 4: Human-readable timestamp utility (AC: 1)
  - [x] 4.1 Create `formatRelativeDate()` in `src/lib/utils/formatDate.ts`
  - [x] 4.2 Format: "2 days ago", "3 weeks ago", "Jan 15, 2026" (>30 days)
  - [x] 4.3 Unit tests for relative date formatting

- [x] Task 5: Update homepage layout (AC: 1)
  - [x] 5.1 Add `<LatestActivitySlot />` to `src/app/page.tsx` after `<StatsBridge />`

- [x] Task 6: Write component unit tests (AC: 5)
  - [x] 6.1 Create `src/components/custom/LatestActivitySlot.test.tsx`
  - [x] 6.2 Create `src/components/custom/LatestActivityClient.test.tsx`
  - [x] 6.3 Test: renders 3 activity items with correct content
  - [x] 6.4 Test: each item links to `/profiles/[slug]`
  - [x] 6.5 Test: returns null on empty data
  - [x] 6.6 Test: returns null on error
  - [x] 6.7 Test: first-visit mobile hiding behavior
  - [x] 6.8 Test: section has `aria-label="Latest activity"`

- [x] Task 7: Validation and verification (AC: 1, 2, 3, 4, 5)
  - [x] 7.1 Run all Vitest unit tests — 98/98 pass
  - [x] 7.2 Run lint — 0 errors
  - [x] 7.3 Run typecheck — clean
  - [x] 7.4 Run build — succeeds

## Dev Notes

### Component Architecture

The Latest Activity Slot uses the **Server/Client composition pattern** established by TickerBlock:

```
LatestActivitySlot (Server Component — fetches data, renders articles)
  └── LatestActivityClient ("use client" — handles first-visit hiding + responsive visibility)
```

**Why Server/Client split?**
- Data fetching must happen server-side (Supabase query via `createClient()`)
- First-visit mobile hiding requires client-side localStorage check
- Responsive item counts CAN be handled with CSS, but the section-level hiding on first-visit mobile needs JS

### Data Reality: Available Activity Types

**Currently available (Epic 1 schema):**
- New departures (profiles table with `departure_date`)

**NOT yet available (future epics):**
- Prediction resolutions (Epic 6)
- Vote threshold crossings (Epic 6)
- Editorial spotlights (Epic 5)

**Implementation approach:** Build for departures only. The `ActivityItem` type should be designed to accommodate future activity types, but the query only fetches profiles for now. When future epics add new activity types, the query function can be extended with `Promise.all` to merge and sort different sources.

### Activity Item Design

Each activity item renders as an `<article>` with:
- **Name** as a link to `/profiles/[slug]` (18px Source Serif 4 Semibold)
- **Role · Company** metadata line (14px Inter, `--text-secondary`)
- **Relative timestamp** (14px Inter, `--text-secondary`)

Example rendering:
```
Aisha Patel                    1 month ago
Head of Alignment · OpenAI
```

### Human-Readable Timestamps

Create a `formatRelativeDate(dateString: string)` utility:
- < 1 day: "Today"
- 1 day: "Yesterday"
- 2-6 days: "X days ago"
- 1-4 weeks: "X weeks ago"
- > 30 days: "Jan 15, 2026" (absolute format)

Use `Date` arithmetic — no external date library needed.

### Responsive Visibility Strategy

Use CSS classes for item count control (avoids re-rendering):

```tsx
{items.map((item, i) => (
  <article
    key={item.slug}
    className={cn(
      i === 0 && "block",           // Always visible
      i === 1 && "hidden md:block", // Tablet+
      i === 2 && "hidden lg:block", // Desktop only
    )}
  >
    {/* item content */}
  </article>
))}
```

### First-Visit Mobile Hiding

The LatestActivityClient wraps the section and handles visibility:

```tsx
"use client"
// Read wc:has-visited via useSyncExternalStore (same pattern as TickerClient)
// On SSR: assume visited (show content for SEO crawlers)
// On client (mobile, first visit): hide section visually
// Key: wc:has-visited is already SET by TickerClient's useEffect
```

**Critical:** The `HAS_VISITED` key is already written by TickerClient on mount. The LatestActivityClient only needs to READ it — never write.

### Visual Specification

**From UX Design Spec:**
- Section: `<section aria-label="Latest activity">`
- Each item: `<article>` element
- Background: `--surface-primary` (same as page)
- Container: `max-w-5xl mx-auto` (matches page width)
- Spacing: 64px section separation (editorial mode spacing)
- Item spacing: 16px between items
- Name: Source Serif 4 Semibold (`font-serif font-semibold`)
- Metadata: Inter, `--text-secondary` (`text-sm text-text-secondary`)

### Supabase Query Pattern

```typescript
const supabase = await createClient()
const { data, error } = await supabase
  .from("profiles")
  .select("slug, name, company, role, departure_date")
  .eq("status", "published")
  .order("departure_date", { ascending: false })
  .limit(3)
```

### Error Handling Pattern

Same try/catch pattern as TickerBlock and StatsBridge:

```typescript
export async function LatestActivitySlot() {
  let items
  try {
    items = await getLatestActivity()
  } catch (error) {
    console.error("Failed to load latest activity:", error)
    return null
  }
  if (items.length === 0) return null
  // ... render
}
```

### Project Structure Notes

Files to create:
```
src/lib/queries/latestActivity.ts              # Latest activity query function
src/lib/queries/latestActivity.test.ts         # Query function tests
src/lib/utils/formatDate.ts                    # Relative date formatting utility
src/lib/utils/formatDate.test.ts               # Date formatting tests
src/components/custom/LatestActivitySlot.tsx    # Server Component
src/components/custom/LatestActivitySlot.test.tsx  # Server Component tests
src/components/custom/LatestActivityClient.tsx  # Client Component wrapper
src/components/custom/LatestActivityClient.test.tsx  # Client Component tests
```

Files to modify:
- `src/app/page.tsx` — add `<LatestActivitySlot />` after `<StatsBridge />`

### Existing Code to Reuse — DO NOT RECREATE

- `src/lib/supabase/server.ts` — Supabase server client (createClient)
- `src/lib/constants.ts` — `STORAGE_KEYS.HAS_VISITED` for localStorage check
- `src/lib/schemas/profile.ts` — Profile types (if needed for type reference)
- `src/components/custom/TickerClient.tsx` — Reference for `useSyncExternalStore` + localStorage pattern
- `src/components/custom/StatsBridge.tsx` — Reference for simple Server Component + error handling
- `src/components/custom/TickerBlock.tsx` — Reference for Server/Client composition pattern

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.5] — BDD acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md — Component Structure] — `src/components/custom/LatestActivitySlot.tsx`
- [Source: _bmad-output/planning-artifacts/architecture.md — Data Fetching Strategy] — ISR 60s, Server Component for Latest Activity
- [Source: _bmad-output/planning-artifacts/architecture.md — Naming Conventions] — PascalCase components, camelCase functions
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Latest Activity Slot] — Priority queue, 3 desktop / 2 tablet / 1 mobile, first-visit hiding
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Responsive] — Breakpoint item counts
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Accessibility] — `<section aria-label>`, `<article>` per item
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Typography] — Source Serif 4 for names, Inter for metadata
- [Source: _bmad-output/implementation-artifacts/1-4-stats-bridge-component.md] — Server Component pattern, error handling, testing approach

### Previous Story Intelligence (Story 1.4)

**Key Learnings from Story 1.4:**
- Async Server Components with `await` work natively in React 19 / Next.js 16
- `getStatsBridgeData()` pattern: create dedicated query function per component
- Try/catch with `return null` for graceful degradation — proven pattern
- `Promise.all` for independent queries (not needed here — single query)
- Vitest: mock query function in component tests, mock Supabase client in query tests
- `cleanup()` in `afterEach` for jsdom DOM accumulation prevention
- `vi.mock` factory hoisting: inline mock data in factory
- Supabase join type casting: `as unknown as { name: string }` for PostgREST join results
- Build succeeds even when Supabase cookies error occurs during static generation (try/catch handles it)

**From Story 1.3 (TickerClient):**
- `useSyncExternalStore` pattern for reading localStorage without hydration mismatch
- SSR returns `false`/`"true"` (server snapshot), client returns live value
- `const subscribe = () => () => {}` — noop subscribe for one-time reads
- React 19 lint rules: no `setState` in effects, no ref access during render

**Problems to Avoid:**
- Do NOT use `useState` + `useEffect` for mounted state — use `useSyncExternalStore`
- Do NOT read localStorage directly during render — always through `useSyncExternalStore`
- Do NOT write to `STORAGE_KEYS.HAS_VISITED` — TickerClient already does this
- Do NOT import external date libraries — `Date` arithmetic is sufficient
- Do NOT add loading spinners — SSR ensures content appears instantly

### Git Intelligence

**Recent Commits:**
- `6fc2583` — Code review fixes for Story 1.2: defense-in-depth and error handling
- `c226394` — Implement Story 1.2: database schema, seed data, and Zod validation
- `575be6c` — Mark Story 1.1 done, create Story 1.2 context
- `d5c33de` — Initialize Warning Collective: Next.js 16, Slate & Ink design system, BMAD planning artifacts

**Patterns to Follow:**
- All source files under `src/`
- Components in `src/components/custom/` (PascalCase filenames)
- Tests co-located: `Component.test.tsx` next to `Component.tsx`
- Query functions in `src/lib/queries/` (camelCase filenames)
- Utility functions in `src/lib/utils/` (camelCase filenames)

### Latest Tech Information

| Technology | Version | Key Notes |
|---|---|---|
| Next.js | 16.1.6 | App Router, Server Components default, `export const revalidate` for ISR |
| React | 19.2.3 | Server Components, async components, `useSyncExternalStore` for external stores |
| Vitest | 4.1.0 | jsdom environment, `@testing-library/react` for component testing |
| @testing-library/react | 16.3.2 | `render()`, `screen`, `cleanup()` in afterEach |
| Tailwind CSS | 4.x | CSS variable tokens, responsive prefixes (`sm:`, `md:`, `lg:`) |
| Supabase JS | 2.99.1 | `.from().select().eq().order().limit()` query builder |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Date-only strings ("YYYY-MM-DD") parsed as UTC midnight by `new Date()` cause off-by-one day errors in negative-offset timezones — fixed by parsing with `new Date(y, m-1, d)` to create local dates
- Responsive item visibility handled via CSS classes (`hidden md:block`, `hidden lg:block`) — no JS needed for breakpoint-based item counts
- `LatestActivityClient` only READS `wc:has-visited` from localStorage — never writes (TickerClient handles writing)

### Completion Notes List

- Created `getLatestActivity()` query fetching 3 most recent published profiles by departure_date
- Created `formatRelativeDate()` utility with Today/Yesterday/X days ago/X weeks ago/absolute date formatting
- LatestActivitySlot (Server Component) renders `<section>` with `<article>` elements, each linking to `/profiles/[slug]`
- LatestActivityClient (Client Component) wraps section for first-visit mobile hiding via `useSyncExternalStore` + localStorage
- Responsive item visibility: all 3 on desktop (lg+), 2 on tablet (md+), 1 on mobile
- 22 new tests (4 query + 6 formatDate + 8 slot + 4 client), 98 total pass
- Lint: 0 errors, Build: succeeds, TypeScript: clean

### File List

**Created:**
- `src/lib/queries/latestActivity.ts` — Latest activity query function with `ActivityItem` interface
- `src/lib/queries/latestActivity.test.ts` — 4 unit tests for query function
- `src/lib/utils/formatDate.ts` — Relative date formatting utility
- `src/lib/utils/formatDate.test.ts` — 6 unit tests for date formatting
- `src/components/custom/LatestActivitySlot.tsx` — Async Server Component
- `src/components/custom/LatestActivitySlot.test.tsx` — 8 unit tests for server component
- `src/components/custom/LatestActivityClient.tsx` — Client wrapper for first-visit hiding
- `src/components/custom/LatestActivityClient.test.tsx` — 4 unit tests for client component

**Modified:**
- `src/app/page.tsx` — Added `<LatestActivitySlot />` after `<StatsBridge />`
