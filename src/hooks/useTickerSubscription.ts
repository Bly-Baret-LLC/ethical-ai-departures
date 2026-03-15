"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/browser"
import { tickerStatsSchema } from "@/lib/schemas/profile"

export function useTickerSubscription() {
  const [liveCount, setLiveCount] = useState<number | null>(null)

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
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { liveCount }
}
