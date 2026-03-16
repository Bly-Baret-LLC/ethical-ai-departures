"use client"

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { getStorageItem, setStorageItem, subscribeNoop } from "@/lib/utils/storage"
import { useTickerSubscription } from "@/hooks/useTickerSubscription"
import { AnimatedCount } from "./AnimatedCount"
import { Footsteps } from "./Footsteps"

interface TickerClientProps {
  totalCount: number
  ninetyDayCount: number
  topCompanies?: string[]
}

export function TickerClient({ totalCount, ninetyDayCount, topCompanies = [] }: TickerClientProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)
  const { liveCount } = useTickerSubscription()
  const [showFootsteps, setShowFootsteps] = useState(false)

  const displayCount = liveCount ?? totalCount

  const initialStoredCount = useMemo(() => {
    if (typeof window === "undefined") return null
    const lastCountStr = getStorageItem(STORAGE_KEYS.LAST_COUNT)
    if (lastCountStr === null) return null
    const parsed = parseInt(lastCountStr, 10)
    return isNaN(parsed) ? null : parsed
  }, [])

  const delta = initialStoredCount !== null && displayCount > initialStoredCount
    ? displayCount - initialStoredCount
    : 0

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LAST_COUNT, String(displayCount))
    setStorageItem(STORAGE_KEYS.HAS_VISITED, "true")
  }, [displayCount])

  const handleCountComplete = useCallback(() => {
    setShowFootsteps(true)
  }, [])

  return (
    <div className="relative">
      <section
        aria-label="Departure ticker"
        className="relative w-full border-[3px] border-accent-red bg-[#f0ebe0] shadow-[inset_0_0_0_5px_#f0ebe0,inset_0_0_0_6px_#1c1917] overflow-hidden"
      >
        <Footsteps active={showFootsteps} />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center px-6 py-8 sm:py-10">
          <div className="text-left">
            <h1 className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="shrink-0">
                <AnimatedCount
                  value={displayCount}
                  animate={liveCount !== null}
                  className="font-display text-[72px] font-black uppercase leading-tight tracking-wider tabular-nums sm:text-[88px] md:text-[104px] lg:text-[120px] ticker-gradient"
                  onComplete={handleCountComplete}
                />
                {ninetyDayCount > 0 && (
                  <p className="mt-2 text-sm text-text-primary/60">
                    {ninetyDayCount} in the last 90 days
                  </p>
                )}
              </div>
              <span className="font-serif text-base font-normal leading-snug text-text-primary sm:text-lg md:text-xl max-w-[400px]">
                {topCompanies.length > 0
                  ? <>AI employees and counting have walked away from {topCompanies.slice(0, -1).join(", ")}{topCompanies.length > 1 ? `, and ${topCompanies[topCompanies.length - 1]}` : topCompanies[0]} over ethical concerns</>
                  : "AI employees and counting have walked away from major companies over ethical concerns"
                }
              </span>
            </h1>
          </div>
        </div>
      </section>
      <div className="flex flex-col items-center bg-surface-primary pb-6">
        {mounted && delta > 0 && (
          <span
            aria-label={`+${delta} new departures since your last visit`}
            className="inline-block rounded-full bg-accent-amber/20 px-3 py-1 text-sm font-medium text-accent-amber"
          >
            +{delta} since your last visit
          </span>
        )}
      </div>
    </div>
  )
}
