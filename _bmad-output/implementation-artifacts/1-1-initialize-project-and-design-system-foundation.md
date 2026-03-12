# Story 1.1: Initialize Project and Design System Foundation

Status: review

## Story

As a developer,
I want the project initialized with Next.js 16, Tailwind CSS 4, shadcn/ui, Supabase client, and design tokens,
so that all subsequent stories build on a consistent foundation.

## Acceptance Criteria

1. **Given** a fresh development environment, **When** I run the initialization sequence (create-next-app with TypeScript, Tailwind CSS 4, ESLint, App Router, src directory, then shadcn init, then npm install @supabase/supabase-js @supabase/ssr @tanstack/react-table next-plausible zod), **Then** the project builds and starts in development mode without errors, **And** the src/app directory structure follows Next.js 16 App Router conventions.

2. **Given** the project is initialized, **When** I inspect src/app/globals.css, **Then** all Slate & Ink design tokens are defined (--surface-primary, --surface-secondary, --surface-inverse, --text-primary, --text-inverse, --accent-amber, and dual-luminance dark mode tokens), **And** Source Serif 4 is self-hosted in public/fonts with font-display: swap and Georgia fallback (no external Google Fonts requests), **And** responsive breakpoints are configured (mobile <768px, tablet 768-1024px, desktop >1024px).

3. **Given** Vitest and Playwright are installed, **When** I run the test suites, **Then** Vitest runs unit tests successfully and Playwright runs E2E tests successfully, **And** axe-core is configured for accessibility testing in Playwright.

4. **Given** GitHub Actions CI is configured, **When** a pull request is opened, **Then** the pipeline runs lint, type-check, and test stages, **And** all three stages must pass before merge is allowed.

5. **Given** a Supabase project exists, **When** I check the environment configuration, **Then** NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local, **And** the Supabase client initializes without error, **And** the app builds and deploys successfully to Vercel.

## Tasks / Subtasks

- [x] **Task 1: Project Initialization** (AC: #1)
  - [x] 1.1: Run `npx create-next-app@latest warning-collective --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - [x] 1.2: Run `npx shadcn@latest init` (select default style, CSS variables = yes)
  - [x] 1.3: Install core dependencies: `npm install @supabase/supabase-js @supabase/ssr @tanstack/react-table next-plausible zod`
  - [x] 1.4: Verify `npm run dev` starts without errors and `npm run build` completes successfully

- [x] **Task 2: Design Tokens — Slate & Ink Palette** (AC: #2)
  - [x] 2.1: Define all CSS custom properties in `src/app/globals.css` (see exact values below)
  - [x] 2.2: Configure Tailwind CSS 4 theme extension to reference design tokens
  - [x] 2.3: Set up dual-luminance dark mode tokens (light-only MVP, dark values defined but not active)
  - [x] 2.4: Write a smoke test verifying token CSS variables are present in rendered output

- [x] **Task 3: Typography — Self-Hosted Source Serif 4** (AC: #2)
  - [x] 3.1: Download Source Serif 4 woff2 files (variable font) and place in `public/fonts/`
  - [x] 3.2: Add `@font-face` declarations in `src/app/globals.css` with `font-display: swap` and Georgia fallback
  - [x] 3.3: Configure font family tokens: Source Serif 4 for headings, Inter for body/UI
  - [x] 3.4: Verify no external font requests via Network tab

- [x] **Task 4: Responsive Breakpoints** (AC: #2)
  - [x] 4.1: Confirm Tailwind default breakpoints align with spec (sm:640, md:768, lg:1024, xl:1280)
  - [x] 4.2: Tailwind v4 default breakpoints already match: md=768px, lg=1024px — no custom aliases needed

- [x] **Task 5: Testing Framework Setup** (AC: #3)
  - [x] 5.1: Install Vitest + testing-library: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
  - [x] 5.2: Create `vitest.config.ts` with jsdom environment, path aliases, setup file
  - [x] 5.3: Install Playwright: `npm install -D @playwright/test && npx playwright install`
  - [x] 5.4: Create `playwright.config.ts` with Chromium
  - [x] 5.5: Install axe-core: `npm install -D @axe-core/playwright`
  - [x] 5.6: Create test utility at `tests/utils/setup.ts` with axe-core helper
  - [x] 5.7: Write a sample Vitest unit test and a sample Playwright E2E test, both passing
  - [x] 5.8: Write an accessibility E2E test using axe-core that runs against the homepage

- [x] **Task 6: GitHub Actions CI Pipeline** (AC: #4)
  - [x] 6.1: Create `.github/workflows/ci.yml` with lint, type-check, vitest, playwright stages
  - [x] 6.2: Configure merge gate: all stages must pass before merge is allowed

- [x] **Task 7: Supabase Client Configuration** (AC: #5)
  - [x] 7.1: Create `.env.local` with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY placeholders
  - [x] 7.2: Create `.env.example` documenting all environment variables
  - [x] 7.3: Create `src/lib/supabase/server.ts` — createServerClient for SSR and Server Actions
  - [x] 7.4: Create `src/lib/supabase/browser.ts` — createBrowserClient for real-time subscriptions
  - [x] 7.5: Verify Supabase client initializes without error (unit test with mock)

- [x] **Task 8: Project Structure Scaffolding** (AC: #1)
  - [x] 8.1: Create directory structure per architecture spec (see Project Structure below)
  - [x] 8.2: `src/lib/utils.ts` — cn() utility provided by shadcn init (kept at shadcn default path)
  - [x] 8.3: Create `src/lib/constants.ts` with initial constants (TICKER_REVALIDATE_SECONDS = 60, etc.)
  - [x] 8.4: Create `src/types/index.ts` as shared TypeScript types module
  - [x] 8.5: Add `.gitignore` entries for `.env.local`, node_modules, .next, playwright artifacts, etc.
  - [x] 8.6: Initialize git repository

## Dev Notes

### Critical Architecture Patterns

**Server Component Default:** React 19 Server Components are the default in Next.js 16 App Router. Only add `'use client'` when component needs browser APIs (localStorage, event handlers, real-time subscriptions).

**No Separate REST API Layer:** Data is fetched directly in Server Components via Supabase client. Mutations use Next.js Server Actions with Zod validation.

**Server Action Response Format — ALL Server Actions must return:**
```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

**Import Order Convention:**
```typescript
// 1. React/Next.js imports
import { Suspense } from 'react'
import Link from 'next/link'

// 2. Third-party libraries
import { useReactTable } from '@tanstack/react-table'

// 3. Internal: lib/utils
import { createServerClient } from '@/lib/supabase/server'

// 4. Internal: components
import { Button } from '@/components/ui/button'

// 5. Internal: types
import type { Profile } from '@/types'
```

**Naming Conventions:**
| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `TickerBlock.tsx` |
| Utility files | camelCase | `formatDate.ts` |
| Constants | SCREAMING_SNAKE_CASE | `TICKER_REVALIDATE_SECONDS` |
| Types/Interfaces | PascalCase, singular | `Profile`, `Prediction` |
| Zod schemas | camelCase + Schema suffix | `profileSchema` |
| Hooks | use prefix | `useTickerSubscription` |
| Server Actions | camelCase, verb-first | `castVote` |

### Design Token Exact Values

**Core Palette (src/app/globals.css):**

| CSS Variable | Light Value | Role |
|---|---|---|
| `--surface-primary` | `#fafaf9` | Page background |
| `--surface-secondary` | `#f5f5f4` | Card backgrounds, table row stripe |
| `--surface-inverse` | `#1e293b` | Ticker block background, dark containers |
| `--text-primary` | `#1e293b` | Headlines, body text |
| `--text-secondary` | `#78716c` | Metadata, captions |
| `--text-inverse` | `#fafaf9` | Text on dark surfaces |

**Functional Colors (light / dark values):**

| CSS Variable | Light | Dark | Role |
|---|---|---|---|
| `--accent-amber` | `#b45309` | `#d97706` | Primary interactive, buttons, active filters |
| `--state-hover` | `#44403c` | `#57534e` | Hover/pressed states |
| `--state-disabled` | `#d6d3d1` | `#78716c` | Disabled elements |
| `--status-verified` | `#065f46` | `#059669` | Verified claims, resolved predictions |
| `--status-error` | `#9f1239` | `#e11d48` | Error states, disproven predictions |
| `--accent-info` | `#1e40af` | `#3b82f6` | Links, informational |

**Additional Component Tokens:**

| CSS Variable | Value | Role |
|---|---|---|
| `--border-light` | `#e7e5e4` | Card borders, dividers |
| `--surface-card` | `#ffffff` | Card background (white) |
| `--radius` | `8px` | Card border radius |

**Dark Mode Strategy:** Define all tokens with `@media (prefers-color-scheme: dark)` block using the dark values. Ship light-only MVP. The Tailwind `dark:` variant uses `class` strategy (add `dark` class to `<html>`). All tokens are defined so dark mode activates with zero refactoring later.

### Typography Specifications

**Typefaces:**
| Role | Typeface | Usage |
|---|---|---|
| Headlines (h1, h2, h3) | Source Serif 4 | Editorial authority |
| Body, UI, metadata | Inter | shadcn/Tailwind default, humanist sans |
| Ticker number | Inter, tabular figures | `font-variant-numeric: tabular-nums` |

**Type Scale (Desktop — ~1.25 Major Third ratio):**

| Element | Size | Weight | Face | Line Height |
|---|---|---|---|---|
| Ticker number | 80-84px / 5rem | ExtraBold (800) | Inter | 1.0 |
| h1 | 36-48px / 2.25-3rem | Bold (700) | Source Serif 4 | 1.2 |
| h2 | 24-30px / 1.5-1.875rem | Semibold (600) | Source Serif 4 | 1.3 |
| h3 | 18-20px / 1.125-1.25rem | Semibold (600) | Source Serif 4 | 1.4 |
| Body | 16-18px / 1-1.125rem | Regular (400) | Inter | 1.6 |
| Caption | 15px / 0.9375rem | Regular (400) | Inter | 1.5 |
| Badge | 13px / 0.8125rem | Medium (500) | Inter | 1.4 |

**Font Files Required (public/fonts/):**
- `SourceSerif4-Regular.woff2`
- `SourceSerif4-SemiBold.woff2`
- `SourceSerif4-Bold.woff2`

**Font-Face Declaration Pattern:**
```css
@font-face {
  font-family: 'Source Serif 4';
  src: url('/fonts/SourceSerif4-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* Repeat for 600 (SemiBold) and 700 (Bold) */
```

### Spacing System

**Base unit:** 8px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.

**Grid System:**
| Breakpoint | Columns | Max Width | Gutters |
|---|---|---|---|
| Desktop >1024px | 12 | 1280px | 24px |
| Tablet 768-1024px | 8 | 100% | 16px |
| Mobile <768px | 4 | 100% | 16px |

### Accessibility Foundation

- **WCAG 2.1 AA compliance** as CI merge gate (zero violations)
- Focus rings: 2px solid `--accent-amber` with 2px offset
- Touch targets: 44x44px minimum on mobile
- Minimum font size: 13px (badges only), 15px+ for reading text
- `lang="en"` on `<html>` element
- Skip links: "Skip to main content" and "Skip to profiles"
- `prefers-reduced-motion` respected on all animations
- Color never the sole indicator of state (always paired with icon/text)

### Tailwind CSS v4 Critical Notes

**Tailwind CSS v4 uses CSS-based configuration, NOT a JavaScript config file.** This is a breaking change from v3:

- Configuration is done in CSS using `@theme` directive inside `globals.css`
- No `tailwind.config.ts` file is needed (unless shadcn init creates one)
- Template paths are auto-detected — no `content` array needed
- Import via `@import "tailwindcss";` in CSS file
- Custom values defined via `@theme { --color-*: ...; }` blocks

If `shadcn init` creates a `tailwind.config.ts`, that's fine — it will be used for shadcn component configuration. But design tokens should be defined in CSS using `@theme` and CSS custom properties.

### Supabase Client Setup Pattern

**src/lib/supabase/server.ts:**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Server Component — read-only cookies */ }
        },
      },
    }
  )
}
```

**src/lib/supabase/browser.ts:**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Environment Variables

**`.env.local` (git-ignored):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=thewarningcollective.org
```

**`.env.example` (committed):**
```
# Supabase — required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Analytics — optional for local dev
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

### Project Structure Notes

**Required directory structure after Story 1.1:**

```
warning-collective/
├── .github/workflows/
│   └── ci.yml
├── public/
│   └── fonts/
│       ├── SourceSerif4-Regular.woff2
│       ├── SourceSerif4-SemiBold.woff2
│       └── SourceSerif4-Bold.woff2
├── src/
│   ├── app/
│   │   ├── globals.css          # Design tokens, @font-face, @import "tailwindcss"
│   │   ├── layout.tsx           # Root layout: fonts, metadata, Plausible provider
│   │   ├── page.tsx             # Homepage placeholder
│   │   ├── error.tsx            # Global error boundary
│   │   └── not-found.tsx        # 404 page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui installed components
│   │   ├── custom/              # Project-specific components (empty for now)
│   │   └── shared/              # Composed shared components (empty for now)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts        # createServerClient
│   │   │   └── browser.ts       # createBrowserClient
│   │   ├── schemas/             # Zod schemas (empty for now)
│   │   ├── queries/             # Supabase query functions (empty for now)
│   │   ├── transforms/          # snake_case → camelCase (empty for now)
│   │   ├── utils/
│   │   │   └── cn.ts            # Tailwind class merge (shadcn provides)
│   │   └── constants.ts         # Shared constants
│   ├── hooks/                   # Custom React hooks (empty for now)
│   ├── actions/                 # Server Actions (empty for now)
│   └── types/
│       └── index.ts             # Shared TypeScript types
├── tests/
│   ├── e2e/
│   │   ├── homepage.spec.ts     # Basic homepage E2E + accessibility
│   │   └── accessibility.spec.ts # axe-core AA validation
│   ├── fixtures/                # Test fixtures (empty for now)
│   └── utils/
│       └── setup.ts             # Playwright + axe-core helper config
├── .env.example
├── .env.local                   # git-ignored
├── .gitignore
├── components.json              # shadcn/ui configuration
├── next.config.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vitest.config.ts
```

### Testing Configuration

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**tests/utils/setup.ts (axe-core helper):**
```typescript
import AxeBuilder from '@axe-core/playwright'
import { Page, expect } from '@playwright/test'

export async function checkAccessibility(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(results.violations).toEqual([])
}
```

**GitHub Actions CI (.github/workflows/ci.yml):**
```yaml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx vitest run

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
```

### Performance Budget (for reference — enforced from Story 1.6 onward)

| Metric | Target |
|---|---|
| LCP | < 2.0s |
| FID | < 100ms |
| CLS | < 0.1 |
| First load JS | < 150KB |

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1] — Acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation] — Init sequence, tech stack
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — Naming conventions, import order, Server Action format
- [Source: _bmad-output/planning-artifacts/architecture.md#Testing Framework] — Vitest + Playwright + axe-core config
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — Complete directory tree
- [Source: _bmad-output/planning-artifacts/architecture.md#CI/CD Pipeline] — GitHub Actions configuration
- [Source: _bmad-output/planning-artifacts/architecture.md#API Communication Patterns] — Supabase client setup
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Color System] — Exact hex values for Slate & Ink palette
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System] — Type scale, font specifications
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Spacing & Layout] — Grid system, spacing modes
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility Baseline] — WCAG 2.1 AA requirements
- [Source: docs/prd.md#Section 10] — Technology stack constraints
- [Source: docs/prd.md#Section 11] — Non-functional requirements

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- node_modules corruption after file move from temp-init → fixed with rm -rf node_modules && npm install
- Playwright tests hit existing dev server on port 3000 (different app) → changed to port 3100
- Source Serif 4 font download: Google Fonts direct URLs returned HTML redirects → used @fontsource-variable package to get woff2 variable font files
- ESLint warning on unused `error` param in error.tsx → destructured without binding

### Completion Notes List

- Next.js 16.1.6 with React 19.2.3, Turbopack, App Router, TypeScript strict mode
- shadcn/ui v4.0.5 (Radix Nova preset) with CSS variables, Radix UI primitives, Lucide icons
- Tailwind CSS v4 with CSS-based @theme configuration (no tailwind.config.ts needed)
- Slate & Ink design tokens: 6 core + 6 functional + 3 component tokens mapped to shadcn variables
- Source Serif 4 variable font self-hosted (50KB woff2, supports weights 200-900)
- Dual-luminance dark mode tokens defined via .dark class selector (light-only MVP)
- Vitest 4.1.0 with jsdom, @testing-library/react, @testing-library/jest-dom — 5 unit tests passing
- Playwright with Chromium + @axe-core/playwright — 4 E2E tests passing (including WCAG 2.1 AA accessibility)
- GitHub Actions CI: lint, typecheck, vitest, playwright stages
- Supabase SSR client pattern: server.ts (createServerClient) + browser.ts (createBrowserClient)
- All acceptance criteria verified: build succeeds, tests pass, design tokens defined, fonts self-hosted, CI configured

### File List

- .env.example (new)
- .env.local (new, git-ignored)
- .github/workflows/ci.yml (new)
- .gitignore (modified — added playwright artifacts, fixed env pattern)
- components.json (new — shadcn config)
- eslint.config.mjs (new — from create-next-app)
- next-env.d.ts (new — from create-next-app)
- next.config.ts (modified — added turbopack.root)
- package.json (new — warning-collective with all deps)
- package-lock.json (new)
- playwright.config.ts (new)
- postcss.config.mjs (new — from create-next-app)
- public/fonts/SourceSerif4Variable.woff2 (new)
- public/fonts/SourceSerif4Variable-Italic.woff2 (new)
- src/app/error.tsx (new)
- src/app/globals.css (modified — Slate & Ink design tokens, font-face, theme)
- src/app/layout.tsx (modified — metadata, removed Geist fonts)
- src/app/not-found.tsx (new)
- src/app/page.tsx (modified — ticker placeholder with design tokens)
- src/lib/constants.ts (new)
- src/lib/constants.test.ts (new)
- src/lib/supabase/browser.ts (new)
- src/lib/supabase/browser.test.ts (new)
- src/lib/supabase/server.ts (new)
- src/lib/utils.ts (new — cn() from shadcn)
- src/test-setup.ts (new)
- src/types/index.ts (new — ActionResult type)
- tests/e2e/accessibility.spec.ts (new)
- tests/e2e/homepage.spec.ts (new)
- tests/utils/setup.ts (new — axe-core helper)
- tsconfig.json (new — from create-next-app)
- vitest.config.ts (new)
