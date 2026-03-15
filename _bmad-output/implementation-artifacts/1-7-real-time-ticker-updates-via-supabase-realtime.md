# Story 1.7: Real-Time Ticker Updates via Supabase Realtime

Status: done

## Story

As a visitor,
I want the ticker count to update live when a new profile is published,
So that the site feels alive.

## Acceptance Criteria

### AC1: Realtime Subscription

**Given** I am on the homepage with the page loaded,
**When** a new profile is published and the ticker_stats row is updated,
**Then** a Supabase Realtime subscription fires in the client component wrapping the ticker count,
**And** the count updates within 60 seconds of the publish event (NFR-2).

### AC2: Counter Animation

**Given** the count updates and prefers-reduced-motion is not set,
**When** the new count arrives,
**Then** the counter animates with a digit-roll effect (500ms duration),
**And** the return visitor delta badge updates accordingly.

### AC3: Graceful Degradation on WebSocket Drop

**Given** the WebSocket connection to Supabase Realtime drops,
**When** I remain on the page,
**Then** the ticker displays the last known SSR count without showing an error,
**And** the component attempts to reconnect silently in the background.

### AC4: Reduced Motion Support

**Given** I have prefers-reduced-motion enabled in my OS settings,
**When** a live update occurs,
**Then** the number changes instantly without any animation.

## Tasks / Subtasks

- [x] Task 1: Create useTickerSubscription hook (AC: 1, 3)
  - [x] 1.1 Create `src/hooks/useTickerSubscription.ts`
  - [x] 1.2 Subscribe to `ticker_stats` table changes via Supabase Realtime (UPDATE events)
  - [x] 1.3 Parse incoming payload with `tickerStatsSchema`
  - [x] 1.4 Return `{ liveCount }` — liveCount is null until first update
  - [x] 1.5 Handle channel error and reconnection (Supabase auto-reconnects)
  - [x] 1.6 Cleanup subscription on unmount
  - [x] 1.7 Unit tests for useTickerSubscription

- [x] Task 2: Create DigitRoll animation component (AC: 2, 4)
  - [x] 2.1 Create `src/components/custom/AnimatedCount.tsx`
  - [x] 2.2 CSS digit-roll keyframes with 250ms in/out (500ms total)
  - [x] 2.3 Respect `prefers-reduced-motion` via existing globals.css rule
  - [x] 2.4 tabular-nums for consistent digit width
  - [x] 2.5 Unit tests for AnimatedCount

- [x] Task 3: Update TickerClient with realtime support (AC: 1, 2, 3)
  - [x] 3.1 Integrate `useTickerSubscription` into TickerClient
  - [x] 3.2 Use `liveCount ?? totalCount` pattern (SSR fallback)
  - [x] 3.3 Pass count to AnimatedCount component
  - [x] 3.4 Update delta badge calculation when live count changes
  - [x] 3.5 Update localStorage `LAST_COUNT` when live count arrives
  - [x] 3.6 Update unit tests for TickerClient

- [x] Task 4: Update TickerBlock to pass data as props (AC: 2)
  - [x] 4.1 Restructured: TickerBlock passes totalCount, ninetyDayCount, seniorityText as props
  - [x] 4.2 TickerClient now renders full ticker UI including AnimatedCount
  - [x] 4.3 Update TickerBlock tests

- [x] Task 5: Validation and verification (AC: 1, 2, 3, 4)
  - [x] 5.1 Run all Vitest unit tests — 123/123 pass
  - [x] 5.2 Run lint — 0 errors
  - [x] 5.3 Run typecheck — clean
  - [x] 5.4 Run build — succeeds

## Dev Notes

### Component Architecture

```
TickerBlock (Server Component — fetches SSR stats)
  └── TickerClient (Client Component — manages realtime + localStorage)
        ├── AnimatedCount (Client Component — digit-roll animation)
        ├── Delta badge (existing — updates with live count)
        └── Explainer (existing — unchanged)
              └── useTickerSubscription (hook — Supabase Realtime channel)
```

### useTickerSubscription Hook

```typescript
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/browser"
import { tickerStatsSchema } from "@/lib/schemas/profile"

export function useTickerSubscription() {
  const [liveCount, setLiveCount] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("ticker-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ticker_stats" },
        (payload) => {
          const parsed = tickerStatsSchema.safeParse(payload.new)
          if (parsed.success) {
            setLiveCount(parsed.data.totalCount)
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { liveCount, isConnected }
}
```

### AnimatedCount — Digit Roll

Per AC2, the counter should animate with a digit-roll effect (500ms). Implementation approach:
- Split the number into individual digits
- When a digit changes, animate the old digit out (translateY up) and new digit in (translateY from below)
- Use CSS transitions with `transition-duration: 500ms`
- Use `prefers-reduced-motion: reduce` media query to disable animation
- `tabular-nums` font feature for consistent digit width

```tsx
"use client"

interface AnimatedCountProps {
  value: number
  className?: string
}

export function AnimatedCount({ value, className }: AnimatedCountProps) {
  // Split into digits, animate each independently
  // CSS transition on transform for digit roll
  // prefers-reduced-motion → instant
}
```

### TickerClient Integration

The current TickerClient receives `totalCount` from the SSR TickerBlock. With realtime:

```typescript
const { liveCount } = useTickerSubscription()
const displayCount = liveCount ?? totalCount  // SSR fallback
```

The delta badge currently computes on mount from localStorage. When a live update arrives:
- New delta = `liveCount - lastStoredCount` (from localStorage at mount time)
- Update localStorage with the new live count

### Supabase Realtime Prerequisites

Supabase Realtime requires the `ticker_stats` table to have Realtime enabled. This is configured in the Supabase dashboard or via SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE ticker_stats;
```

This is a database configuration step, not application code. The hook should work once Realtime is enabled on the table.

### Graceful Degradation (AC3)

Supabase Realtime client auto-reconnects on WebSocket drop. The `subscribe` callback fires with status updates (`SUBSCRIBED`, `TIMED_OUT`, `CLOSED`, `CHANNEL_ERROR`). On disconnect:
- `liveCount` retains last value (or null if never received)
- `displayCount` falls back to SSR `totalCount`
- No error UI shown — stale-while-revalidate pattern
- Channel auto-reconnects per Supabase client behavior

### Reduced Motion (AC4)

```css
@media (prefers-reduced-motion: reduce) {
  .digit-roll {
    transition: none !important;
  }
}
```

Already have a `prefers-reduced-motion` block in globals.css that disables all animations. The AnimatedCount component should also check via `matchMedia` for programmatic detection if needed.

### Existing Code to Reuse — DO NOT RECREATE

- `src/lib/supabase/browser.ts` — `createClient()` for browser-side Supabase client (used for Realtime)
- `src/lib/schemas/profile.ts` — `tickerStatsSchema` for parsing Realtime payloads
- `src/components/custom/TickerBlock.tsx` — Server Component that fetches SSR stats
- `src/components/custom/TickerClient.tsx` — Client Component with localStorage logic
- `src/lib/utils/storage.ts` — `getStorageItem`, `setStorageItem` for localStorage operations
- `src/lib/constants.ts` — `STORAGE_KEYS.LAST_COUNT` for stored count key
- `src/app/globals.css` — Already has `prefers-reduced-motion` block (lines 262-268)

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.7]
- [Source: _bmad-output/planning-artifacts/architecture.md — Real-time Strategy, Supabase Realtime]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Ticker Animation]

### Previous Story Intelligence

- Try/catch with `return null` fallback — proven pattern (all Server Components)
- Server/Client Component composition: Server fetches data, Client handles interactivity (TickerBlock/TickerClient)
- `useSyncExternalStore` for localStorage reads (TickerClient pattern)
- `useMemo` for delta computation that shouldn't reset on re-render
- Shared storage utils in `src/lib/utils/storage.ts`
- `cleanup()` in `afterEach` for Vitest tests
- Mock localStorage with `vi.stubGlobal` for consistent test behavior

### Latest Tech Information

| Technology | Version |
|---|---|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| @supabase/supabase-js | 2.99.1 |
| @supabase/ssr | 0.9.0 |
| Vitest | 4.1.0 |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None

### Completion Notes List

- Restructured Server/Client boundary: TickerBlock now passes data as props, TickerClient renders full UI including AnimatedCount
- AnimatedCount uses CSS-only animation via `key={value}` remount pattern (avoids setState-in-effect lint error)
- `digit-roll-in` / `digit-roll-out` keyframes added to globals.css
- Existing `prefers-reduced-motion` rule in globals.css handles AC4 automatically
- Delta badge now uses `initialStoredCount` via useMemo to prevent reset on live updates
- `formatSeniority()` returns `string | null`, updated TickerClient interface accordingly
- 123/123 tests pass, lint 0 errors, typecheck clean, build succeeds

### File List

- `src/hooks/useTickerSubscription.ts` — NEW: Supabase Realtime subscription hook (AC1, AC3)
- `src/hooks/useTickerSubscription.test.ts` — NEW: Unit tests for hook (5 tests)
- `src/components/custom/AnimatedCount.tsx` — NEW: CSS digit-roll animation component (AC2, AC4)
- `src/components/custom/AnimatedCount.test.tsx` — NEW: Unit tests for AnimatedCount (6 tests)
- `src/components/custom/TickerClient.tsx` — MODIFIED: Added realtime subscription, AnimatedCount, full UI rendering
- `src/components/custom/TickerClient.test.tsx` — MODIFIED: Updated for new interface, added realtime tests
- `src/components/custom/TickerBlock.tsx` — MODIFIED: Simplified to data-fetching only, passes props
- `src/components/custom/TickerBlock.test.tsx` — MODIFIED: Updated for new prop-based interface
- `src/app/globals.css` — MODIFIED: Added digit-roll keyframes
