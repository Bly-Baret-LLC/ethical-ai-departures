# Story 2.7: Source Preview Tooltip

Status: done

## Story

As a visitor,
I want to hover over source links and see a preview of the linked page,
So that I can evaluate sources without leaving the profile.

## Acceptance Criteria

### AC1: Desktop Hover Behavior
Tooltip shows OG title (bold), description (truncated), domain, and thumbnail after 300ms hover delay. Includes "Open in new tab" footer link.

### AC2: Tooltip Dismissal & Positioning
Tooltip dismisses after 200ms delay on mouse leave. Repositions to stay within viewport.

### AC3: Fallback for Missing OG Metadata
Minimal fallback showing URL domain and path. If fetch fails, link behaves normally.

### AC4: Mobile Behavior
Source links open directly in new tab — no tooltip on mobile (hidden lg:block CSS).

### AC5: Keyboard Navigation
Tooltip shows on focus, dismissible via Escape key.

## Tasks / Subtasks

- [x] Task 1: Create /api/og-preview route handler with OG tag extraction and in-memory cache
- [x] Task 2: Create SourceTooltip client component with hover/focus/dismiss/keyboard support
- [x] Task 3: Update profile detail page to wrap source links with SourceTooltip
- [x] Task 4: Tests and validation (239/239 pass, lint clean, typecheck clean, build passes)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### File List
- src/app/api/og-preview/route.ts (new — API route for OG metadata extraction)
- src/app/api/og-preview/route.test.ts (new — 7 tests)
- src/components/custom/SourceTooltip.tsx (new — tooltip with hover/focus/dismiss)
- src/components/custom/SourceTooltip.test.tsx (new — 8 tests)
- src/app/profiles/[slug]/page.tsx (updated — source links wrapped with SourceTooltip)
- src/app/profiles/[slug]/page.test.tsx (updated — added SourceTooltip mock)
