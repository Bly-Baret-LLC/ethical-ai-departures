---
title: 'Predictions UI on Publications Page'
slug: 'predictions-ui-publications'
created: '2026-03-23'
status: 'ready'
stepsCompleted: [1, 2, 3]
tech_stack: ['Next.js 16', 'React 19', 'Tailwind CSS v4', 'Supabase', 'Zod 4']
files_to_modify:
  - src/app/publications/page.tsx
  - src/components/custom/PublicationsTabs.tsx (new)
  - src/components/custom/PredictionCard.tsx (new)
  - src/components/custom/PredictionStatusBadge.tsx (new)
  - src/components/custom/TrackRecordSection.tsx (new)
  - src/components/custom/WritingsSection.tsx
  - src/app/publications/track-record/page.tsx
  - supabase/seed.sql
code_patterns:
  - 'Server component fetches data, passes to client components'
  - 'Client components use useState for interactive filtering'
  - 'Cards: rounded-lg border border-border-light bg-surface-card px-5 py-5'
  - 'Pills: rounded-full px-3 py-1 text-sm font-medium'
  - 'Links: text-accent-amber hover:underline for internal, text-accent-info for external'
  - 'Zod .transform() for snake→camel at Supabase boundary'
test_patterns:
  - 'Vitest for unit tests: src/**/*.test.{ts,tsx}'
---

# Tech-Spec: Predictions UI on Publications Page

**Created:** 2026-03-23

## Overview

### Problem Statement

The predictions database schema, query layer, and track record page all exist, but there is zero UI surfacing predictions to visitors on the publications page. Researchers' falsifiable claims about AI risks are invisible despite being a core part of the site's editorial mission.

### Solution

Add a tabbed interface to the `/publications` page with three tabs: Writings, Predictions, and Track Record. Create prediction card components with status badges. Seed prediction data for high-profile researchers.

### Scope

**In Scope:**
- Tab navigation component on `/publications` page (Writings | Predictions | Track Record)
- Prediction card component with title, status badge, source quote, researcher link
- Status badge component (open, confirmed, disproven, partially resolved)
- Track record credibility index as third tab
- Seed data: ~10 predictions for Hinton, Sutskever, Leike, Kokotajlo, Aschenbrenner

**Out of Scope:**
- Voting UI on predictions
- Admin CRUD for predictions
- Filtering/search within predictions tab
- Seed data for all researchers

## Context for Development

### Codebase Patterns

**Design tokens (from `src/app/globals.css`):**
- Cards: `border-border-light bg-surface-card` on `#fffdf8`
- Text: `text-text-primary` (#1c1917), `text-text-secondary` (#78716c)
- Links: `text-accent-amber` (#b45309) internal, `text-accent-info` (#1e40af) external
- Accent red: `accent-red` (#8b1a1a) — used for ticker border
- Fonts: `font-serif` for headings, `font-sans` for body

**Component patterns (from `WritingsSection.tsx`):**
- Client component with `useState` for interactive elements
- Cards: `<li className="rounded-lg border border-border-light bg-surface-card px-5 py-5">`
- Filter pills: `<button className="rounded-full px-3 py-1 text-sm font-medium">`
- Active pill: `bg-accent-amber text-white`, inactive: `bg-accent-amber/10 text-accent-amber`
- Profile links: `<Link href={/profiles/${slug}} className="text-accent-amber hover:underline">`
- Expandable text: `<ExpandableText text={...} clampLines={4} />`

**Server/client split:**
- `src/app/publications/page.tsx` is a server component that fetches data via `getPublicationsWithProfiles()` and `getPublicationCountsByConcern()`
- Data is passed as props to `WritingsSection` (client component)
- Same pattern: fetch predictions + track records server-side, pass to client tabs component

**Query layer (from `src/lib/queries/predictions.ts`):**
- `getPredictions()` — returns `PredictionWithProfile[]` with joined profile name/slug
- `getTrackRecords()` — returns `TrackRecord[]` with per-researcher accuracy scores
- Both filter out `pending_review` status

**Schema (from `src/lib/schemas/prediction.ts`):**
- `PredictionWithProfile` type has: `id`, `profileId`, `profileName`, `profileSlug`, `title`, `description`, `sourceQuote`, `resolutionCriteria`, `status`, `resolutionDate`, `resolutionOutcome`, `resolutionRationale`, `resolutionEvidenceUrl`
- Status enum: `open | pending_review | confirmed | disproven | partially_resolved`

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/app/publications/page.tsx` | Server component — will add data fetching for predictions + track records |
| `src/components/custom/WritingsSection.tsx` | Existing writings UI — pattern reference for cards and pills |
| `src/components/custom/ExpandableText.tsx` | Reuse for long source quotes |
| `src/lib/queries/predictions.ts` | `getPredictions()`, `getTrackRecords()` — already built |
| `src/lib/schemas/prediction.ts` | `PredictionWithProfile` type — already built |
| `src/app/publications/track-record/page.tsx` | Existing track record page — will redirect to tab |
| `supabase/seed.sql` | Add prediction INSERT statements |
| `src/app/globals.css` | Design tokens reference |

### Technical Decisions

1. **Custom tabs, not shadcn Tabs** — No shadcn Tabs/Badge installed. Build lightweight tab buttons matching existing pill/button patterns. Less dependency, consistent look.

2. **URL search param for tab state** — Use `?tab=writings|predictions|track-record` so tabs are linkable/shareable. Default to `writings`. Use `useSearchParams()` in client component.

3. **All data fetched server-side** — The server component fetches publications, predictions, AND track records in parallel, passes all three to the client tabs component. No client-side fetching needed.

4. **Track record as tab, not separate page** — Move the track record content into the third tab. Redirect `/publications/track-record` to `/publications?tab=track-record` for backwards compat.

5. **Status badge color map:**
   - `open` → amber outline (`border-accent-amber text-accent-amber`)
   - `confirmed` → green (`bg-emerald-100 text-emerald-800`)
   - `disproven` → red (`bg-red-100 text-red-800`)
   - `partially_resolved` → blue (`bg-blue-100 text-blue-800`)

## Implementation Plan

### Tasks

#### Task 1: Create `PredictionStatusBadge` component
**File:** `src/components/custom/PredictionStatusBadge.tsx` (new)

Simple presentational component. Takes a `status` string, returns a colored pill.

```tsx
interface PredictionStatusBadgeProps {
  status: "open" | "confirmed" | "disproven" | "partially_resolved"
}
```

Color map:
- `open` → `border border-accent-amber text-accent-amber bg-transparent`
- `confirmed` → `bg-emerald-100 text-emerald-800`
- `disproven` → `bg-red-100 text-red-800`
- `partially_resolved` → `bg-blue-100 text-blue-800`

Display labels: "Open", "Confirmed", "Disproven", "Partially Resolved"

Base classes: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`

#### Task 2: Create `PredictionCard` component
**File:** `src/components/custom/PredictionCard.tsx` (new)

Card component for a single prediction. Reuses existing card styling.

```tsx
interface PredictionCardProps {
  prediction: PredictionWithProfile
}
```

Layout:
- Top row: `<PredictionStatusBadge>` + title (bold)
- Second row: researcher name (link to `/profiles/{slug}`) + date
- Body: source quote in `<ExpandableText clampLines={3}>` styled as blockquote (`border-l-2 border-accent-amber/30 pl-4 italic text-text-secondary`)
- If resolved: resolution rationale in a muted box below

Card wrapper: `<div className="rounded-lg border border-border-light bg-surface-card px-5 py-5">`

#### Task 3: Create `TrackRecordSection` component
**File:** `src/components/custom/TrackRecordSection.tsx` (new)

Extract the content from `src/app/publications/track-record/page.tsx` into a reusable client component. Takes `records: TrackRecord[]` as props.

Same UI as the existing track record page but without the `<main>` wrapper and back link — just the aggregate card and per-researcher list.

#### Task 4: Create `PublicationsTabs` component
**File:** `src/components/custom/PublicationsTabs.tsx` (new)

Client component that manages tab state and renders the correct content.

```tsx
interface PublicationsTabsProps {
  publications: PublicationWithProfile[]
  concernCounts: { tagName: string; tagSlug: string; count: number }[]
  predictions: PredictionWithProfile[]
  trackRecords: TrackRecord[]
}
```

Tab bar: Three buttons in a row, styled as:
- Active: `border-b-2 border-accent-amber text-text-primary font-semibold`
- Inactive: `text-text-secondary hover:text-text-primary`
- Container: `flex gap-6 border-b border-border-light`

Tab state: Read from `useSearchParams().get("tab")`, default `"writings"`. Update via `router.push()` with `scroll: false`.

Tab content:
- `"writings"` → render `<WritingsSection>` (existing component, unchanged)
- `"predictions"` → render prediction count + list of `<PredictionCard>` components
- `"track-record"` → render `<TrackRecordSection>`

#### Task 5: Update `/publications` page server component
**File:** `src/app/publications/page.tsx`

Changes:
1. Add imports for `getPredictions`, `getTrackRecords` from `@/lib/queries/predictions`
2. Fetch predictions and track records in parallel with existing queries:
   ```tsx
   const [publications, pubCountsByConcern, predictions, trackRecords] = await Promise.all([
     getPublicationsWithProfiles(),
     getPublicationCountsByConcern(),
     getPredictions(),
     getTrackRecords(),
   ])
   ```
3. Replace `<WritingsSection>` with `<PublicationsTabs>` passing all four data sets
4. Wrap in `<Suspense>` if needed for search params

#### Task 6: Redirect old track record route
**File:** `src/app/publications/track-record/page.tsx`

Replace the existing page with a redirect:
```tsx
import { redirect } from "next/navigation"
export default function TrackRecordRedirect() {
  redirect("/publications?tab=track-record")
}
```

#### Task 7: Add prediction seed data to `supabase/seed.sql`
**File:** `supabase/seed.sql`

Add ~10 INSERT statements for predictions from these researchers. Each prediction needs:
- `profile_id` via subquery: `SELECT id FROM profiles WHERE slug = '...'`
- `title` — short summary of the claim
- `source_quote` — the actual quote
- `resolution_criteria` — what would confirm/disprove it
- `status` — mix of `open`, `confirmed`, `partially_resolved`

Target researchers and example predictions:
1. **Geoffrey Hinton** — "AI could manipulate humans and pose existential risk within 5-20 years" (open)
2. **Geoffrey Hinton** — "AI systems will be able to generate persuasive disinformation at scale" (confirmed)
3. **Ilya Sutskever** — "Superhuman AI will require new alignment techniques beyond RLHF" (open)
4. **Jan Leike** — "Safety culture at OpenAI has taken a back seat to shiny products" (confirmed — evidenced by subsequent departures)
5. **Daniel Kokotajlo** — "AGI could arrive by 2027" (open)
6. **Daniel Kokotajlo** — "AI companies will prioritize deployment speed over safety evaluation" (confirmed)
7. **Leopold Aschenbrenner** — "AI lab security is inadequate for protecting model weights" (partially_resolved)
8. **Leopold Aschenbrenner** — "US government is unprepared for transformative AI" (open)
9. **Jan Leike** — "Without adequate oversight, AI alignment failures will occur in deployed systems" (open)
10. **Daniel Kokotajlo** — "AI capabilities will advance faster than mainstream expert predictions" (confirmed)

For confirmed/partially_resolved, include `resolution_date`, `resolution_outcome`, and `resolution_rationale`.

Also add `publication_predictions` links where a prediction directly ties to a seeded publication.

### Acceptance Criteria

**AC1: Tab navigation works**
- Given a user on `/publications`
- When the page loads
- Then three tabs are visible: "Writings", "Predictions", "Track Record"
- And "Writings" is active by default showing existing publications

**AC2: Tab switching updates URL**
- Given a user on `/publications`
- When they click the "Predictions" tab
- Then the URL updates to `/publications?tab=predictions`
- And prediction cards are displayed
- And the page does not scroll to top

**AC3: Prediction cards display correctly**
- Given predictions exist in the database
- When viewing the Predictions tab
- Then each card shows: status badge, title, researcher name (linked), source quote
- And confirmed/resolved predictions show resolution rationale

**AC4: Status badges are color-coded**
- Given predictions with different statuses
- When viewing prediction cards
- Then open=amber, confirmed=green, disproven=red, partially_resolved=blue

**AC5: Track record tab shows credibility index**
- Given resolved predictions exist
- When clicking the "Track Record" tab
- Then aggregate accuracy percentage is displayed
- And per-researcher scorecards are listed

**AC6: Old track record URL redirects**
- Given a user navigating to `/publications/track-record`
- When the page loads
- Then they are redirected to `/publications?tab=track-record`

**AC7: Seed data is present**
- Given a fresh `supabase db reset`
- When the seed runs
- Then at least 8 predictions exist across 5 researchers
- And at least 3 are confirmed/partially_resolved for track record display

## Additional Context

### Dependencies

- No new npm packages required
- Uses existing `getPredictions()` and `getTrackRecords()` queries
- Uses existing `PredictionWithProfile` and `TrackRecord` types
- Uses existing `ExpandableText` component for long quotes

### Testing Strategy

- **Unit tests** for `PredictionStatusBadge` — verify correct classes per status
- **Unit tests** for `PredictionCard` — verify rendering with different statuses
- **Smoke test** for publications page — verify all three tabs render without errors
- Run `npx tsc --noEmit` to verify types
- Run `npm run lint` to verify no lint errors
- Manual verification: check all three tabs render on localhost:3700

### Notes

- The `getPredictions()` query already filters out `pending_review` — no changes needed
- `WritingsSection` is untouched — it becomes the content of the first tab
- Search params require `<Suspense>` boundary in Next.js 16 for server components using `useSearchParams` — the `PublicationsTabs` client component handles this naturally since `useSearchParams` is called in a client component
