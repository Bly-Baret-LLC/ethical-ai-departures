"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { getStorageItem, setStorageItem, subscribeNoop } from "@/lib/utils/storage"
import { useTickerSubscription } from "@/hooks/useTickerSubscription"
import { AnimatedCount } from "./AnimatedCount"

interface TickerClientProps {
  totalCount: number
  ninetyDayCount: number
  seniorityText: string | null
}

export function TickerClient({ totalCount, ninetyDayCount, seniorityText }: TickerClientProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)
  const [explainerDismissed, setExplainerDismissed] = useState(false)
  const { liveCount } = useTickerSubscription()

  // Use live count from Realtime if available, otherwise SSR count
  const displayCount = liveCount ?? totalCount

  // Read dismissed status from localStorage via useSyncExternalStore
  const dismissedInStorage = useSyncExternalStore(
    subscribeNoop,
    () => getStorageItem(STORAGE_KEYS.TICKER_EXPLAINER_DISMISSED),
    () => "true"
  )

  // Capture the initial stored count at mount time for delta calculation.
  // useMemo ensures this doesn't reset when liveCount changes.
  const initialStoredCount = useMemo(() => {
    if (typeof window === "undefined") return null
    const lastCountStr = getStorageItem(STORAGE_KEYS.LAST_COUNT)
    if (lastCountStr === null) return null
    const parsed = parseInt(lastCountStr, 10)
    return isNaN(parsed) ? null : parsed
  }, [])

  // Delta is always relative to what was stored when the page loaded
  const delta = initialStoredCount !== null && displayCount > initialStoredCount
    ? displayCount - initialStoredCount
    : 0

  const showExplainer =
    mounted && dismissedInStorage === null && !explainerDismissed

  // Write-only effect: update localStorage when display count changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LAST_COUNT, String(displayCount))
    setStorageItem(STORAGE_KEYS.HAS_VISITED, "true")
  }, [displayCount])

  function handleDismissExplainer() {
    setExplainerDismissed(true)
    setStorageItem(STORAGE_KEYS.TICKER_EXPLAINER_DISMISSED, "true")
  }

  return (
    <div className="relative">
      <section
        aria-label="Departure ticker"
        className="flex min-h-[25vh] w-full flex-col items-center justify-center bg-surface-inverse px-6 py-24"
      >
        <h1 className="text-center font-sans text-text-inverse">
          <AnimatedCount
            value={displayCount}
            animate={liveCount !== null}
            className="block text-[64px] font-extrabold leading-none tabular-nums sm:text-[72px] md:text-[80px] lg:text-[84px]"
          />
          <span className="mt-2 block text-base font-normal opacity-80">
            AI researchers have left major companies over safety concerns
          </span>
        </h1>
        {(ninetyDayCount > 0 || seniorityText) && (
          <p className="mt-4 text-center text-sm text-text-inverse/60">
            {ninetyDayCount > 0 && (
              <span>{ninetyDayCount} in the last 90 days</span>
            )}
            {ninetyDayCount > 0 && seniorityText && (
              <span> · </span>
            )}
            {seniorityText && <span>{seniorityText}</span>}
          </p>
        )}
      </section>
      {mounted && (
        <div className="flex flex-col items-center bg-surface-inverse pb-6">
          {delta > 0 && (
            <span
              aria-label={`+${delta} new departures since your last visit`}
              className="inline-block rounded-full bg-accent-amber/20 px-3 py-1 text-sm font-medium text-accent-amber"
            >
              +{delta} since your last visit
            </span>
          )}
          {showExplainer && (
            <div className="mt-4 max-w-xl px-6 text-center">
              <p className="text-sm text-text-inverse/60">
                This count tracks verified safety-motivated departures from
                major AI companies — researchers, engineers, and leaders who
                left over concerns about how AI is being developed.
              </p>
              <button
                onClick={handleDismissExplainer}
                className="mt-2 text-xs text-text-inverse/40 underline hover:text-text-inverse/60"
              >
                Got it, don&apos;t show again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
