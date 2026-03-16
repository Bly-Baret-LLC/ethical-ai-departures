"use client"

import { useEffect, useMemo, useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { getStorageItem, setStorageItem, subscribeNoop } from "@/lib/utils/storage"
import { useTickerSubscription } from "@/hooks/useTickerSubscription"
import Image from "next/image"
import { AnimatedCount } from "./AnimatedCount"

interface TickerClientProps {
  totalCount: number
  ninetyDayCount: number
  topCompanies?: string[]
}

export function TickerClient({ totalCount, ninetyDayCount, topCompanies = [] }: TickerClientProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)
  const { liveCount } = useTickerSubscription()

  // Use live count from Realtime if available, otherwise SSR count
  const displayCount = liveCount ?? totalCount

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

  // Write-only effect: update localStorage when display count changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LAST_COUNT, String(displayCount))
    setStorageItem(STORAGE_KEYS.HAS_VISITED, "true")
  }, [displayCount])

  return (
    <div className="relative">
      <section
        aria-label="Departure ticker"
        className="relative w-full border-[3px] border-accent-red bg-[#f0ebe0] shadow-[inset_0_0_0_5px_#f0ebe0,inset_0_0_0_6px_#1c1917] overflow-hidden"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center px-6 py-8 sm:py-10 md:grid-cols-[1fr_auto]">
          <div className="text-left">
            <h1 className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="shrink-0">
                <AnimatedCount
                  value={displayCount}
                  animate={liveCount !== null}
                  className="font-display text-[72px] font-black uppercase leading-[0.9] tracking-wider tabular-nums sm:text-[88px] md:text-[104px] lg:text-[120px] ticker-gradient"
                  digits={String(displayCount).length}
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
          {/* Kafka ink drawing — right column */}
          <div className="hidden items-start justify-start md:flex">
            <Image
              src="/images/kafka-drawing.png"
              alt=""
              width={400}
              height={286}
              className="opacity-[0.18] mix-blend-multiply brightness-[1.2] w-full max-w-[280px]"
              aria-hidden="true"
              priority
            />
          </div>
        </div>
      </section>
      {mounted && (
        <div className="flex flex-col items-center bg-surface-primary pb-6">
          {delta > 0 && (
            <span
              aria-label={`+${delta} new departures since your last visit`}
              className="inline-block rounded-full bg-accent-amber/20 px-3 py-1 text-sm font-medium text-accent-amber"
            >
              +{delta} since your last visit
            </span>
          )}
        </div>
      )}
    </div>
  )
}
