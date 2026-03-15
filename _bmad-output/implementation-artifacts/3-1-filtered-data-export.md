# Story 3.1: Filtered Data Export (CSV/JSON)

Status: done

## Story

As a journalist,
I want to export the current filtered set of profiles as CSV or JSON with full source citations,
So that I can use the data in my reporting without manual copying.

## Acceptance Criteria

### AC1: CSV Export
Export button downloads CSV with all profile fields plus permalink. Filename includes filter description.

### AC2: JSON Export
Export button downloads structured JSON array with concern tags. Valid and parseable.

### AC3: Multi-View Accessibility
Export buttons accessible in both card and table views. No login required.

### AC4: Mobile Responsiveness
Export controls accessible on mobile viewports (flex-wrap layout).

## Tasks / Subtasks

- [x] Task 1: Create export utility functions (CSV/JSON generation, filename builder, download helper)
- [x] Task 2: Create ExportButtons component with CSV/JSON buttons
- [x] Task 3: Integrate into ProfileBrowser controls bar
- [x] Task 4: Tests and validation (260/260 pass, lint clean, typecheck clean, build passes)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### File List
- src/lib/utils/export.ts (new — CSV/JSON generation, filename builder, download helper)
- src/lib/utils/export.test.ts (new — 12 tests)
- src/components/custom/ExportButtons.tsx (new — export button group)
- src/components/custom/ExportButtons.test.tsx (new — 6 tests)
- src/components/custom/ProfileBrowser.tsx (updated — added ExportButtons to controls bar)
