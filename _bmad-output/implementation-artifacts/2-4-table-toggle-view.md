# Story 2.4: Table Toggle View

Status: done

## Story

As a journalist,
I want to toggle between card view and table view,
So that I can efficiently compare profiles in a data-dense format.

## Acceptance Criteria

### AC1: View Toggle

**Given** I am on the /profiles page on a desktop or tablet viewport,
**When** I click the "Table" toggle button,
**Then** the view switches from card grid to a table with columns: Name, Company, Role, Departure Date, Concern Tags,
**And** the URL updates with ?view=table.

### AC2: Column Sorting

**Given** I am in table view,
**When** I click a column header,
**Then** the table sorts by that column (toggle ascending/descending).

### AC3: Row Click Navigation

**Given** I am in table view,
**When** I click a row,
**Then** I navigate to /profiles/[slug] for that researcher.

### AC4: Mobile Hidden

**Given** I am on a mobile viewport (< 768px),
**When** I view the profile browse page,
**Then** the table toggle button is hidden and cards are the only available view.

### AC5: Filters Apply to Both Views

**Given** I have active filters,
**When** I toggle between card and table views,
**Then** the same filters apply to both views.

### AC6: Unit Tests

Tests pass for view toggle, table rendering, column sorting, and filter integration.

## Tasks / Subtasks

- [x] Task 1: Create ProfileTable component (AC: 1, 2, 3)
  - [x] 1.1 Create `src/components/custom/ProfileTable.tsx` with TanStack Table
  - [x] 1.2 Columns: Name, Company, Role, Departure Date, Concern Tags
  - [x] 1.3 Column sorting via TanStack Table getSortedRowModel
  - [x] 1.4 Clickable rows navigate to profile detail (onClick + Enter/Space)
  - [x] 1.5 Unit tests (7 tests)

- [x] Task 2: Add view toggle to ProfileBrowser (AC: 1, 4, 5)
  - [x] 2.1 Add `view` state to useProfileFilters (view=card|table, synced to URL)
  - [x] 2.2 Add toggle buttons in ProfileBrowser (Cards/Table)
  - [x] 2.3 Hide toggle on mobile (hidden md:flex)
  - [x] 2.4 Render ProfileTable or card grid based on view
  - [x] 2.5 Sort control only shown in card view (table has its own sorting)

- [x] Task 3: Validation (AC: 6)
  - [x] 3.1 197/197 tests pass, lint clean (1 info warning re React Compiler), typecheck clean, build succeeds

## Dev Notes

### Existing Code
- ProfileBrowser already handles filters + card grid
- useProfileFilters manages URL params — add `view` param
- TanStack Table v8 already installed

## Dev Agent Record

### Agent Model Used
claude-opus-4-6

### Debug Log References
- FilterPanel.test.tsx missing `view` in FilterState — added `view: "card"` to defaultFilters
- useProfileFilters.test.ts needed `view` added to all filterProfiles calls
- react-hooks/incompatible-library warning for TanStack Table `useReactTable` — informational only, no fix needed

### Completion Notes List
- 197/197 tests (9 new: 7 ProfileTable, 2 filter hook view tests)
- ProfileTable uses TanStack Table v8 with getSortedRowModel for column sorting
- View toggle hidden on mobile via `hidden md:flex`
- Sort control only visible in card view; table has its own column header sorting
- Clickable rows with keyboard support (Enter/Space) using `role="link"`
- Concern tags rendered as badges in table; dash (—) for empty tags
- FilterState extended with `view: "card" | "table"`, synced to URL `?view=table`

### File List
- `src/components/custom/ProfileTable.tsx` — NEW: TanStack Table with sortable columns and clickable rows
- `src/components/custom/ProfileTable.test.tsx` — NEW: 7 tests
- `src/components/custom/ProfileBrowser.tsx` — MODIFIED: Added view toggle and ProfileTable integration
- `src/hooks/useProfileFilters.ts` — MODIFIED: Added `view` to FilterState, `setView` callback
- `src/hooks/useProfileFilters.test.ts` — MODIFIED: Added view parsing tests, updated all FilterState objects
- `src/components/custom/FilterPanel.test.tsx` — MODIFIED: Added `view` to defaultFilters
