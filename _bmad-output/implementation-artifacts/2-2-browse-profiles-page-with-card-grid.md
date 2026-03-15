# Story 2.2: Browse Profiles Page with Card Grid

Status: done

## Story

As a visitor,
I want a browse page showing all researcher profiles in a card grid,
So that I can explore who has departed from AI companies.

## Acceptance Criteria

### AC1: Card Grid Layout

**Given** I navigate to /profiles,
**When** the page loads as a Server Component,
**Then** all published profiles are fetched and rendered in a responsive card grid: 1 column on mobile, 2 columns on tablet, 3 columns on desktop,
**And** profiles are sorted by departure date with most recent first (default).

### AC2: ISR Configuration

**Given** the page is rendered,
**When** I inspect the ISR configuration,
**Then** the page uses ISR with 5-minute revalidation,
**And** no loading spinner is displayed (SSR provides complete HTML).

### AC3: Pagination

**Given** more than 20 profiles exist,
**When** the page renders,
**Then** pagination controls appear at the bottom of the grid (20 profiles per page),
**And** the current page is reflected in the URL (?page=2).

### AC4: Sort Control

**Given** URL params include a sort parameter (?sort=date or ?sort=name),
**When** the page loads,
**Then** profiles are sorted according to the URL parameter,
**And** the sort control reflects the active sort option.

### AC5: SEO and Metadata

**Given** the page is rendered,
**When** a search engine or social share previews it,
**Then** it has title "All Profiles · The Warning Collective",
**And** appropriate meta description and OG tags.

### AC6: Unit Tests

**Given** the page and pagination components,
**When** Vitest unit tests run,
**Then** tests pass for: profile rendering, pagination visibility, sort ordering, and edge cases.

## Tasks / Subtasks

- [x] Task 1: Create /profiles route and page (AC: 1, 2, 5)
  - [x] 1.1 Create `src/app/profiles/page.tsx` as async Server Component
  - [x] 1.2 Fetch all published profiles via `getPublishedProfiles()`
  - [x] 1.3 Set `export const revalidate = 300` (5 minutes)
  - [x] 1.4 Add metadata export with title and description
  - [x] 1.5 Render heading, profile count, sort control, and card grid

- [x] Task 2: Responsive grid layout in page (AC: 1, 3)
  - [x] 2.1 Grid integrated directly in page.tsx (no separate component needed)
  - [x] 2.2 Responsive grid: 1 col mobile, 2 col tablet (md:), 3 col desktop (lg:)
  - [x] 2.3 Render ProfileCard for each profile in the current page slice

- [x] Task 3: Create Pagination component (AC: 3)
  - [x] 3.1 Create `src/components/custom/Pagination.tsx`
  - [x] 3.2 Show prev/next and page numbers
  - [x] 3.3 Use `<Link>` with ?page= URL params for SSR-friendly navigation
  - [x] 3.4 Hide pagination when total profiles <= page size
  - [x] 3.5 Unit tests for Pagination (10 tests)

- [x] Task 4: Create SortControl component (AC: 4)
  - [x] 4.1 Create `src/components/custom/SortControl.tsx`
  - [x] 4.2 Support sort=date (default) and sort=name
  - [x] 4.3 Use `<Link>` with ?sort= URL params for SSR-friendly navigation
  - [x] 4.4 Highlight active sort option with aria-current
  - [x] 4.5 Unit tests for SortControl (6 tests)

- [x] Task 5: Implement server-side sorting and pagination (AC: 1, 3, 4)
  - [x] 5.1 Parse searchParams in page.tsx for page and sort
  - [x] 5.2 Sort profiles by departure_date (default) or name
  - [x] 5.3 Paginate with 20 per page slice

- [x] Task 6: Tests and validation (AC: 6)
  - [x] 6.1 Unit tests for profiles page (10 tests)
  - [x] 6.2 Run all Vitest tests — 170/170 pass
  - [x] 6.3 Run lint — 0 errors
  - [x] 6.4 Run typecheck — clean
  - [x] 6.5 Run build — succeeds

## Dev Notes

### Architecture Reference

- Profile browse: ISR (5min) for profile list. TanStack Table client-side filtering (Story 2.3).
- This story focuses on the server-rendered card grid with pagination and sorting.
- TanStack Table filtering comes in Story 2.3.

### Page Structure

```
/profiles (Server Component, ISR 5 min)
├── Heading: "All Profiles"
├── Count: "73 profiles"
├── SortControl: [Date ▼] [Name]
├── ProfileGrid (responsive 1/2/3 col)
│   └── ProfileCard × 20 (per page)
└── Pagination: [← Prev] [1] [2] [3] [4] [Next →]
```

### URL Patterns

- `/profiles` — default: sorted by date, page 1
- `/profiles?sort=name` — alphabetical by name
- `/profiles?page=2` — page 2
- `/profiles?sort=name&page=3` — combined

### SEO

- Title: "All Profiles · The Warning Collective"
- Meta description: "Browse [count] AI researchers who have departed from major AI companies citing safety concerns."

### Existing Code to Reuse — DO NOT RECREATE

- `src/components/custom/ProfileCard.tsx` — Existing card component from Story 2.1
- `src/lib/queries/profiles.ts` — `getPublishedProfiles()` already fetches all published profiles
- `src/lib/schemas/profile.ts` — `ProfileWithTags` type
- `src/lib/constants.ts` — `PROFILE_LIST_REVALIDATE_SECONDS = 300`
- `src/components/custom/VisitTracker.tsx` — For tracking visits

### Previous Story Intelligence

- ProfileCard accepts: slug, name, role, company, departureDate, photoUrl, statedReason, createdAt, concernTags
- `getPublishedProfiles()` returns `ProfileWithTags[]` with camelCase fields
- ISR revalidation uses `export const revalidate = N` pattern (see page.tsx)
- Next.js App Router uses `searchParams` prop for query parameters
- Use `<Link>` from next/link for pagination/sort (not `useRouter`)

## Dev Agent Record

### Agent Model Used
claude-opus-4-6

### Debug Log References
- vi.mock hoisting: `mockProfiles` referenced before initialization — fixed by using `vi.fn()` with `beforeEach` instead of inline data

### Completion Notes List
- 170/170 tests (26 new tests for Pagination, SortControl, ProfilesPage)
- Grid layout integrated directly in page.tsx instead of separate ProfileGrid component (unnecessary abstraction for a simple grid div)
- SortControl resets page to 1 when sort changes
- Pagination preserves sort params across page navigation
- Error state renders fallback message instead of returning null (unlike ProfilePreview which returns null on error)

### File List
- `src/app/profiles/page.tsx` — NEW: Browse profiles page with sorting and pagination
- `src/app/profiles/page.test.tsx` — NEW: 10 tests for page rendering, pagination, sorting, error handling
- `src/components/custom/Pagination.tsx` — NEW: SSR-friendly pagination with Link navigation
- `src/components/custom/Pagination.test.tsx` — NEW: 10 pagination tests
- `src/components/custom/SortControl.tsx` — NEW: Sort toggle (date/name) with Link navigation
- `src/components/custom/SortControl.test.tsx` — NEW: 6 sort control tests
