---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
lastStep: 14
status: complete
inputDocuments: ['docs/prd.md', 'docs/prd-validation-report.md']
---

# UX Design Specification — The Warning Collective

**Author:** Jax
**Date:** 2026-03-12

---

## Executive Summary

### Project Vision

The Warning Collective is a real-time intelligence platform that makes the collective pattern of safety-motivated departures from major AI companies visible, verifiable, and actionable. The UX must serve three distinct audiences — cautious insiders seeking social proof, journalists/policymakers seeking structured evidence, and the general public seeking to understand the scale of concern — through a single interface that prioritizes browse-and-discover with insider-gated engagement in the MVP phase.

### Target Users

| Audience | Behavior Model | UX Priority |
|---|---|---|
| **Insiders on the fence** | Anonymous, cautious browsing. Looking for social proof. May self-identify to vote on predictions. | Trust signals, zero-friction access, no accounts. Insider voting as a safe, anonymous form of participation. |
| **Journalists & policymakers** | Power-user research. Filtering, exporting, citing. Need structured data and insider sentiment data. | Filtering, permalinks, CSV/JSON export, source visibility, insider vote percentages as citeable statistics. |
| **General public** | Arrive via social share. Need to grasp scale instantly. | Ticker impact, shareable moments, low cognitive load. Can view but not vote on predictions. |

### Key Design Challenges

1. **Two interaction paradigms on one site** — immersive editorial experience for general public vs. structured database tooling for journalists/policymakers. Navigation and IA must serve both without compromise.
2. **Trust under anonymity** — insider-gated voting and the Anonymous Signal feature (V2) require the UX itself to communicate privacy guarantees credibly. One "this feels sketchy" moment loses the insider audience.
3. **Retention without login** — no user accounts means no persistent state. Return visitors need continuity cues without authentication — especially those who voted on predictions and want to see outcomes.
4. **Quiet period resilience** — the site must feel alive even during weeks without new departures. Prediction spotlights, synthesis updates, and "what happened after" content need prominent placement.

### Design Opportunities

1. **Ticker as signature element** — an iconic, animated counter that becomes the site's visual identity and the thing people screenshot and share. Branding disguised as UI.
2. **Insider voting as differentiator** — "82% of AI industry professionals think this will happen" is a press-ready statistic nobody else has. The voting gate makes the data meaningful and positions the site as built *for* insiders, not just about them.
3. **Source-first credibility design** — inline citations, hover previews, one-click verification on every claim. A new standard for how editorial credibility looks on the web.
4. **Cross-linked intelligence** — two-level taxonomy (broad category + specific proposal) with progressive disclosure. Profile-level "calls for change" link to aggregate synthesis. The cross-linking turns a database into actionable intelligence.

### MVP UX Strategy

The MVP is a **reference tool with insider engagement.** The primary interaction model is browse-and-discover — filtering, searching, sharing. The single interactive feature is insider-gated prediction voting, which doubles as a signal (expert sentiment) and a retention hook (return to see outcomes).

**MVP feature priority:**
1. Momentum Ticker — emotional hook (how many, how fast, how senior)
2. Profiles + filtering — the evidence (who, from where, why, what they called for)
3. Predictions display with insider-gated voting — the track record + expert sentiment
4. Calls for change (profile-level + aggregated with cross-linking) — the actionable message
5. Journalist tooling — permalinks, export, press page
6. Editorial transparency — about, standards, corrections, advisory board

**Deferred to V2:** Fan letters, kudos, discussion threads, anonymous signal, community layer, prediction trend charts, credibility index.

**Phase 1 deliverable identified:** Editorial tagging guide covering two-level taxonomy (8 broad categories + open-ended specific proposal tags) — required before content seeding begins.

## Core User Experience

### Defining Experience

The core experience is the **ticker-to-profile drill-down arc:** see the number (scale) → browse the people (evidence) → read their words (substance) → see what they called for (action) → check if their predictions came true (track record). This arc is the product. Every page, every feature, and every interaction serves or extends it.

The single most critical moment is the **homepage landing (0-10 seconds):** the ticker conveys scale, credibility signals are immediately visible, and the visitor decides this site is real and worth exploring. Everything downstream depends on this moment succeeding.

The most frequent user action is **profile browsing and filtering.** All three audiences do this — insiders filter by company, journalists filter by date and concern, the public browses to feel the weight. Filtering must be visible, immediate, and require zero learning curve.

### Platform Strategy

| Dimension | Decision |
|---|---|
| Platform | Web-only, responsive. No native apps. |
| Primary input | Desktop: mouse/keyboard. Mobile: touch. |
| Design priority | Desktop-first for journalist workflows (filtering, exporting, permalinks). Mobile-optimized for social-share arrivals (ticker, profiles, voting). |
| Offline | Not required — live data site, always connected. |
| Device capabilities | Dynamic OG images for social sharing, responsive ticker animation, copy-to-clipboard for permalinks and citations. |

### Effortless Interactions

1. **Grasping the scale** — ticker communicates without user action. Land, see, understand.
2. **Filtering to what matters** — filters visible on profiles page, not buried. Company/year/concern/seniority accessible immediately.
3. **Verifying a claim** — inline source links on every quote. Hover or tap to preview original without leaving the page.
4. **Sharing a finding** — pre-populated share text, dynamic OG images, stable permalinks. Zero composition effort.
5. **Voting on a prediction** — single tap for insiders, one-time self-ID gate, immediate community split display.

### Critical Success Moments

1. **Homepage landing (0-10s)** — ticker + credibility signals. Visitor decides "this is real." Failure = bounce.
2. **First profile read (30-60s)** — sourced quotes, linked claims, rigorous treatment. Visitor decides "this is credible." Failure = trust collapse.
3. **The "oh, there are more" moment** — filtering reveals the pattern across companies and years. Visitor shifts from "individual story" to "collective alarm." Failure = site feels small.
4. **The insider vote** — self-identification gate feels safe, private, and meaningful. Failure = core audience lost.
5. **The journalist export** — filter → export → permalink in under 60 seconds. Failure = site loses utility as reference tool.

### Experience Principles

1. **Comprehension before interaction** — understand the site's purpose before being asked to act. Content-first, controls second.
2. **Every claim is one click from its source** — verification is effortless, not aspirational. Credibility is the product.
3. **The pattern is the point** — aggregate context is always visible alongside individual stories. Numbers, filters, cross-links.
4. **Trust is designed, not declared** — privacy and editorial rigor are felt in the interaction, not just stated on policy pages.
5. **Journalists are power users, not afterthoughts** — export, permalinks, filtering, and citations are first-class features.

## Desired Emotional Response

### Primary Emotional Goals

| Audience | Primary Emotion | Secondary Emotion |
|---|---|---|
| Insiders on the fence | "I'm not alone" — relief, solidarity | "It's possible to do this" — courage, permission |
| Journalists & policymakers | "This is credible and citeable" — confidence, authority | "This saves me hours" — efficiency, gratitude |
| General public | "Something serious is happening" — gravity, urgency | "These are real people saying this" — respect, weight |

### Emotional Journey Mapping

| Stage | Target Feeling | Design Driver |
|---|---|---|
| Homepage landing | Gravity + curiosity | Ticker scale, clean design, white space |
| Profile browsing | Growing weight — "there are so many" | Progressive filtering reveals the pattern |
| Reading a profile | Respect for the individual | Sourced quotes, career timeline, human detail |
| Seeing "calls for change" | Agency — "there's something to do with this" | Specific proposals, not vague concern |
| Predictions display | Intellectual engagement | Track record data, insider sentiment percentages |
| Insider vote | Trust + meaningful participation | Privacy disclosure, warm gate copy, immediate feedback |
| Sharing | "People need to see this" | Pre-populated text, dynamic OG images at emotional peaks |

### Micro-Emotions

**Critical axes (in priority order):**
1. **Trust over skepticism** — every design choice either builds or erodes it. The most important emotional axis.
2. **Gravity over sensationalism** — serious without being manipulative. Numbers speak, not alarm bells.
3. **Belonging over isolation** — the ticker count is a solidarity signal for insiders. The site's existence is the permission.
4. **Confidence over confusion** — structured, reliable, exportable data for the journalist audience.
5. **Agency over helplessness** — specific calls for change and tracked predictions pair concern with action.

### Design Implications

| Emotional Goal | Design Choice |
|---|---|
| Gravity without sensationalism | Muted, serious color palette. No red/orange alert colors. Typography-driven — large numbers, clean typeface, generous white space. |
| Trust over skepticism | Source links as first-class UI elements. Editorial standards in global nav. Advisory board visible on homepage. |
| "I'm not alone" | Ticker count is the solidarity signal. No "join us" CTAs. Content is the invitation. |
| Confidence (journalists) | Structured tables, sortable columns, prominent export buttons, visible permalink URLs. |
| Agency over helplessness | "Calls for change" as specific proposals linked to named researchers. Every page ends with a forward-looking element. |
| Meaningful participation | Warm insider gate copy. Immediate visual feedback after voting. No bureaucratic forms. |
| "People need to see this" | Share buttons at emotional peak moments — post-ticker, post-profile, post-resolution — not in a generic toolbar. |

### Emotional Design Principles

1. **Let the numbers speak** — no animation beyond the ticker increment. No "urgent" badges, countdown timers, or alarm iconography. The data is alarming enough.
2. **Pair every concern with agency** — departures are always accompanied by "calls for change" and tracked predictions. The site does not create despair.
3. **Transparency is an emotion** — open editorial stance, visible methodology, source links on every claim. Transparency creates trust, and trust is the core emotional experience.
4. **Progressive weight, not information overload** — show the count first, then the list, then the individual. Never dump content without filtering context. Let the visitor control the depth.
5. **No dark patterns, ever** — no manipulative copy on voting, sharing, or email signup. The site's credibility depends on feeling honest at every interaction point.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**The Pudding** (pudding.cool)
Data-driven visual storytelling. Relevant for: how to make a single number carry the emotional weight of an entire section. Progressive scroll-driven reveals, large typography, one stat per viewport. The ticker should channel this energy — "73 researchers" as a 200px headline with nothing else competing.

**The Marshall Project** (themarshallproject.org)
Nonprofit investigative journalism with dual-audience design (general public + professional reporters). Relevant for: muted color palette, typography-driven hierarchy, visible editorial methodology. Their About and Ethics pages are models for institutional credibility in a trust-dependent context. Closest tonal comp for the overall site.

**AI Incident Database** (incidentdatabase.ai)
Closest structural comp — tracks AI harms with faceted filtering by company, date, severity. Relevant for: filtering architecture and data structure patterns. Anti-model for: emotional design. Their clinical/spreadsheet presentation is exactly what we must avoid. Same data architecture, opposite emotional treatment.

**Gun Violence Archive** (gunviolencearchive.org)
Real-time counter as first-impression device, running for years. Relevant for: the ticker pattern works as a first-impression mechanism — proven at scale. Their weakness is our opportunity: they stop at the number. We drill down to the people behind it.

**Algolia Instant Search Pattern**
Real-time faceted filtering with URL-as-permalink. No submit button, no page reloads. Toggle a filter, results update instantly, URL updates with every change. Relevant for: journalist filtering UX. Journalists already expect this behavior from tools like Airtable. Works with Supabase full-text search.

**Polymarket Prediction Display**
Binary sentiment bar with participant count and resolution status. Clean, minimal, scannable. Relevant for: insider-gated prediction voting display — but with human voice (researcher quote) prioritized over market data. Our hierarchy: quote first, insider sentiment second, outcome third.

**Wikipedia Source Previews**
Hover on a citation, get a tooltip preview without leaving the page. Relevant for: "zero-click verification" — upgrade from our "one click from source" principle. Fetch and cache OG metadata for linked sources. Tap-to-open on mobile. The detail that makes journalists think "this was built for me."

### Transferable UX Patterns

**Navigation Patterns:**
- Algolia-style instant faceted filtering with URL-as-permalink for profile discovery
- Progressive disclosure hierarchy: ticker (headline) → profile list (browse) → individual profile (deep read)
- Two-level taxonomy navigation: broad category → specific proposal tags

**Interaction Patterns:**
- Pudding-style data reveal — one stat per viewport, let numbers breathe before asking for interaction
- Polymarket-style binary voting bar adapted for insider-gated predictions
- Wikipedia-style hover previews for source verification
- Copy-to-clipboard on permalinks and citations with visual confirmation

**Visual Patterns:**
- Marshall Project muted palette and typography hierarchy for gravity without sensationalism
- Gun Violence Archive counter-as-hero-element for the ticker
- Pudding white space discipline — resist the urge to fill the viewport

### Anti-Patterns to Avoid

1. **The clinical database** (AI Incident Database) — flat data presentation with no emotional hierarchy. All data treated equally. No sense that something important is happening.
2. **Scroll-jacking** (some Pudding pieces) — hijacking scroll behavior for animation. Our content is too important to gate behind scroll tricks. Let users control their pace.
3. **Transactional voting UI** (Polymarket) — market-style interface that feels like trading, not participating. Our predictions need the researcher's voice first, not the betting line.
4. **Hidden methodology** (most news sites) — editorial standards buried in footer links nobody clicks. Our methodology must be in the global nav, not the fine print.
5. **Login walls for basic actions** — any site that requires an account before you can see content, filter, or export. Our power-user features (export, permalink, filtering) must be zero-friction.
6. **Notification spam opt-in** (most media sites) — aggressive email signup modals on first visit. Journalist notification signup should be prominent but never interruptive.

### Design Inspiration Strategy

**Adopt directly:**
- Algolia instant filtering with URL-as-permalink (journalist tooling)
- Counter-as-hero-element (ticker)
- Wikipedia hover source previews (credibility design)
- Binary sentiment bar for predictions (adapted for insider gate)

**Adapt for our context:**
- Pudding data storytelling → ticker and homepage emotional arc (without scroll-jacking)
- Marshall Project editorial credibility pages → About, Editorial Standards, Corrections (with advisory board addition)
- Polymarket prediction display → reorder hierarchy to human voice first, data second

**Reject explicitly:**
- AI Incident Database clinical flat-list presentation
- Any login requirement for core features
- Aggressive notification/email modals
- Over-animation beyond ticker increment

## Design System Foundation

### Design System Choice

**Tailwind CSS + shadcn/ui** (built on Radix UI primitives) + **TanStack Table** for data grid functionality.

A copy-paste component system that provides accessible, unstyled primitives with full visual ownership. Components live in the codebase, not in node_modules. The value is in the accessibility primitives (Radix UI), not the components themselves — keyboard navigation, focus trapping, screen reader announcements, and ARIA attributes solved at the foundation level.

### Rationale for Selection

| Factor | Decision Driver |
|---|---|
| Visual uniqueness | Site must feel like a publication, not a SaaS dashboard. shadcn imposes no visual language. |
| Stack alignment | Tailwind-native. Zero integration friction with Next.js + Tailwind CSS from PRD. |
| Accessibility | Radix UI primitives provide WCAG 2.1 AA keyboard navigation, focus management, and screen reader support out of the box. |
| Ownership | Copy-paste model means components are in the codebase. No dependency lock-in. |
| Data grid | TanStack Table handles sorting, filtering, pagination, and CSV/JSON export for journalist tooling. Styled with shadcn Table visuals. |
| Community | shadcn/ui is the most widely adopted Tailwind component approach (2026). Excellent Next.js documentation. |

### Implementation Approach

**Token-first sequence (non-negotiable):**
1. Typography audit — select headline typeface (serif or display), body typeface (humanist sans), data typeface (monospace accent). Override shadcn defaults before any component work.
2. Color palette tokens — muted, serious palette with AA-compliant contrast ratios. Semantic token names (`bg-surface`, `text-primary`) not hardcoded values.
3. Dark mode architecture — build dual-mode token system with Tailwind `dark:` variant from day one. Ship light-only MVP. Flip dark mode on when palette is designed. Zero refactoring.
4. Spacing and layout tokens — responsive grid, whitespace rhythm.
5. *Then* begin component installation and customization.

**Core dependencies:**
- **shadcn/ui** — Button, Dialog, DropdownMenu, Popover, Tooltip, Table, Badge, Card
- **Radix UI** — accessibility primitives underneath shadcn
- **TanStack Table** — data grid engine for profile filtering, sorting, pagination, journalist export

**Filtering strategy:**
- MVP (40-60 profiles): TanStack Table client-side filtering. Local dataset, instant response, zero loading states.
- Scale migration (500+ profiles): Evaluate Algolia or Supabase full-text search with API-driven filtering, skeleton loaders, debouncing.

**Maintenance protocol:**
- Pin Radix UI versions in package.json
- Quarterly accessibility audit: check for Radix updates, apply fixes to owned components
- shadcn components are owned code — manual review required for updates

### Responsive Strategy

**Breakpoints:**
- Mobile: <768px
- Tablet: 768–1024px
- Desktop: >1024px

**Layout behavior by breakpoint:**

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Ticker | Full-width hero, 25-30% viewport | Full-width hero | Full-width hero |
| Navigation | Hamburger menu, minimal top bar | Hamburger or horizontal nav | Full horizontal nav with Editorial Standards visible |
| Profile cards | Single column, card view default | 2-column grid | 3-column grid or list view toggle |
| Filter panel | Slide-out drawer (hidden by default) | Collapsible sidebar | Persistent left sidebar |
| Prediction voting | Full-width bar | Full-width bar | Inline with prediction card |
| Export controls | Hidden in menu | Visible | Fully visible toolbar |
| Trust signal | Advisory board member name near ticker | Advisory board near ticker | Full advisory board in nav/about link |

**Mobile above-the-fold composition (exactly three elements):**
1. The number — huge, dominant, unmissable
2. One line of context — the explainer sentence, max 2 lines
3. Scroll affordance — subtle cue or partial profile card peeking from below

No nav bar above the fold on mobile. No share button. No clutter.

### Customization Strategy

**Why token-first matters:** This site's credibility depends on visual authority from day one. Default Inter with generic blue links will not be taken seriously by journalists. Typography and color are not polish — they are the product.

**Dark mode as trust signal:** For the insider audience, dark mode communicates "we thought about people browsing cautiously." Semantic tokens from day one enable this with zero refactoring.

**Custom component priority:**
1. **Ticker** — fully custom, animated, responsive. Three states: static (first visit), delta badge via localStorage (return visit: "+2 since last visit"), slot-machine digit roll (rare live update)
2. **Profile Card** — custom layout using shadcn Card as base, with sourced quotes, taxonomy tags, timeline, "what they called for" section
3. **Prediction Voting Bar** — custom binary bar with insider gate. shadcn Popover for privacy disclosure. Hierarchy: researcher quote first, insider sentiment bar second, resolution status third.
4. **Filter Panel** — TanStack Table + shadcn DropdownMenu + Badge for Algolia-style instant faceted filtering with URL-as-permalink
5. **Source Preview Tooltip** — shadcn Popover + cached OG metadata for Wikipedia-style hover preview. Tap-to-open on mobile.
6. **Export Controls** — TanStack Table export to CSV/JSON with shadcn Button and DropdownMenu

**localStorage return-visit features:**
- Store last-seen ticker count. Show delta badge on return ("+2 since [date]").
- Partial solution to "retention without login" challenge.
- Serves as journalist news hook — "2 new departures this week" drives return visits.

## Defining Experience

### Core Experience Statement

**"See the number. Understand the people behind it."**

The Warning Collective's defining experience is the moment a visitor transitions from seeing a statistic to understanding it represents real people making consequential career decisions for safety reasons. The ticker is the hook; the profiles are the substance; the cross-linked intelligence (predictions, calls for change, track records) is what makes it a platform, not just a list.

### Mental Model

**The memorial wall** — visitors approach this site the way they approach a memorial. The number at the top establishes scale. Then you walk closer and read individual names, stories, and reasons. The experience is cumulative — each profile adds weight to the whole. The site respects this by never rushing the visitor past the individual to get to the aggregate.

### User Mental Models by Audience

| Audience | Mental Model | Design Implication |
|---|---|---|
| Insiders on the fence | "A wall of people like me who already did it" | Emphasize career similarity, company overlap, seniority level. The insider sees themselves in the profiles. |
| Journalists & policymakers | "A structured evidence database with expert sentiment" | Emphasize filtering, source verification, insider vote percentages, export. The journalist sees a research tool. |
| General public | "A running count of something important happening" | Emphasize the ticker, the trend, the human stories. The public sees a news story unfolding. |

### Experience Success Criteria

1. **The 10-second test** — a first-time visitor understands what this site is and why it matters within 10 seconds of landing (ticker + one-line context + credibility signal).
2. **The "oh, there are more" moment** — within 60 seconds, filtering or scrolling reveals the pattern is broader than expected. This is the conversion moment from curiosity to engagement.
3. **The source check** — a skeptical journalist can verify any claim on the site within one click. Zero-click via hover preview is the stretch goal.
4. **The insider vote** — a self-identified AI professional can vote on a prediction in under 15 seconds, including the privacy disclosure gate.
5. **The share moment** — at any emotional peak (post-ticker, post-profile, post-resolution), sharing requires exactly one tap with pre-populated, accurate text.

### Pattern Analysis

| Pattern | Novel or Established | Risk Level | Mitigation |
|---|---|---|---|
| Real-time counter as hero | Established (Gun Violence Archive, COVID trackers) | Low | Proven at scale. Our innovation is the drill-down to people behind the number. |
| Faceted instant filtering | Established (Algolia, Airtable, e-commerce) | Low | Well-understood UX. TanStack Table handles it cleanly. |
| Source hover previews | Established (Wikipedia) | Low | OG metadata caching. Graceful fallback to direct link if preview unavailable. |
| Insider-gated voting | **Novel** | Medium | No direct precedent for honor-system professional gating on a public site. Requires clear, warm copy and visible privacy guarantees. Pilot with advisory board before launch. |
| Two-level taxonomy cross-linking | Adapted (tag systems + Wikipedia cross-references) | Low-Medium | Familiar tagging UX, but the cross-linking between profiles and aggregate views is custom. Requires clear visual affordances for "see all profiles with this tag." |
| localStorage return-visit detection | Established (many sites) | Low | Well-understood pattern. Clear fallback (no delta badge) if storage is cleared. |

### Experience Mechanics

**Phase 1: Initiation (0-10 seconds)**
- Ticker loads immediately (SSR, no layout shift)
- One-line context sentence below the ticker
- Advisory board trust signal visible without scrolling
- Scroll affordance hints at content below
- No interruptive modals, popups, or CTAs

**Phase 2: Exploration (10-60 seconds)**
- Profile cards visible on scroll or via "Explore profiles" entry point
- Filters visible and labeled — no hidden panel on desktop
- First filter interaction produces instant results (client-side, no loading state)
- Each profile card shows: name, company, role, year, primary concern category, one-line quote
- "Calls for change" tags visible on profile cards as clickable badges

**Phase 3: Engagement (60+ seconds)**
- Full profile view: sourced quotes, career timeline, predictions with insider sentiment, calls for change with cross-links
- Prediction voting available for self-identified insiders (one-time gate, persisted in localStorage)
- Source hover previews on all citations
- Share buttons appear at emotional peaks within profiles, not in a global toolbar
- Aggregate views accessible via taxonomy tag clicks ("See all 12 researchers calling for X")

**Phase 4: Return & Retention**
- localStorage delta badge on ticker ("+3 since March 1")
- New profiles highlighted with "New" badge for return visitors
- Prediction resolution updates surfaced prominently
- Journalist email notification signup (non-interruptive, in editorial tools section)

## Visual Design Foundation

### Color System

**Palette: Slate & Ink**

Selected for gravity, trust, and memorability. Reads as serious publication — safe for insider browsing, credible for journalists, weighty for the general public.

**Core palette:**

| Token | Value | Role |
|---|---|---|
| `--surface-primary` | `#fafaf9` (warm off-white) | Page background |
| `--surface-secondary` | `#f5f5f4` (stone-50) | Card backgrounds, table row stripe |
| `--text-primary` | `#1e293b` (slate-800) | Headlines, body text |
| `--text-secondary` | `#78716c` (stone-500) | Metadata, captions, secondary text |
| `--text-inverse` | `#fafaf9` | Text on dark surfaces (ticker block) |
| `--surface-inverse` | `#1e293b` | Ticker block background, dark containers |

**Functional color set (6 roles):**

| Token | Light Value | Dark Value | Role |
|---|---|---|---|
| `--accent-amber` | `#b45309` | `#d97706` | Primary interactive — buttons, active filters, badges |
| `--state-hover` | `#44403c` (slate-warm) | `#57534e` | Hover/pressed states — darken surface, not accent |
| `--state-disabled` | `#d6d3d1` (stone-light) | `#78716c` | Disabled/inactive elements |
| `--status-verified` | `#065f46` (emerald-muted) | `#059669` | Resolved predictions, verified claims |
| `--status-error` | `#9f1239` (rose-muted) | `#e11d48` | Error states, disproven predictions |
| `--accent-info` | `#1e40af` (blue-muted) | `#3b82f6` | Informational, links (distinct from amber) |

All values meet WCAG 2.1 AA contrast ratios (4.5:1 body text, 3:1 large text). Dual-luminance tokens defined at setup for dark mode readiness — ship light-only MVP, flip dark mode on with zero refactoring.

**Design rationale:**
- Green accent rejected — carries "success/money/go" connotation, wrong for departure-focused content. Emerald-muted reserved exclusively for "prediction verified" status.
- Single amber accent expanded to 6-role system after pre-mortem analysis revealed state starvation risk.
- Warm off-white surface (not pure white) prevents clinical feel and reduces eye strain for journalist long-session use.

### Typography System

**Typeface selections:**

| Role | Typeface | Rationale |
|---|---|---|
| Headlines | **Source Serif 4** | Editorial authority, institutional trust. Excellent at display sizes. Widely used by publications journalists already respect. |
| Body | **Inter** | Tailwind/shadcn default. Humanist sans, exceptional readability, disappears (in a good way). Tabular figures built in. |
| Ticker number | **Inter, tabular figures** | `font-variant-numeric: tabular-nums` prevents digit shift during animation. Size and weight do the work. |

**Type scale (desktop):**

| Element | Size | Weight | Typeface | Line Height |
|---|---|---|---|---|
| Ticker number | 80-84px / 5-5.25rem | ExtraBold (800) | Inter tabular | 1.0 |
| Page headline (h1) | 36-48px / 2.25-3rem | Bold (700) | Source Serif 4 | 1.2 |
| Section headline (h2) | 24-30px / 1.5-1.875rem | Semibold (600) | Source Serif 4 | 1.3 |
| Card title (h3) | 18-20px / 1.125-1.25rem | Semibold (600) | Source Serif 4 | 1.4 |
| Body text | 16-18px / 1-1.125rem | Regular (400) | Inter | 1.6 |
| Caption / metadata | 15px / 0.9375rem | Regular (400) | Inter | 1.5 |
| Badge / tag | 13px / 0.8125rem | Medium (500) | Inter | 1.4 |

Scale ratio: ~1.25 (Major Third) — measured, not dramatic. Minimum rendered size: 13px (badges only). All reading text 15px+.

**Ticker weight rationale:** 800 (ExtraBold) chosen over 700 (Bold) after pre-mortem analysis — heavier weight survives social media screenshot compression. The ticker number must be legible in a 400px Twitter card image.

### Spacing & Layout Foundation

**Base unit:** 8px — scales cleanly to 4, 8, 12, 16, 24, 32, 48, 64, 96.

**Grid system:**

| Breakpoint | Columns | Max Width | Gutters |
|---|---|---|---|
| Desktop (>1024px) | 12 | 1280px | 24px |
| Tablet (768-1024px) | 8 | 100% | 16px |
| Mobile (<768px) | 4 | 100% | 16px |

**Spacing modes (two systems, one palette):**

*Editorial mode* — for homepage, profile pages, about pages:
- Section separation: 64px minimum
- Ticker breathing room: 96px vertical
- Card internal padding: 24px
- Element spacing within cards: 16px

*Compact mode* — for data table/list views (journalist filtering):
- Row padding: 12px vertical
- Row striping: alternating `--surface-primary` / `--surface-secondary`
- Column gutters: 16px
- Active sort column header highlighted with `--accent-amber`
- Denser information without sacrificing scanability

**Whitespace principles:**
1. Sections separated by 64px minimum — the eye rests between ideas
2. Cards get 24px internal padding — content doesn't touch edges
3. Ticker gets 96px vertical breathing room — it's a monument, not a widget
4. Filter panel has 16px separation from results — connected but distinct
5. Data tables use compact mode — editorial spacing doesn't serve scanning

### Visual Signature

**The dark inverted ticker block** — the site's ownable visual moment.

- Container: `--surface-inverse` (`#1e293b` slate) background, full-width
- Number: `--text-inverse` (`#fafaf9`), 80-84px, Inter ExtraBold (800), tabular figures
- Context line: `--text-inverse` at reduced opacity (0.8), 16px Inter
- Result: a bold dark rectangle with a white number that is instantly recognizable in screenshots, social shares, and browser tabs

This solves two pre-mortem failures simultaneously: brand memorability (the dark block is ownable — no other site in this space uses it) and screenshot resilience (high contrast survives compression).

### Accessibility Baseline

- All text meets WCAG 2.1 AA contrast ratios — verified per palette token
- Focus rings: 2px solid `--accent-amber` with 2px offset
- Touch targets: 44x44px minimum on mobile
- Font sizes: 13px minimum (badges only), 15px+ for all reading text
- Semantic color tokens ensure dark mode maintains contrast automatically
- Reduced motion: ticker animation respects `prefers-reduced-motion` — shows static number with no roll effect
- Color is never the sole indicator of state — always paired with icon, text, or position change
- Row striping in compact mode uses subtle value shift, not color-dependent

## Design Direction Decision

### Directions Explored

Four design directions were generated as an interactive HTML showcase (`_bmad-output/planning-artifacts/ux-design-directions.html`):

- **A (The Monument):** Full-viewport ticker hero, 3-column card grid below. Maximum emotional impact for general public and social shares. Risk: journalists must scroll to reach tools.
- **B (The Newsroom):** Split-screen ticker + latest departures feed, persistent sidebar filters, sortable table. Best journalist UX. Risk: split-screen dilutes ticker as visual signature; table-first intimidates general public.
- **C (The Narrative):** Ticker bar (25-30%) + featured editorial profile card + card grid. Balanced audiences. Risk: featured profile adds a layer before data access.
- **D (The Dashboard):** Stats bar with 4 metrics, three-column layout (filters | table | predictions sidebar). Maximum data density. Risk: no emotional hook, poor mobile experience.

### Chosen Direction

**Hybrid: C's ticker treatment + B's newsroom body**, refined through Party Mode and Advanced Elicitation.

**Page structure (top to bottom):**

1. **Full horizontal nav** — logo, Profiles, Predictions, Calls for Change, About, Editorial Standards, Press. Export and Subscribe visible on desktop.
2. **Dark inverted ticker block** (25-30% viewport) — full-width, `--surface-inverse` background, 80-84px white number, context line, advisory board trust signal. The visual signature.
3. **Stats bridge strip** — single line on a mid-tone surface: "8 companies · 67% senior roles · 14 departures in 2026." Maximum 3 stats. Scannable in under 1 second. Tweetable.
4. **Latest Activity slot** — priority queue pulling the most recent event from: new departures, prediction resolutions, insider vote thresholds, or editorial spotlights. 3 items on desktop, 1 on mobile. Never stale — the definition of "latest" spans all content types.
5. **Profile browse section** — cards as default view on desktop and mobile. Visible table/card toggle for journalists. Filter chips above cards on mobile; persistent left sidebar with faceted filters on desktop; collapsible sidebar (default open) on tablet.
6. **Profile count indicator** — "73 profiles" visible near card section on mobile so the pattern lands even with 2-3 visible cards.

### Browse Mode by Breakpoint

| Element | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|---|---|---|---|
| Default view | Card list | Card grid (2-col) | Card grid (3-col) |
| Table toggle | Hidden | Available | Visible |
| Filter UI | Horizontal scrolling chips | Collapsible sidebar (default open) | Persistent left sidebar |
| Latest Activity | 1 item | 2 items | 3 items |
| Export controls | In menu | Visible | Fully visible in sidebar |

### Design Rationale

The ticker needs an uninterrupted full-width moment to serve as the visual signature and pass the 10-second test — but the site's primary value is structured evidence access. This hybrid delivers gravity first (2-3 seconds of dark ticker block), then utility (newsroom layout with filters and data).

Cards as default (not table) was validated by the User Persona Focus Group: general public visitors are confused by table rows, while journalists find and click the table toggle in 2 seconds. The device is the audience signal — mobile arrivals (insiders, public via social share) get the emotional card experience; desktop users (journalists) get power-user tools.

### Interaction Refinements

**Profile cards:**
- Entire card is the click target (not just the name) — subtle hover shadow (desktop), tap highlight (mobile)
- Each card shows: name, company, role, year, one-line quote, primary concern tag, "calls for change" tag

**Share affordance:**
- Sticky floating share button on mobile profile pages (bottom of viewport)
- Inline share CTA at the end of profile content on desktop
- Share buttons at emotional peaks: post-ticker, post-profile, post-prediction-resolution

**Vote privacy:**
- No personalized vote feedback — show prediction resolution status only, never "your vote was correct"
- localStorage stores vote state for UI purposes only (prevent duplicate voting)

**Filter permalinks:**
- Human-readable URL parameters: `?company=openai&year=2025&concern=safety-deprioritization`
- URL updates with every filter change (Algolia-style)
- Shareable: journalist can send filtered view to editor

### SEO Architecture

**Keyword strategy:** Every profile page is a long-tail landing page targeting "[name] + [company]" searches. Company aggregate pages target "[company] safety departures." The cross-linked taxonomy we designed for UX is the internal linking structure Google rewards.

**Page types and URL patterns:**

| Page | URL Pattern | Title Tag Pattern |
|---|---|---|
| Homepage | `/` | The Warning Collective — [count] AI Researchers Who Left Over Safety |
| Profile | `/profiles/elena-rodriguez` | Elena Rodriguez — Why She Left OpenAI · The Warning Collective |
| Profiles browse | `/profiles` | All Profiles · The Warning Collective |
| Filtered view | `/profiles?company=openai` | OpenAI Safety Departures · The Warning Collective |
| Company aggregate | `/companies/openai` | OpenAI — [count] Safety Departures · The Warning Collective |
| Predictions | `/predictions` | AI Safety Predictions & Track Record · The Warning Collective |
| Calls for Change | `/calls-for-change` | Calls for Change — What AI Researchers Are Asking For · The Warning Collective |
| About | `/about` | About · The Warning Collective |
| Editorial Standards | `/editorial-standards` | Editorial Standards · The Warning Collective |
| Press | `/press` | Press & Media · The Warning Collective |

**Company aggregate pages** (`/companies/openai`) — new page type identified during SEO audit. Shows all departures from one company with timeline, concern breakdown, and profile links. High SEO value + journalist research tool.

**Semantic HTML:**
- Homepage `<h1>` is the full keyword sentence ("73 AI researchers have left major companies over safety concerns") — CSS styles the number large and the context small, but the crawler sees the complete heading
- Profile `<h1>`: "[Name] — [Role] at [Company]"
- Proper `<article>`, `<section>`, `<blockquote cite="">` throughout

**Structured data (JSON-LD):**
- Homepage: `WebSite` + `ItemList` (profile cards — enables rich snippets)
- Profile pages: `Person` (name, jobTitle, worksFor) + `Article` (datePublished, publisher)
- Predictions: `Claim` schema (claimant, dateCreated)
- Resolved predictions: `ClaimReview`-adjacent structured data

**Technical SEO:**
- Canonical URLs on filtered views (prevent duplicate content from filter combinations)
- Auto-generated meta descriptions per profile: "[Name] left [Company] in [Year] over [Concern]. Read their sourced account and predictions."
- XML sitemap including all profiles, company pages, and aggregate views
- Self-hosted Source Serif 4 (no third-party font requests — privacy + performance)
- Hub-and-spoke internal linking: company pages and calls-for-change pages as hubs, profiles as spokes

### Implementation Approach

The hybrid direction requires no novel engineering. All components map to established patterns:

- Dark ticker block → CSS + SSR (Next.js)
- Stats bridge → Aggregated counts from profiles table, cached
- Latest Activity priority queue → Simple query: most recent event across 4 content types
- Card/table toggle → TanStack Table with dual render modes
- Persistent sidebar filters → TanStack Table faceted filtering + URL state sync
- Company aggregate pages → Dynamic routes from profiles data
- Structured data → Next.js `<Head>` with JSON-LD templates
- Canonical URLs → Next.js middleware

## User Journey Flows

### Journey 1: The Cautious Insider

**Entry:** Anonymous link from colleague, or search for "[company] AI safety departures"
**Goal:** Feel less alone → find social proof → potentially vote on a prediction
**Time budget:** 5-10 minutes (browsing cautiously, probably on phone)

**Flow:** Land → dark ticker block (social proof the pattern is real) → stats bridge (seniority signal: "people like me") → filter by company → browse profiles of former colleagues → read departure quotes → see prediction with insider vote bar → tap "Vote as AI Professional" → insider gate popover (privacy disclosure, self-ID toggle) → vote agree/disagree → see updated sentiment bar → leave → return days later → delta badge → check prediction resolution.

**The Insider Gate (detailed interaction):**

| Step | What they see | Design detail |
|---|---|---|
| 1. See prediction | Vote bar: "82% agree · 47 insider votes" | Visible to all. "Vote as AI Professional" button below. |
| 2. Tap vote button | Popover slides up (shadcn Popover) | Not a modal — no dark overlay. Light, not trapping. |
| 3. Read gate copy | "This vote is for current or former AI industry professionals. No account required. No data collected beyond your vote. Honor system." | Warm, direct, 2 sentences. No legalese. Link to Editorial Standards visible but not required. |
| 4. Self-identify | Single toggle: "I work (or worked) in AI" | One tap. Not a form. Not a dropdown of companies. |
| 5. Vote | Agree / Disagree binary buttons appear | Immediately after self-ID, no second confirmation. |
| 6. Confirmation | Vote bar animates to include their vote. Popover dismisses. | "Thank you" micro-text, fades after 2s. No celebration. |
| 7. Persistence | `localStorage: { insiderVerified: true, votes: { predictionId: 'agree' } }` | Future votes skip the gate. |

**Trust design notes:**
- No email, no name, no company asked — ever
- Self-ID persists in localStorage — returning insiders skip the gate
- If localStorage is cleared, they re-self-identify (no "lost account" problem)
- No personalized vote feedback on return — show resolution status only, never "your vote was correct"

**Known limitation (documented):** Votes are device-local via localStorage. Duplicate votes across devices are possible and accepted for MVP. The honor system is already the gate — device fingerprinting would not stop someone willing to lie about being an AI professional.

### Journey 2: The Journalist on Deadline

**Entry:** Press page link, Google search, or direct filtered URL
**Goal:** Get structured, citeable data for a story in under 5 minutes
**Time budget:** 5-60 minutes depending on story depth

**Flow:** Land → glance at ticker (note the number) → stats bridge (note context) → scroll past Latest Activity → reach profile browse section → click "Table" toggle → persistent left sidebar filters (company, year, concern, seniority) → apply 2-3 filters → URL updates with each filter → scan filtered results → click profile row for detail → copy sourced quote (hover preview confirms origin) → Back to filtered table (state preserved via URL) → Export CSV → Copy Permalink → paste in story draft.

**60-second export test:**

| Second | Action | Requirement |
|---|---|---|
| 0-5 | Land, scroll past ticker | SSR, no loading states |
| 5-15 | Click table toggle, apply 2-3 filters | Client-side instant filtering, URL updates per filter |
| 15-25 | Scan results, click one profile | Profile page loads <1s, Back preserves filter state |
| 25-40 | Click Export CSV | Download starts immediately (client-side data, no server round-trip) |
| 40-55 | Click Copy Permalink | URL already in address bar, "Copied" toast confirms |
| 55-60 | Paste in story draft | Done |

**Critical UX details:**
- **CSV contents:** name, company, role, year, concern, quote, source URL, profile permalink — journalists need verifiable citations, not just data points
- **Source links open in new tab:** `target="_blank"` with `rel="noopener noreferrer"` — journalists work in tabs, standard citation behavior
- **Sort persistence:** sort column and direction stored in URL params (`&sort=year&order=desc`)
- **Back-button contract:** URL-as-state for filter preservation is the source of truth

**Predictions angle (optional extension):** Navigate to `/predictions` → filter by company or status "Resolved" → find resolved prediction with high insider agreement → copy prediction text + resolution + insider percentage as citation.

### Journey 3: The Concerned Citizen

**Entry:** Shared link on X or LinkedIn
**Goal:** Understand the scale, feel the weight, share it forward
**Time budget:** 2-3 minutes (mobile, attention is fragile)

**Flow:** Tap shared link → dark ticker block (25-30% viewport, full-width) → stats bridge → profile cards (first-visit mobile skips Latest Activity slot) → tap a profile card → read departure quote and reason → see "Calls for Change" → reach end of profile → sticky share button → native share sheet with pre-populated text and dynamic OG image → post to social media.

**First-visit mobile optimization:** On first visit (no `localStorage.hasVisited`), the mobile homepage skips the Latest Activity slot entirely: ticker → stats bridge → profile cards. This reduces scroll gestures between the emotional hook (ticker) and the human stories (profiles). Return visitors see the full layout including Latest Activity. Detected client-side — no SEO impact since content remains in the DOM.

**Mobile-specific flow:**

| Moment | What they see | Design detail |
|---|---|---|
| Landing (0-3s) | Dark ticker block, number, context line, trust signal | No nav bar above fold. No hamburger competing. |
| Scroll cue (3-5s) | Stats bridge + partial card peeking from below | Subtle — don't break the ticker moment |
| Browse (5-30s) | Cards in single column, horizontal filter chips | Chips scroll horizontally. "All" default. "73 profiles" count visible. |
| Profile read (30-120s) | Full profile, scrolling content | Sticky share button appears at bottom of viewport after 3s |
| Share (120-180s) | Native share sheet | Pre-populated: "[count] AI researchers have quit. Here's why. [URL]" |

**The viral loop:** Share → followers see OG image (dark block, big number) → tap → ticker moment → browse → emotional connection → share. The loop is self-reinforcing because the OG image *is* the ticker moment.

### Journey 4: The Policymaker Researcher (Variant of Journey 2)

Same tools as the journalist, different navigation pattern:

- Navigates by **topic** (Calls for Change, concern categories) rather than by **entity** (company, individual)
- Entry points: `/calls-for-change` filtered by concern category, or `/companies/openai` for per-company breakdowns
- Uses prediction track record as evidence of researcher foresight in briefings
- Exports data filtered by concern category (not company/date)
- Bookmarks aggregate pages for return visits

The key UX difference: policymakers ask "what are they saying about governance?" while journalists ask "what happened at OpenAI?" Both use the same filter/export tools — just different entry points and filter priorities.

### Journey Patterns

**Navigation patterns:**
1. **Filter-as-you-go** — every filter change is instant (client-side), updates the URL, and preserves state across page navigation and back-button
2. **Hub-and-spoke browsing** — browse page (hub) → individual profile/prediction (spoke) → back to hub with state preserved
3. **Content-type switching** — profiles, predictions, calls for change are parallel sections, navigable from global nav, cross-linked via taxonomy tags

**Feedback patterns:**
1. **Immediate state reflection** — filter count updates instantly ("Showing 8 of 73"), URL updates, sort arrows flip
2. **Micro-confirmation** — "Copied" toast on permalink copy, vote bar animation on vote, "Downloaded" on export
3. **Return-visit awareness** — delta badge on ticker, "New" badge on profiles, resolved prediction surfacing

**Trust patterns:**
1. **Source-adjacent claims** — every quote has its source link within thumb reach. Hover preview (desktop), tap-to-open (mobile).
2. **Progressive disclosure of methodology** — trust signal on ticker → Editorial Standards in nav → full methodology on dedicated page. Never forced, always available.
3. **Minimal-ask interactions** — voting requires one self-ID tap (persisted), sharing requires one tap (pre-populated), exporting requires one click (immediate download). No forms, no accounts, no confirmation dialogs.

### Flow Optimization Principles

1. **Zero-state clarity** — every page communicates its purpose before any interaction. No blank states, no "click here to begin."
2. **Filter state as URL** — the URL is always the source of truth. Shareable, bookmarkable, back-button-compatible. Never lose state.
3. **One-tap maximum for high-frequency actions** — share, copy permalink, export. The journalist test: can they do it faster here than in their own spreadsheet?
4. **Trust signals at decision points** — advisory board name at the ticker ("is this real?"), source links at quotes ("is this true?"), privacy disclosure at the vote gate ("is this safe?").
5. **Graceful degradation** — cleared localStorage means no delta badge and re-self-identification. Not broken, just reset. No "account recovery" because there are no accounts.

### Technical Flow Notes

- **Scroll restoration:** Next.js `experimental.scrollRestoration = true` + sticky profile header with person's name as fallback for unreliable browser scroll restoration
- **Source links:** `target="_blank"` with `rel="noopener noreferrer"` on all external citation links
- **First-visit detection:** `localStorage.getItem('hasVisited')` — conditional render on mobile, no SSR impact
- **Back-button contract:** URL-as-state handles filter preservation. Scroll position within pages is best-effort (browser-native, not guaranteed on all mobile browsers)

## Component Strategy

### Design System Components (shadcn/ui + Radix)

**Use as-is (with token customization):**

| Component | Usage |
|---|---|
| Button | Export, share, filter toggle, table/card toggle |
| Badge | Concern tags, company tags, "New" indicator, insider count |
| Card | Shell for profile cards, prediction cards |
| DropdownMenu | Export format picker (CSV/JSON), nav hamburger (mobile) |
| Popover | Insider gate disclosure, source hover preview |
| Tooltip | Micro-help, abbreviated labels |
| Table | Styled wrapper for TanStack Table rows |
| Toast | "Copied" confirmation, "Downloaded" confirmation |
| NavigationMenu | Full-width nav (needs customization for Editorial Standards prominence) |

**Not needed for MVP:** Dialog (anti-modal stance), Accordion, Tabs, Sheet (mobile filter uses custom slide-up).

### Custom Components

#### 1. Ticker Block

**Purpose:** Communicate departure scale instantly. The site's visual signature and screenshot moment.

**Anatomy:**
- Container: full-width `--surface-inverse` background, 25-30% viewport height
- Primary number: 80-84px Inter ExtraBold (800), `--text-inverse`, tabular figures
- Context line: 16px Inter, `--text-inverse` at 0.8 opacity
- Meta line: 13px, 0.5 opacity (last departure date, monthly count)
- Trust signal: 13px italic, 0.6 opacity (advisory board member name)
- Delta badge (return visitors): "+3 since Mar 8" in `--accent-amber` pill

**States:**

| State | Trigger | Behavior |
|---|---|---|
| Static | First visit | Number renders immediately via SSR. No animation. |
| Delta | Return visit (`localStorage.lastCount` exists) | Static number + delta badge: "+N since [date]" |
| Digit roll | Live update (new profile published while on page) | Last 1-2 digits roll. `prefers-reduced-motion`: skip, show new number. |

**Accessibility:** `<h1>` wraps full keyword sentence. `aria-live="polite"` on number for live updates. Delta badge: `aria-label="+3 new departures since March 8"`.

**Responsive:** Full-width all breakpoints. Mobile: number scales to 64-72px, context to 15px.

#### 2. Stats Bridge Strip

**Purpose:** Transition from dark ticker to light body. Tweetable context. Scannable in under 1 second.

**Anatomy:** Mid-tone `--surface-secondary` bar, 48px height, 3 stat fragments separated by middots ("8 companies · 67% senior roles · 14 in 2026"), 14px Inter Medium, centered.

**Rules:** Maximum 3 stats. Fragments only, no sentences. Auto-updates from cached aggregates.

**Accessibility:** `<p>` with `role="status"`.

**Responsive:** Single line desktop/tablet. May wrap to 2 lines on mobile.

#### 3. Profile Card

**Purpose:** The browse unit. Shows enough to feel the weight and decide whether to drill in.

**Anatomy:**
- Container: `--surface-card`, 1px `--border-light`, 8px radius, 24px padding
- Name: 18px Source Serif 4 Semibold
- Role line: 14px Inter `--text-secondary` — "[Role] · [Company] · [Year]"
- Quote: 15px Inter italic, 3px `--accent-amber` left border, truncated to 2 lines
- Source link: 12px `--accent-info`, underlined
- Tags: concern (`tag-concern`), calls-for-change (`tag-change`)
- "New" badge (return visitors): `--accent-amber` pill, top-right

**States:** Default (flat), hover (elevated shadow, desktop), tap highlight (mobile), new (amber badge).

**Actions:** Entire card is click target → `/profiles/[slug]`.

**Accessibility:** `<article>` with `<a>` wrapping card. `aria-label="[Name], [Role] at [Company], [Year]"`.

**Responsive:** 1 column (mobile), 2 columns (tablet), 3 columns (desktop). Padding reduces to 16px on mobile.

#### 4. Profile Page Layout

**Purpose:** The deep-read experience. One person's sourced story with cross-linked intelligence.

**Anatomy (top to bottom):**
- Sticky header: name + "Back to profiles" link
- Hero: Name (h1, 36px Source Serif 4), role, company, tenure, departure year
- Primary quote: large blockquote with source link + hover preview
- "Why they left" section: narrative with inline source links
- Concerns raised: taxonomy tags → aggregate page links
- Calls for Change: proposal tags → `/calls-for-change?tag=[tag]`
- Predictions: prediction cards with insider vote bars
- Share CTA: inline at content end (desktop), sticky floating button (mobile, appears after 3s)

**All source links:** `target="_blank" rel="noopener noreferrer"`. Hover triggers Source Preview Tooltip on desktop.

**Accessibility:** Semantic headings (`h1`→`h2`→`h3`), `<blockquote cite="">` for quotes, `aria-label` on share button.

**Responsive:** Single-column all breakpoints. Sticky header all devices.

#### 5. Insider Vote Bar

**Purpose:** Display insider sentiment on predictions. Enable insider-gated voting. The only novel UX pattern.

**Anatomy:**
- Prediction quote: 16px Source Serif 4 Semibold
- Attribution: 13px Inter `--text-secondary`
- Vote bar: 8px horizontal bar, `--status-verified` (agree) / `--status-error` (disagree)
- Percentages: 12px labels flanking bar
- Insider count: `--accent-info` badge ("47 insider votes")
- Vote trigger: "Vote as AI Professional" text button
- Resolution badge: "Confirmed" / "Disproven" / "Partially confirmed"

**States:** Unvoted → gate open (popover) → voted (bar animates, button hidden) → resolved (badge, bar frozen).

**Gate popover:** Privacy copy (2 sentences), self-ID toggle, link to Editorial Standards. After self-ID: agree/disagree buttons appear immediately. `insiderVerified` persisted in localStorage.

**Accessibility:** Vote bar: `role="meter"` with `aria-valuemin/max/now`. Popover: focus-trapped (Radix). Self-ID: checkbox with label.

#### 6. Filter Panel

**Purpose:** Faceted filtering for profile discovery. The journalist's primary tool.

**Desktop:** 240px persistent sidebar, `--surface-secondary`, filter sections (Company, Year, Concern, Seniority) with counts, export controls at bottom.

**Tablet:** Collapsible sidebar, default open.

**Mobile:** Horizontal scrolling chips above cards. "Filters" button opens slide-up sheet for full filter list.

**URL sync:** Every change updates params. Page load reads params. Human-readable: `?company=openai&year=2025&concern=safety-deprioritization&sort=year&order=desc`.

**Accessibility:** `<nav aria-label="Profile filters">`, checkbox inputs with labels, `aria-live="polite"` on result count.

#### 7. Source Preview Tooltip

**Purpose:** Zero-click verification. Hover on source link → see OG metadata without leaving the page.

**Anatomy:** shadcn Popover with OG title (bold), domain, date, thumbnail. "Open in new tab →" footer link.

**States:** Desktop hover (300ms delay → show, 200ms → dismiss), desktop click (opens in new tab), mobile tap (opens in new tab directly — no popover), OG unavailable (standard link, no popover).

**Data:** OG metadata cached at build/publication time. No runtime external requests.

**Accessibility:** `aria-describedby` links popover to trigger. Dismissable via Escape. Keyboard-accessible via focus.

#### 8. Latest Activity Slot

**Purpose:** Freshness signal. Shows most recent meaningful event so the site never feels stale.

**Variants:** New departure card, prediction resolution card, vote threshold alert, editorial spotlight.

**Priority logic:** Most recent event across 4 types. Desktop: 3 items. Mobile: 1 item. First-visit mobile: hidden (`!localStorage.hasVisited`).

**Fallback:** Editorial spotlight is the catch-all — slot is never empty.

**Accessibility:** `<section aria-label="Latest activity">`, each card as `<article>`. Hidden state: `aria-hidden="true"`.

### Component Implementation Roadmap

| Phase | Components | Unlocks |
|---|---|---|
| 1: Core | Ticker Block, Profile Card, Profile Page Layout | Homepage + profile browsing (all journeys' core flow) |
| 2: Power tools | Filter Panel, Source Preview Tooltip | Journalist workflow complete (Journey 2) |
| 3: Engagement | Insider Vote Bar, Latest Activity Slot | Insider voting (Journey 1), return-visit experience |
| 4: Polish | Stats Bridge Strip | Full homepage experience |

**Dependency chain:** Ticker → Stats Bridge → Latest Activity (top-down homepage). Filter Panel + Profile Card → Profile Page (browse-to-read). Vote Bar depends on Profile Page.

### Shared Component Patterns

- All cards: `--surface-card` + `--border-light` + 8px radius + 24px padding
- All tags: Badge component with color variants (concern/amber, company/blue, change/green)
- All interactive elements: `--accent-amber` for consistency
- All source links: `target="_blank" rel="noopener noreferrer"`
- All responsive behavior: 3-breakpoint system (mobile <768, tablet 768-1024, desktop >1024)

## UX Consistency Patterns

### Button Hierarchy

| Tier | Style | Usage | Examples |
|---|---|---|---|
| **Primary** | `--accent-amber` bg, white text, 6px radius | One per viewport. Single most important action. | "Export CSV", "Vote as AI Professional" |
| **Secondary** | Transparent bg, 1px `--border-light`, `--text-secondary` | Supporting actions alongside primary. | "Export JSON", "Copy Permalink", "Subscribe", "Table/Card" toggle |
| **Text** | No bg/border, `--accent-info` or `--text-secondary`, underline on hover | Inline or low-emphasis actions. | "Clear all filters", "Back to profiles", "Open in new tab" |

**Rules:**
- Never two primary buttons in the same visual context
- Primary always on the right in horizontal groups
- Disabled: `--state-disabled` bg, `aria-disabled="true"`
- All buttons 44px minimum touch target on mobile
- No icon-only buttons without `aria-label`

### Feedback Patterns

**Micro-confirmations (toasts):**

| Action | Toast text | Duration |
|---|---|---|
| Copy permalink | "Link copied" | 2s |
| Export CSV/JSON | "CSV downloaded" / "JSON downloaded" | 2s |
| Insider vote | "Your perspective recorded" (inline on vote bar, not toast) | 2s fade |
| Email signup | "You'll hear from us when something happens" | 3s |

**Toast design:** `--surface-inverse` bg, `--text-inverse` text, 14px Inter, 8px radius, slide-up animation. Auto-dismiss only, no close button, no stacking — one toast at a time. Position: bottom-center.

**Real-time state feedback:**

| Element | Feedback | Behavior |
|---|---|---|
| Filter change | Count update | "Showing X of Y" instant, `aria-live="polite"` |
| Sort change | Arrow flip | Column header arrow rotates, results reorder |
| URL update | Address bar | Params update with every filter/sort — no toast |
| Vote bar | Animation | Width animates 300ms. `prefers-reduced-motion`: instant snap. |
| Ticker live update | Digit roll | 500ms roll. `prefers-reduced-motion`: instant swap. |

**Error states:**

| Scenario | Response |
|---|---|
| Source preview OG data fails | Silent fallback — no popover, standard link behavior |
| Export fails | Toast: "Export failed. Try again." with `--status-error` left border |
| Prediction vote fails | Toast: "Vote didn't save. Try again." Vote bar reverts. |
| Network offline | No special handling for MVP (SSR content already loaded) |

**No modals. No confirmation dialogs. No "Are you sure?" prompts.** Every action is either low-stakes (filtering, browsing) or intentional (voting, exporting).

### Loading & Empty States

**Loading states (rare — SSR handles most):**

| Scenario | Treatment |
|---|---|
| Initial page load | SSR — content visible on first paint. No spinner ever. |
| Client-side filter | Instant (TanStack Table, client-side). No loading state for MVP. |
| Page navigation | Next.js transition. Skeleton of profile header for <100ms gap. |
| Source preview | 200ms delay. Cached OG data = instant. Missing = no popover, fail silently. |

**Empty states:**

| Scenario | Treatment |
|---|---|
| Filter returns 0 results | "No profiles match these filters." + "Clear all filters" text button. Centered, `--text-secondary`. No illustration. |
| Latest Activity empty | Hide section entirely (editorial spotlight catch-all prevents this). |
| Predictions empty | "No predictions yet for this profile." Inline, `--text-secondary`. |

**Skeleton patterns:** `--surface-secondary` animated pulse blocks matching content shape. Never visible >500ms.

### Navigation Patterns

**Global nav:**

| Breakpoint | Style | Behavior |
|---|---|---|
| Desktop | Full horizontal | All items visible: Profiles, Predictions, Calls for Change, About, Editorial Standards, Press. Export + Subscribe on right. |
| Tablet | Compressed horizontal | Primary items visible. "More" dropdown for secondary. |
| Mobile | Logo + hamburger | Slide-down menu. Not visible above fold on homepage. |

**Active state:** `--text-primary` + `font-weight: 600` + 2px `--accent-amber` bottom border. Inactive: `--text-secondary`.

**Internal links:** Same tab. Profile cards → `/profiles/[slug]`. Taxonomy tags → filtered/aggregate views. Filter changes → URL update in place (no navigation). "Back to profiles" preserves filter state.

**External links:** `target="_blank" rel="noopener noreferrer"`. Subtle external-link icon (12px, `--text-secondary`) after link text.

**Cross-links (taxonomy):** Styled as clickable badges (colored pills), visually distinct from source citations. Same-tab navigation to filtered or aggregate views.

### Link Behavior Summary

| Link type | Visual | Click behavior | Icon |
|---|---|---|---|
| Internal nav | `--text-secondary`, active state | Same tab | None |
| Profile card | Entire card is link | Same tab → `/profiles/[slug]` | None |
| Taxonomy tag | Badge (colored pill) | Same tab → filtered view | None |
| Source citation | `--accent-info`, underlined, 12px | New tab | External (⤴) |
| "Copy Permalink" | Secondary button | Copies URL | None (toast) |
| External (advisory board etc.) | `--accent-info`, underlined | New tab | External (⤴) |

### Animation & Motion Principles

1. **`prefers-reduced-motion` respected everywhere.** All animations skip to final state.
2. **Maximum duration: 500ms.** Ticker digit roll is the longest animation.
3. **No decorative animation.** Every animation communicates state change.
4. **No scroll-jacking.** No parallax, no scroll-triggered animations, no sticky resize.
5. **Hover effects: 150ms transitions.** Card shadow, button color, nav highlight.

## Responsive Design & Accessibility

### WCAG Compliance

**Target: WCAG 2.1 AA** — full compliance, zero violations at launch.

**AAA achieved by default:**
- Body text contrast: `#1e293b` on `#fafaf9` = ~12.6:1 (exceeds AAA 7:1)
- Touch targets: 44px minimum (exceeds AAA 24px minimum from WCAG 2.2)

**AAA tracked as non-blocking:**
- Secondary text contrast: `#78716c` on `#fafaf9` = ~4.6:1 (AA pass, AAA fail)

### Keyboard Navigation

**Radix/shadcn handles natively:** Popover (Escape, focus trap), DropdownMenu (arrow keys, Enter, Escape), Tooltip (focus to show), Button (Enter/Space).

**Custom keyboard support:**

| Component | Keyboard behavior |
|---|---|
| Profile card grid | Tab between cards, Enter opens profile (cards are `<a>` — native) |
| Filter chips (mobile) | Tab between chips, Enter/Space toggles (`role="checkbox"`) |
| Filter sidebar | Tab through options, Enter/Space toggles (checkbox inputs — native) |
| Table sort | Tab to column header, Enter to sort (`<button>` in `<th>`) |
| Table rows | Tab to row, Enter to open profile (rows wrap `<a>`) |
| Card/Table toggle | Tab to toggle, Enter/Space to switch (standard `<button>`) |
| Vote bar | Tab to "Vote as AI Professional", Enter opens gate (Radix Popover handles focus) |

**Skip links:**
- "Skip to main content" — past nav
- "Skip to profiles" — past ticker, stats bridge, latest activity, straight to profile list
- Visible only on keyboard focus (Tailwind `sr-only` + `focus:not-sr-only`)

### Screen Reader Experience

**Homepage announces (in order):**
1. Skip links (on Tab)
2. Nav landmark with all links
3. h1: "73 AI researchers have left major companies over safety concerns" (full sentence, not just the number)
4. Status text: last departure date, monthly count
5. Trust signal: advisory board member
6. Delta badge (return visitor): "3 new departures since March 8"
7. Stats bridge: "8 companies. 67 percent senior roles. 14 departures in 2026."
8. Latest Activity section heading + article cards
9. Profiles section heading + filter count ("Showing 73 of 73 profiles") via `aria-live="polite"`
10. Profile cards: name, role, company, year per card

**Key screen reader decisions:**
- Ticker h1 is the full keyword sentence, not just the number
- Filter count changes announced via `aria-live="polite"`
- Vote bar: `role="meter"` with `aria-label="82 percent of insider voters agree"`
- Source links: `aria-label` includes publication name + "Opens in new tab"
- Profile cards: `aria-label` includes name, role, company, year

### Color Blindness Mitigation

**The green/red problem:** Prediction outcomes use emerald (verified) and rose (disproven). ~8% of men have red-green color vision deficiency.

**Triple-redundant state indicators:**

| Status | Color | Icon | Text label |
|---|---|---|---|
| Confirmed | `--status-verified` (emerald) | ✓ checkmark | "Confirmed" |
| Disproven | `--status-error` (rose) | ✕ cross | "Disproven" |
| Partially confirmed | `--accent-amber` | ~ tilde | "Partially confirmed" |
| Pending | `--text-secondary` (gray) | — dash | "Pending" (outlined pill, not filled) |

Any one of the three signals (color, icon, text) is sufficient to understand the state.

**Additional mitigations:**
- Vote bar: percentage labels are the primary information, bar color is supplementary. Position (left = agree, right = disagree) is the second signal.
- Tags: always have text labels. Color is supplementary grouping.
- **Testing commitment:** deuteranopia/protanopia simulation on all pages before launch.

### Testing Strategy

**Automated (CI pipeline):**
- axe-core via `@axe-core/playwright` — zero AA violations as merge gate
- Lighthouse accessibility ≥95 as merge gate
- Automated color contrast check against all token pairs

**Manual (pre-launch checklist):**

| Test | Tool | Frequency |
|---|---|---|
| Keyboard-only navigation | Tab/Enter/Escape, no mouse | Every sprint |
| VoiceOver (macOS/iOS) | All journeys | Pre-launch + quarterly |
| NVDA (Windows) | All journeys | Pre-launch |
| Color blindness simulation | Sim Daltonism or Chromatic Vision Simulator | Pre-launch + palette changes |
| Zoom to 200% | Browser zoom | Every sprint |
| Reduced motion | `prefers-reduced-motion: reduce` | When animations added |
| High contrast mode | Windows High Contrast Mode | Pre-launch |

**Device testing matrix:**

| Device | Browser | Priority |
|---|---|---|
| iPhone 14/15 | Safari iOS | Critical (social share arrivals) |
| Pixel 7/8 | Chrome Android | Critical |
| MacBook | Chrome | Critical (journalist primary) |
| MacBook | Safari | High |
| Windows laptop | Chrome | High |
| Windows laptop | Edge | Medium |
| iPad | Safari | Medium |
| Any | Firefox | Medium |

### Print Stylesheet

Journalists print profile pages. Basic print rules:

- Hide: nav, filter sidebar, share buttons, vote buttons, toast container
- Ticker: invert to light background, dark text (no ink waste)
- Source URLs: printed as text after links (`a[href]:after { content: " (" attr(href) ")"; }`)
- Font: 12pt body, 16pt headings
- Page breaks: avoid inside profile cards, blockquotes, prediction cards
- Max width: none (use full page width)

### Responsive Consolidation

All responsive decisions from previous steps, consolidated:

| Element | Mobile (<768) | Tablet (768-1024) | Desktop (>1024) |
|---|---|---|---|
| Nav | Hidden above fold. Hamburger. | Compressed horizontal | Full horizontal + utility |
| Ticker | Full-width, 25-30% vh, 64-72px | Full-width, 80px | Full-width, 80-84px |
| Stats bridge | 2-line wrap OK | Single line | Single line |
| Latest Activity | 1 item (hidden first visit) | 2 items | 3 items |
| Filter UI | Chips + slide-up sheet | Collapsible sidebar (default open) | Persistent sidebar (240px) |
| Browse mode | Cards (1 col) | Cards (2 col) | Cards (3 col), table toggle visible |
| Profile count | "73 profiles" visible | Visible | In filter count |
| Export controls | In hamburger | Visible | Fully visible in sidebar |
| Share button | Sticky floating (bottom-right) | Inline at content end | Inline at content end |

### Implementation Guidelines

**Responsive development:**
- Mobile-first media queries (`min-width` breakpoints in Tailwind)
- Relative units: rem for typography, percentages for layout, vh for ticker
- Self-hosted Source Serif 4 with `font-display: swap` and Georgia fallback
- Images: Next.js `<Image>` with responsive `srcSet` for OG thumbnails in source previews

**Accessibility development:**
- Semantic HTML first, ARIA only when HTML semantics are insufficient
- Focus management: Radix handles popovers/dropdowns; custom skip links for page-level
- Test with keyboard before adding mouse interactions
- `aria-live="polite"` on all dynamic content (filter counts, toasts, vote bar updates)
- Never use `aria-hidden` on content that's visually present
- `lang="en"` on `<html>` element
