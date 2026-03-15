# Story 3.2: Share Buttons and Permalink URLs

Status: done

## Story

As a journalist,
I want to share specific profiles and filtered views via stable, citation-ready URLs,
So that I can reference Warning Collective data in my articles.

## Acceptance Criteria

### AC1: Permalink URLs
Filter state already encoded in URL via useProfileFilters. Added metadataBase for canonical URLs.

### AC2: Share Buttons on Profile Pages
X/Twitter and LinkedIn share buttons with pre-populated text including name, company.

### AC3: Copy URL Button
Copy permalink to clipboard with "Link copied!" confirmation toast (2s auto-dismiss).

### AC4: Platform-Optimized Share Text
Twitter: includes @WarningCollect mention. LinkedIn: url-only share via official share API.

## Tasks / Subtasks

- [x] Task 1: Create ShareButtons component (X, LinkedIn, Copy URL)
- [x] Task 2: Add metadataBase to root layout for canonical URLs
- [x] Task 3: Add share buttons to profile detail page
- [x] Task 4: Tests and validation (266/266 pass, lint clean, typecheck clean, build passes)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### File List
- src/components/custom/ShareButtons.tsx (new — share buttons with copy-to-clipboard)
- src/components/custom/ShareButtons.test.tsx (new — 6 tests)
- src/app/layout.tsx (updated — added metadataBase for canonical URLs)
- src/app/profiles/[slug]/page.tsx (updated — added ShareButtons)
- src/app/profiles/[slug]/page.test.tsx (updated — added ShareButtons mock)
