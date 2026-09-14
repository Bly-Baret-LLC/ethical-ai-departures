"use client"

import { useEffect } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { setStorageItem } from "@/lib/utils/storage"
import { useTickerSubscription } from "@/hooks/useTickerSubscription"
import Image from "next/image"
import { AnimatedCount } from "./AnimatedCount"

interface TickerClientProps {
  evidenceLinkedCount: number
  allegedCount: number
}

export function TickerClient({
  evidenceLinkedCount,
  allegedCount,
}: TickerClientProps) {
  const { liveCount } = useTickerSubscription()

  const hasValidLiveCount =
    typeof liveCount === "number" && Number.isFinite(liveCount)
  const displayCount = hasValidLiveCount ? liveCount : evidenceLinkedCount

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
          <div className="relative text-left">
            <div className="absolute right-0 top-0 w-[112px] sm:w-[132px] md:hidden">
              <Image
                src="/images/kafka-drawing.png"
                alt=""
                width={400}
                height={286}
                className="h-auto w-full opacity-[0.16] mix-blend-multiply brightness-[1.2]"
                aria-hidden="true"
                priority
              />
            </div>

            <div className="flex flex-col gap-4 pr-24 sm:flex-row sm:items-start sm:gap-6 sm:pr-32 md:pr-0">
              <div className="shrink-0 sm:-translate-y-[34px] md:-translate-y-[41px] lg:-translate-y-[48px]">
                <AnimatedCount
                  value={displayCount}
                  animate
                  className="font-display text-[72px] font-black uppercase leading-tight tracking-wider tabular-nums sm:text-[88px] md:text-[104px] lg:text-[120px] ticker-gradient"
                />
              </div>
              <div className="max-w-[440px]">
                <h1 className="font-serif text-base font-normal leading-snug text-text-primary sm:text-lg md:text-xl">
                  Researchers, engineers, and executives who left OpenAI,
                  Google, Anthropic, and other AI companies over safety or
                  ethics concerns.
                </h1>
                <p className="mt-2 text-sm font-medium leading-snug text-text-primary">
                  Every entry is backed by the person&apos;s own statement or
                  independent reporting.
                  {allegedCount > 0 && (
                    <span className="font-normal text-text-secondary">
                      {` ${allegedCount} disputed case${allegedCount === 1 ? " is" : "s are"} listed separately.`}
                    </span>
                  )}
                </p>
              </div>
            </div>
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
      <div className="bg-surface-primary pb-6" />
    </div>
  )
}
