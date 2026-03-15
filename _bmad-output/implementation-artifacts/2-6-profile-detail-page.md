# Story 2.6: Profile Detail Page

Status: done

## Story

As a visitor,
I want a full profile page for each researcher showing their complete story with quotes, concerns, and sources,
So that I can deeply understand their departure.

## Acceptance Criteria

### AC1: Profile Header and Content
Full profile page at /profiles/[slug] with header (photo, name, company, role, departure date), stated reason as blockquote, concern tags, and source links.

### AC2: Source Links
All source links open in new tabs with `target="_blank" rel="noopener noreferrer"`.

### AC3: SEO and Metadata
JSON-LD Person schema, dynamic meta description, ISR 5-minute revalidation.

### AC4: 404 Handling
Missing slug returns 404 with link back to /profiles.

### AC5: Unit Tests
Tests pass for profile rendering, 404 handling, metadata generation.

## Tasks / Subtasks

- [x] Task 1: Enhance getProfileBySlug with joins (concern_tags + profile_sources, status=published filter)
- [x] Task 2: Create /profiles/[slug] page with full profile display
- [x] Task 3: Profile content inline in page (avatar, blockquote, tags, sources)
- [x] Task 4: Add metadata, JSON-LD Person schema, ISR 300s
- [x] Task 5: Tests and validation (222/222 pass, lint clean, typecheck clean, build passes)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### File List
- src/lib/schemas/profile.ts (added profileDetailRowSchema, profileDetailSchema, ProfileDetail type)
- src/lib/queries/profiles.ts (enhanced getProfileBySlug with joins and published filter)
- src/app/profiles/[slug]/page.tsx (new — profile detail page)
- src/app/profiles/[slug]/not-found.tsx (new — 404 fallback)
- src/app/profiles/[slug]/page.test.tsx (new — 12 tests)
- src/lib/queries/profiles.test.ts (updated mock data for sources, added source/tag tests)
