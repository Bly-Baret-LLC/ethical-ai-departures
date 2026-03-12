# Story 1.2: Departure Profiles Database Schema and Seed Data

Status: ready-for-dev

## Story

As a developer,
I want the core database schema for departure profiles and ticker stats,
So that the homepage can display real data.

## Acceptance Criteria

### AC1: Database Table Creation

**Given** a connected Supabase project,
**When** I run the database migration,
**Then** the following tables are created:

- `profiles` (id, slug, name, photo_url, company, role, departure_date, stated_reason, status, created_at, updated_at)
- `profile_sources` (id, profile_id, url, title, platform, published_date)
- `concern_tags` (id, name, slug, description)
- `profile_concern_tags` (profile_id, concern_tag_id)
- `ticker_stats` (id, total_count, ninety_day_count, seniority_breakdown, updated_at)

**And** all foreign keys and indexes are properly defined.

### AC2: Row-Level Security (RLS) Policies

**Given** the tables exist,
**When** I query with the anonymous/public Supabase key,
**Then** only rows with `status = 'published'` are returned due to RLS policies,
**And** queries with the service role key return all rows including drafts.

### AC3: Zod Validation Schemas

**Given** the schema is deployed,
**When** I run the Zod schema validation module,
**Then** Zod schemas exist for each entity (Profile, ProfileSource, ConcernTag, TickerStats),
**And** each schema enforces required fields (e.g., `profile_sources.url` is required, `profiles.name` is required),
**And** a snake_case-to-camelCase transform utility converts DB results at the Supabase client boundary.

### AC4: Seed Data and Type Exports

**Given** the migration has been applied,
**When** I run the seed script,
**Then** 5–10 sample profiles with associated sources and concern tags are inserted,
**And** the `ticker_stats` table is populated with correct aggregate counts,
**And** TypeScript types are exported from a shared types module for use in components.

## Tasks / Subtasks

- [ ] Task 1: Initialize Supabase local development (AC: 1)
  - [ ] 1.1 Install Supabase CLI globally and run `supabase init` in project root
  - [ ] 1.2 Create `supabase/config.toml` with project configuration
  - [ ] 1.3 Verify `supabase start` launches local Supabase (Postgres, Auth, API, Studio)
  - [ ] 1.4 Add `supabase/.temp/` to `.gitignore`

- [ ] Task 2: Create database migration — profiles table (AC: 1)
  - [ ] 2.1 Create migration file `supabase/migrations/<timestamp>_create_profiles.sql`
  - [ ] 2.2 Define `profiles` table with all columns (see schema below)
  - [ ] 2.3 Create indexes: `idx_profiles_slug`, `idx_profiles_status`, `idx_profiles_company`, `idx_profiles_departure_date`
  - [ ] 2.4 Add `updated_at` trigger function for auto-update

- [ ] Task 3: Create database migration — profile_sources table (AC: 1)
  - [ ] 3.1 Create migration file `supabase/migrations/<timestamp>_create_profile_sources.sql`
  - [ ] 3.2 Define `profile_sources` table with FK to `profiles(id)` and `ON DELETE CASCADE`
  - [ ] 3.3 Create index: `idx_profile_sources_profile_id`

- [ ] Task 4: Create database migration — concern_tags and junction table (AC: 1)
  - [ ] 4.1 Create migration file `supabase/migrations/<timestamp>_create_concern_tags.sql`
  - [ ] 4.2 Define `concern_tags` table with unique slug
  - [ ] 4.3 Define `profile_concern_tags` junction table with composite primary key `(profile_id, concern_tag_id)`
  - [ ] 4.4 Create index: `idx_profile_concern_tags_tag_id`

- [ ] Task 5: Create database migration — ticker_stats table (AC: 1)
  - [ ] 5.1 Create migration file `supabase/migrations/<timestamp>_create_ticker_stats.sql`
  - [ ] 5.2 Define `ticker_stats` table with aggregate columns

- [ ] Task 6: Create RLS policies migration (AC: 2)
  - [ ] 6.1 Create migration file `supabase/migrations/<timestamp>_create_rls_policies.sql`
  - [ ] 6.2 Enable RLS on all 5 tables
  - [ ] 6.3 Create `profiles` SELECT policy: public can read rows where `status = 'published'`
  - [ ] 6.4 Create `profile_sources` SELECT policy: public can read rows where linked profile is published
  - [ ] 6.5 Create `concern_tags` SELECT policy: public can read all rows
  - [ ] 6.6 Create `profile_concern_tags` SELECT policy: public can read rows where linked profile is published
  - [ ] 6.7 Create `ticker_stats` SELECT policy: public can read all rows
  - [ ] 6.8 For all tables: service role key bypasses RLS (default Supabase behavior, no policy needed)

- [ ] Task 7: Create Zod validation schemas (AC: 3)
  - [ ] 7.1 Create `src/lib/schemas/profile.ts` — `profileSchema`, `profileSourceSchema`, `concernTagSchema`, `tickerStatsSchema`
  - [ ] 7.2 Enforce required fields, enum validation for `status` ('draft' | 'published' | 'archived'), URL format for `source.url`
  - [ ] 7.3 Use Zod 4 `.transform()` for snake_case → camelCase at schema boundary
  - [ ] 7.4 Export inferred TypeScript types: `Profile`, `ProfileSource`, `ConcernTag`, `TickerStats`

- [ ] Task 8: Create snake_case → camelCase transform utility (AC: 3)
  - [ ] 8.1 Create `src/lib/transforms/caseTransform.ts` — generic `snakeToCamel()` utility
  - [ ] 8.2 Create `src/lib/transforms/profile.ts` — profile-specific transform wrapping Zod parse
  - [ ] 8.3 Write unit tests for transforms in `src/lib/transforms/caseTransform.test.ts`

- [ ] Task 9: Update shared TypeScript types (AC: 4)
  - [ ] 9.1 Export `Profile`, `ProfileSource`, `ConcernTag`, `TickerStats` types from `src/types/index.ts`
  - [ ] 9.2 Ensure all types use camelCase (transformed from DB snake_case)

- [ ] Task 10: Create seed data script (AC: 4)
  - [ ] 10.1 Create `supabase/seed.sql` with 8 realistic sample profiles
  - [ ] 10.2 Include diverse companies (OpenAI, Anthropic, Google DeepMind, Meta FAIR, xAI, etc.)
  - [ ] 10.3 Include 6–8 concern tags covering primary safety concern categories
  - [ ] 10.4 Associate each profile with 1–3 concern tags and 1–2 sources with real-looking URLs
  - [ ] 10.5 Include profiles with varied statuses: most `published`, 1–2 `draft` (to test RLS)
  - [ ] 10.6 Populate `ticker_stats` row with aggregate counts matching the published profiles
  - [ ] 10.7 Include varied seniority levels in profiles (Research Director, Safety Lead, Senior Researcher, Research Scientist)

- [ ] Task 11: Write unit tests for Zod schemas (AC: 3)
  - [ ] 11.1 Create `src/lib/schemas/profile.test.ts`
  - [ ] 11.2 Test valid profile parsing with all required fields
  - [ ] 11.3 Test rejection of invalid profiles (missing name, invalid status, bad URL)
  - [ ] 11.4 Test snake_case → camelCase transform output
  - [ ] 11.5 Test each schema entity (ProfileSource, ConcernTag, TickerStats)

- [ ] Task 12: Create Supabase query functions (AC: 4)
  - [ ] 12.1 Create `src/lib/queries/profiles.ts` — `getPublishedProfiles()`, `getProfileBySlug()`
  - [ ] 12.2 Create `src/lib/queries/ticker.ts` — `getTickerStats()`
  - [ ] 12.3 Apply transforms at query boundary (parse through Zod schemas)
  - [ ] 12.4 Write unit tests for query functions with mocked Supabase client

- [ ] Task 13: Validation and verification (AC: 1, 2, 3, 4)
  - [ ] 13.1 Run `supabase db push` to apply migrations to local database
  - [ ] 13.2 Run `supabase db reset` to verify migrations + seed data apply cleanly
  - [ ] 13.3 Verify RLS: query with anon key returns only published profiles
  - [ ] 13.4 Verify RLS: query with service role key returns all profiles including drafts
  - [ ] 13.5 Run all Vitest unit tests — must pass
  - [ ] 13.6 Run lint and typecheck — must pass
  - [ ] 13.7 Run `npm run build` — must succeed

## Dev Notes

### Database Schema Specification

#### `profiles` Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  departure_date DATE NOT NULL,
  stated_reason TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_company ON profiles(company);
CREATE INDEX idx_profiles_departure_date ON profiles(departure_date);
```

#### `profile_sources` Table

```sql
CREATE TABLE profile_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  platform TEXT,
  published_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profile_sources_profile_id ON profile_sources(profile_id);
```

#### `concern_tags` Table

```sql
CREATE TABLE concern_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `profile_concern_tags` Junction Table

```sql
CREATE TABLE profile_concern_tags (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concern_tag_id UUID NOT NULL REFERENCES concern_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, concern_tag_id)
);

CREATE INDEX idx_profile_concern_tags_tag_id ON profile_concern_tags(concern_tag_id);
```

#### `ticker_stats` Table

```sql
CREATE TABLE ticker_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_count INTEGER NOT NULL DEFAULT 0,
  ninety_day_count INTEGER NOT NULL DEFAULT 0,
  seniority_breakdown JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### Auto-Update Trigger for `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ticker_stats_updated_at
  BEFORE UPDATE ON ticker_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### RLS Policy Specification

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE concern_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_concern_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticker_stats ENABLE ROW LEVEL SECURITY;

-- profiles: Public can read only published
CREATE POLICY "Public can read published profiles"
  ON profiles FOR SELECT
  USING (status = 'published');

-- profile_sources: Public can read sources for published profiles
CREATE POLICY "Public can read sources for published profiles"
  ON profile_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_sources.profile_id
      AND profiles.status = 'published'
    )
  );

-- concern_tags: Public can read all tags
CREATE POLICY "Public can read all concern tags"
  ON concern_tags FOR SELECT
  USING (true);

-- profile_concern_tags: Public can read tags for published profiles
CREATE POLICY "Public can read tags for published profiles"
  ON profile_concern_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_concern_tags.profile_id
      AND profiles.status = 'published'
    )
  );

-- ticker_stats: Public can read all stats
CREATE POLICY "Public can read ticker stats"
  ON ticker_stats FOR SELECT
  USING (true);
```

**Note:** Service role key automatically bypasses RLS — no additional policy needed for editorial/agent access.

### Zod Schema Pattern (Zod 4.x)

**CRITICAL: We are using Zod 4.3.6** which has breaking changes from Zod 3. Key differences:
- Error customization uses unified `error` parameter
- `.int()` only accepts safe integers
- `.merge()` deprecated — use `.extend()` instead
- String format methods available as top-level: `z.email()`, `z.uuid()`, `z.url()`

```typescript
// src/lib/schemas/profile.ts
import { z } from 'zod'

// DB row schemas (snake_case — matches Supabase response)
export const profileRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  photo_url: z.string().nullable(),
  company: z.string(),
  role: z.string(),
  departure_date: z.string(), // ISO date string from Postgres
  stated_reason: z.string().nullable(),
  status: z.enum(['draft', 'published', 'archived']),
  created_at: z.string(),
  updated_at: z.string(),
})

// Transformed schema (camelCase — used in components)
export const profileSchema = profileRowSchema.transform((row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  photoUrl: row.photo_url,
  company: row.company,
  role: row.role,
  departureDate: row.departure_date,
  statedReason: row.stated_reason,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
}))

export type ProfileRow = z.input<typeof profileSchema>
export type Profile = z.output<typeof profileSchema>
```

### snake_case → camelCase Transform Pattern

The architecture mandates transforms happen at the Supabase client boundary. Use Zod `.transform()` on each schema (as shown above) rather than a generic utility. This gives type-safe transforms per entity.

Also create a generic utility for one-off transforms:

```typescript
// src/lib/transforms/caseTransform.ts
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function snakeToCamelObject<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [snakeToCamel(key), value])
  )
}
```

### Supabase Query Function Pattern

```typescript
// src/lib/queries/profiles.ts
import { createClient } from '@/lib/supabase/server'
import { profileSchema } from '@/lib/schemas/profile'

export async function getPublishedProfiles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('departure_date', { ascending: false })

  if (error) throw error
  return data.map((row) => profileSchema.parse(row))
}

export async function getProfileBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return profileSchema.parse(data)
}
```

### Seed Data Specification

Create 8 sample profiles with these characteristics:
- **Companies represented:** OpenAI (2), Anthropic (1), Google DeepMind (2), Meta FAIR (1), xAI (1), Microsoft AI (1)
- **Roles (varied seniority):** Safety Lead, Research Director, Senior Researcher, Research Scientist, Principal Engineer, Head of Alignment
- **Statuses:** 6 `published`, 2 `draft` (for RLS testing)
- **Departure dates:** Spread across 2024–2026 (some within 90 days for ninety_day_count)
- **Concern tags (6–8):** Safety deprioritization, Rushed deployment, Inadequate oversight, Deceptive alignment research gaps, Lack of transparency, Military applications, Workforce displacement, AGI risk underestimation
- **Each profile:** 1–3 concern tags, 1–2 sources with realistic URLs
- **Ticker stats:** total_count=6 (published only), ninety_day_count=computed from dates, seniority_breakdown JSON with role counts

### Downstream Component Data Needs

These components will consume the data created in this story:

| Component (Story) | Tables Used | Key Fields |
|---|---|---|
| Ticker Block (1.3) | `ticker_stats` | total_count, ninety_day_count, seniority_breakdown |
| Stats Bridge (1.4) | `ticker_stats`, `profiles` | company_count (distinct companies), senior role %, top concern |
| Latest Activity (1.5) | `profiles`, `profile_sources` | name, company, role, departure_date, slug |
| Profile Cards (2.1) | `profiles`, `concern_tags`, `profile_sources` | All profile fields + tags + primary source |
| Filter Panel (2.3) | `profiles`, `concern_tags` | company, departure_date, role, concern_tag slugs |

### Project Structure Notes

Files to create in this story:

```
supabase/
├── config.toml
├── seed.sql
└── migrations/
    ├── <timestamp>_create_profiles.sql
    ├── <timestamp>_create_profile_sources.sql
    ├── <timestamp>_create_concern_tags.sql
    ├── <timestamp>_create_ticker_stats.sql
    └── <timestamp>_create_rls_policies.sql

src/lib/
├── schemas/
│   ├── profile.ts              # Zod schemas for all 4 entity types
│   └── profile.test.ts         # Unit tests for schemas
├── transforms/
│   ├── caseTransform.ts        # Generic snake→camel utility
│   ├── caseTransform.test.ts   # Unit tests for transforms
│   └── profile.ts              # Profile-specific transform (optional, if needed beyond Zod)
└── queries/
    ├── profiles.ts             # getPublishedProfiles(), getProfileBySlug()
    ├── profiles.test.ts        # Unit tests with mocked Supabase
    ├── ticker.ts               # getTickerStats()
    └── ticker.test.ts          # Unit tests with mocked Supabase

src/types/
└── index.ts                    # Export Profile, ProfileSource, ConcernTag, TickerStats types
```

Directories that already exist from Story 1.1: `src/lib/schemas/`, `src/lib/queries/`, `src/lib/transforms/`, `src/types/`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Database Schema section] — Full table definitions, index naming, RLS policies
- [Source: _bmad-output/planning-artifacts/architecture.md — API & Communication Patterns] — Server Component fetch pattern, Server Action response format
- [Source: _bmad-output/planning-artifacts/architecture.md — Naming Conventions] — snake_case DB columns, camelCase TS types, idx_ index prefix
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.2] — BDD acceptance criteria, dependency chain
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Profile Card Component] — Display fields informing schema columns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Ticker Block] — Aggregate stats fields (total_count, ninety_day_count, seniority_breakdown)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Filter Panel] — Filterable fields (company, departure_date, concern_tag, role) informing index strategy
- [Source: _bmad-output/implementation-artifacts/1-1-initialize-project-and-design-system-foundation.md] — Established project structure, Supabase client pattern, Zod installed, testing framework

### Previous Story Intelligence (Story 1.1)

**Key Learnings from Story 1.1:**
- Supabase client pattern established at `src/lib/supabase/server.ts` and `browser.ts` — reuse these, do NOT recreate
- Zod 4.3.6 installed — use Zod 4 syntax (unified `error` param, `.extend()` not `.merge()`)
- `src/types/index.ts` exists with `ActionResult<T>` type — extend this file with new types
- Vitest 4.1.0 with jsdom, `@testing-library/jest-dom` — test pattern established in `src/lib/constants.test.ts`
- `@` path alias configured in vitest.config.ts — use `@/lib/schemas/profile` imports in tests
- Port 3100 used for Playwright (not 3000) — keep this for any E2E tests
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

**Problems to Avoid:**
- Do NOT modify existing files unnecessarily (globals.css, layout.tsx, etc.)
- Do NOT change Supabase client implementations — they are working and tested
- When adding to `.gitignore`, append to existing file — do not overwrite

### Git Intelligence

**Recent Commits:**
- `d5c33de` — Initialize Warning Collective: Next.js 16, Slate & Ink design system, BMAD planning artifacts (317 files, Story 1.1 complete)

**Patterns to Follow:**
- All source files under `src/`
- Tests co-located with source files (e.g., `profile.test.ts` next to `profile.ts`)
- E2E tests in `tests/e2e/`

### Latest Tech Information

| Technology | Version | Key Notes |
|---|---|---|
| Supabase CLI | 2.78.1 | `supabase init`, `supabase migration new`, `supabase db push`, `supabase gen types` |
| @supabase/supabase-js | 2.99.1 | Full async, RLS-aware queries, generated types support |
| Zod | 4.3.6 | Breaking changes from v3: unified error param, `.extend()` replaces `.merge()`, `.int()` safe-only |
| @supabase/ssr | 0.9.0 | `getAll/setAll` cookie API (already implemented in server.ts) |

**Supabase CLI Commands for This Story:**
```bash
# Initialize Supabase (one-time)
npx supabase init

# Create new migration
npx supabase migration new create_profiles

# Apply migrations to local DB
npx supabase db push --local

# Reset local DB (apply migrations + seed)
npx supabase db reset

# Generate TypeScript types from schema
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
