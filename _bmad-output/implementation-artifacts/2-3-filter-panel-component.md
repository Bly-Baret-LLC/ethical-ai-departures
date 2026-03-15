# Story 2.3: Filter Panel Component

Status: done

## Story

As a visitor,
I want to filter profiles by company, year, concern category,
So that I can find specific departures relevant to my interests.

## Acceptance Criteria

### AC1: Filter Panel Layout

**Given** I am on the /profiles page on a desktop viewport,
**When** I view the page layout,
**Then** a persistent filter panel is visible beside the card grid with filter sections for Company, Year, and Concern Category,
**And** each filter option shows a count of matching profiles.

### AC2: Client-Side Filtering

**Given** I select a filter (e.g., Company = OpenAI),
**When** the filter is applied,
**Then** the card grid updates instantly via client-side filtering (no server round-trip),
**And** the URL updates to include human-readable filter params (?company=openai),
**And** a result count updates (e.g., "Showing 12 of 73 profiles").

### AC3: URL State Restoration

**Given** I have multiple filters applied and I copy the URL,
**When** another user opens that URL,
**Then** the exact filter state is restored from URL params,
**And** pressing the browser back button restores the previous filter state.

### AC4: Mobile Responsive

**Given** I am on a mobile viewport,
**When** I tap a "Filters" button,
**Then** a collapsible filter panel slides into view,
**And** I can apply filters and close the panel to see filtered results.

### AC5: Empty State

**Given** active filters return zero results,
**When** the card grid renders,
**Then** an empty state message "No profiles match these filters" is displayed with a "Clear all filters" button.

### AC6: Unit Tests

**Given** the filter components,
**When** Vitest unit tests run,
**Then** tests pass for: filter rendering, filter application, URL sync, empty state.

## Tasks / Subtasks

- [x] Task 1: Refactor /profiles page for client-side filtering (AC: 1, 2)
  - [x] 1.1 Create `src/components/custom/ProfileBrowser.tsx` ("use client") — wraps filter + grid
  - [x] 1.2 Move card grid rendering from page.tsx into ProfileBrowser
  - [x] 1.3 page.tsx fetches all profiles server-side, passes to ProfileBrowser

- [x] Task 2: Create FilterPanel component (AC: 1, 4)
  - [x] 2.1 Create `src/components/custom/FilterPanel.tsx`
  - [x] 2.2 Sections: Company, Year, Concern Category
  - [x] 2.3 Each option shows count of matching profiles
  - [x] 2.4 Desktop: persistent sidebar (w-60); Mobile: collapsible toggle
  - [x] 2.5 Unit tests for FilterPanel (6 tests)

- [x] Task 3: Implement client-side filtering logic (AC: 2, 3)
  - [x] 3.1 Create `src/hooks/useProfileFilters.ts` — manages filter state and URL sync
  - [x] 3.2 Filter profiles by company, year, concern tags
  - [x] 3.3 Sync filters to/from URL search params via useSearchParams + router.push
  - [x] 3.4 Unit tests for filter hook (14 tests)

- [x] Task 4: Empty state and result count (AC: 5)
  - [x] 4.1 Show "Showing X of Y profiles" when filters active
  - [x] 4.2 Show empty state with "Clear all filters" button
  - [x] 4.3 Tests in ProfileBrowser test

- [x] Task 5: Integration and validation (AC: 6)
  - [x] 5.1 Run all Vitest tests — 188/188 pass
  - [x] 5.2 Run lint — 0 errors
  - [x] 5.3 Run typecheck — clean
  - [x] 5.4 Run build — succeeds

## Dev Notes

### Architecture

The /profiles page currently fetches all profiles server-side and renders them. For client-side filtering:
- page.tsx remains a Server Component that fetches all profiles
- A new `ProfileBrowser` client component receives all profiles as props
- ProfileBrowser handles filtering, sorting, pagination, and rendering client-side
- URL sync via `useSearchParams` + `useRouter` for back/forward support

### Simplification from Epic Spec

The epic spec mentions Seniority Level and Country filters, but the current database schema doesn't have these columns. Implementing only the filters that match existing data:
- **Company** — exists in profiles table
- **Year** — derived from departure_date
- **Concern Category** — from profile_concern_tags join

Seniority Level and Country filters will be added when those columns exist.

### Existing Code to Reuse — DO NOT RECREATE

- `src/app/profiles/page.tsx` — Server Component fetching profiles
- `src/components/custom/ProfileCard.tsx` — Card component
- `src/components/custom/Pagination.tsx` — Pagination component
- `src/components/custom/SortControl.tsx` — Sort toggle
- `src/lib/queries/profiles.ts` — `getPublishedProfiles()`

## Dev Agent Record

### Agent Model Used
claude-opus-4-6

### Debug Log References
- FilterPanel test: `getByText("OpenAI")` returns inner `<span>` not `<button>` with `aria-pressed` — fixed to use `getAllByRole("button", { pressed: true })`
- Unused `fireEvent` import in ProfileBrowser test — removed

### Completion Notes List
- 188/188 tests (30 new: 14 filter logic, 6 FilterPanel, 5 ProfileBrowser, 3 page, 2 removed from old page test)
- ProfileBrowser is a "use client" component: receives all profiles from server, handles filtering/sorting/rendering client-side
- FilterPanel uses dual rendering: lg:hidden mobile toggle + hidden lg:block desktop sidebar (jsdom sees both)
- URL sync via useSearchParams + router.push with { scroll: false }
- Sort integrated into ProfileBrowser (inline) rather than reusing SortControl (Link-based) since sorting is now client-side
- Pagination component from Story 2.2 kept but unused — may be needed for future stories or could be cleaned up
- Simplified from epic spec: no Seniority/Country filters (columns don't exist in DB schema)

### File List
- `src/app/profiles/page.tsx` — MODIFIED: simplified to fetch + pass profiles to ProfileBrowser
- `src/app/profiles/page.test.tsx` — MODIFIED: updated for new page structure
- `src/components/custom/ProfileBrowser.tsx` — NEW: Client component wrapping filter panel + card grid
- `src/components/custom/ProfileBrowser.test.tsx` — NEW: 5 tests
- `src/components/custom/FilterPanel.tsx` — NEW: Filter sidebar with Company/Year/Concern sections
- `src/components/custom/FilterPanel.test.tsx` — NEW: 6 tests
- `src/hooks/useProfileFilters.ts` — NEW: Filter state management + URL sync + filter logic
- `src/hooks/useProfileFilters.test.ts` — NEW: 14 tests for parsing, extraction, and filtering
