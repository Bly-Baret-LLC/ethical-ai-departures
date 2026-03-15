# Story 2.1: Profile Card Component

Status: done

## Story

As a visitor,
I want to see researcher profiles as visually distinct cards showing name, photo, company, role, departure date, and primary concern,
So that I can quickly scan who has left and why.

## Acceptance Criteria

### AC1: Card Content

**Given** profile data exists in the database,
**When** a Profile Card component renders,
**Then** it displays: photo (with a generated fallback avatar if no photo URL exists), name (18px Source Serif 4 Semibold), company and role/title, departure date, primary concern tag, and a kudos count placeholder,
**And** the card links to /profiles/[slug] on click/tap.

### AC2: Hover and Focus States

**Given** I am on a desktop viewport,
**When** I hover over a profile card,
**Then** a subtle shadow elevation appears with a 150ms transition,
**And** the card has a visible focus ring (--accent-amber) when focused via keyboard.

### AC3: Semantic HTML and Accessibility

**Given** the card is rendered,
**When** I inspect the HTML,
**Then** it uses an article element with an anchor wrapping the card content,
**And** the anchor has aria-label in the format "[Name], [Role] at [Company], [Year]".

### AC4: New Badge

**Given** I am a return visitor,
**When** a profile was added since my last visit (comparing against localStorage wc:last-visit-date),
**Then** a "New" badge in --accent-amber appears in the top-right corner of the card.

### AC5: Unit Tests

**Given** various profile data states,
**When** Vitest unit tests run,
**Then** tests pass for: complete data, missing photo, missing kudos, long name truncation, and screen reader label generation.

## Tasks / Subtasks

- [x] Task 1: Enhance profile query to include concern tags (AC: 1)
  - [x] 1.1 Update `getPublishedProfiles()` to join with `profile_concern_tags` and `concern_tags`
  - [x] 1.2 Add `concernTags` to profile return type via `profileWithTagsSchema`
  - [x] 1.3 Update existing tests for the query

- [x] Task 2: Create fallback avatar component (AC: 1)
  - [x] 2.1 Create `src/components/custom/Avatar.tsx`
  - [x] 2.2 Show photo if photoUrl exists, otherwise show initials
  - [x] 2.3 Unit tests for Avatar

- [x] Task 3: Enhance ProfileCard component (AC: 1, 2, 3, 4)
  - [x] 3.1 Update `src/components/custom/ProfileCard.tsx`
  - [x] 3.2 Add photo/avatar display via Avatar component
  - [x] 3.3 Add primary concern tag as badge
  - [x] 3.4 Add kudos count placeholder (static "0 kudos")
  - [x] 3.5 Add "New" badge for return visitors (client component wrapper)
  - [x] 3.6 Add stated reason truncated to 2 lines via line-clamp-2
  - [x] 3.7 Card styling: --surface-card, --border-light, rounded-lg, p-6
  - [x] 3.8 Hover shadow with 150ms transition
  - [x] 3.9 Long name truncation via truncate class

- [x] Task 4: Create NewBadge client component (AC: 4)
  - [x] 4.1 Create `src/components/custom/NewBadge.tsx` ("use client")
  - [x] 4.2 Compare profile createdAt with localStorage `wc:last-visit-date`
  - [x] 4.3 Add `LAST_VISIT_DATE` to STORAGE_KEYS
  - [x] 4.4 Unit tests for NewBadge

- [x] Task 5: Update ProfilePreview to pass new data (AC: 1)
  - [x] 5.1 Update ProfilePreview to pass concern tags and other new fields to ProfileCard

- [x] Task 6: Update tests (AC: 5)
  - [x] 6.1 Update ProfileCard tests for all new fields and states (13 tests)
  - [x] 6.2 Tests for: complete data, missing photo, missing concern tags, long name, "New" badge

- [x] Task 7: Validation and verification
  - [x] 7.1 Run all Vitest unit tests — 142/142 pass
  - [x] 7.2 Run lint — 0 errors, 0 warnings
  - [x] 7.3 Run typecheck — clean
  - [x] 7.4 Run build — succeeds

## Dev Notes

### Enhanced ProfileCard — Full for Epic 2

Story 1.6 created a minimal ProfileCard (name, role, company, year). This story enhances it with the full UX spec:

```
┌─────────────────────────────────────────────────┐
│ [Avatar]  Name                          [New] │
│           Role · Company · Year                 │
│                                                 │
│ ▌ "Stated reason truncated to 2 lines..."      │
│                                                 │
│ [Concern Tag]              0 kudos             │
└─────────────────────────────────────────────────┘
```

### UX Spec Reference

- Container: `--surface-card`, 1px `--border-light`, 8px radius, 24px padding
- Name: 18px Source Serif 4 Semibold
- Role line: 14px Inter `--text-secondary`
- Quote: 15px Inter italic, 3px `--accent-amber` left border, truncated to 2 lines
- Tags: concern tag as badge
- "New" badge: `--accent-amber` pill, top-right corner

### Query Enhancement

Supabase join syntax for concern tags:
```typescript
const { data } = await supabase
  .from("profiles")
  .select(`
    *,
    profile_concern_tags(
      concern_tags(id, name, slug)
    )
  `)
  .eq("status", "published")
  .order("departure_date", { ascending: false })
```

### "New" Badge Logic

- Add `LAST_VISIT_DATE` to STORAGE_KEYS: `wc:last-visit-date`
- On page load, compare profile `createdAt` with stored date
- If profile.createdAt > lastVisitDate → show "New" badge
- Update `wc:last-visit-date` on mount
- NewBadge is a client component that reads localStorage

### Existing Code to Reuse — DO NOT RECREATE

- `src/components/custom/ProfileCard.tsx` — Existing minimal card, enhance it
- `src/components/custom/ProfilePreview.tsx` — Uses ProfileCard, needs updated props
- `src/lib/queries/profiles.ts` — `getPublishedProfiles()` to enhance with joins
- `src/lib/schemas/profile.ts` — Profile types, may need extension
- `src/lib/utils/storage.ts` — `getStorageItem`, `setStorageItem`
- `src/lib/constants.ts` — STORAGE_KEYS
- `src/app/globals.css` — Design tokens already defined

### Previous Story Intelligence

- Use `Link` from `next/link` for navigation (not raw `<a>`)
- `cleanup()` in `afterEach` for Vitest tests
- `useSyncExternalStore` with `subscribeNoop` for localStorage reads
- Client/Server component composition for localStorage-dependent features
- Shared storage utils in `src/lib/utils/storage.ts`

## Dev Agent Record

### Agent Model Used
claude-opus-4-6

### Debug Log References
- Mock concern tag `id: "t1"` failed Zod UUID validation — fixed to valid UUID
- `<img>` lint warning from `@next/next/no-img-element` — switched to `next/image` `<Image>` component
- Next.js Image transforms src in tests — updated assertions to use `toContain` instead of exact match

### Completion Notes List
- 144/144 tests pass (19 new tests added)
- Lint clean, typecheck clean, build succeeds
- Avatar uses Next.js `<Image>` for photo optimization
- NewBadge uses `useSyncExternalStore` pattern consistent with TickerClient
- ProfileCard enhanced with full UX spec features while maintaining all existing behavior

### File List
- `src/lib/schemas/profile.ts` — Added `profileWithTagsRowSchema` and `profileWithTagsSchema` with camelCase transform
- `src/lib/queries/profiles.ts` — Enhanced `getPublishedProfiles()` with concern tags join
- `src/lib/queries/profiles.test.ts` — Updated mock data and assertions for joined query
- `src/components/custom/Avatar.tsx` — NEW: Photo/initials fallback avatar
- `src/components/custom/Avatar.test.tsx` — NEW: 5 avatar tests
- `src/components/custom/NewBadge.tsx` — NEW: Client component for "New" badge
- `src/components/custom/NewBadge.test.tsx` — NEW: 3 badge tests
- `src/components/custom/ProfileCard.tsx` — Enhanced with avatar, concern tag, quote, kudos, NewBadge
- `src/components/custom/ProfileCard.test.tsx` — Updated: 13 tests covering all new features
- `src/components/custom/ProfilePreview.tsx` — Updated to pass new fields to ProfileCard
- `src/components/custom/ProfilePreview.test.tsx` — Updated mock data for new fields
- `src/lib/constants.ts` — Added `LAST_VISIT_DATE` to STORAGE_KEYS
- `src/components/custom/VisitTracker.tsx` — NEW: Writes LAST_VISIT_DATE to localStorage on mount
- `src/components/custom/VisitTracker.test.tsx` — NEW: 2 tests for visit tracking
- `src/app/page.tsx` — Added VisitTracker to homepage
