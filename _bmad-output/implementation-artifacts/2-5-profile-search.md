# Story 2.5: Profile Search

Status: done

## Story

As a visitor,
I want to search profiles by name, company, or keyword from stated concerns,
So that I can quickly find specific researchers.

## Acceptance Criteria

### AC1: Real-time Search

**Given** I am on the /profiles page,
**When** I type in the search input field,
**Then** results filter in real-time as I type (debounced at 200ms) matching against name, company, role, and concern tag text,
**And** the search term persists in the URL (?q=safety).

### AC2: Combined Filtering

**Given** I have an active search term,
**When** I also have active filters,
**Then** both search and filters combine (AND logic),
**And** the result count reflects the combined filtering.

### AC3: Empty State

**Given** I search for a term with no matches,
**When** the results display,
**Then** "No profiles match your search" with a clear search button.

### AC4: Unit Tests

Tests pass for search rendering, debounce, URL sync, combined filtering.

## Tasks / Subtasks

- [x] Task 1: Add search (`q`) to FilterState, URL sync, and filterProfiles
- [x] Task 2: Create SearchInput component with 200ms debounce
- [x] Task 3: Integrate into ProfileBrowser with search-aware empty state
- [x] Task 4: 207/207 tests pass, lint clean, typecheck clean

## Dev Agent Record

### Agent Model Used
claude-opus-4-6

### Completion Notes List
- 207/207 tests (10 new: 7 SearchInput, 3 search filtering)
- Search matches against name, company, role, statedReason, and concern tag names
- Multi-word queries use AND logic (all terms must match)
- Debounced at 200ms with immediate clear on button click
- Empty state message changes based on whether search or filters caused zero results

### File List
- `src/components/custom/SearchInput.tsx` — NEW: Debounced search input
- `src/components/custom/SearchInput.test.tsx` — NEW: 7 tests
- `src/components/custom/ProfileBrowser.tsx` — MODIFIED: Added search input and search-aware empty state
- `src/hooks/useProfileFilters.ts` — MODIFIED: Added `q` to FilterState, search filtering logic, setSearch callback
- `src/hooks/useProfileFilters.test.ts` — MODIFIED: Added 3 search filtering tests, updated all FilterState objects
- `src/components/custom/FilterPanel.test.tsx` — MODIFIED: Added `q` to defaultFilters
