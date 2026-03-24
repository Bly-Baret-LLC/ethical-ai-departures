"use client"

import { useEffect, useRef } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { setStorageItem } from "@/lib/utils/storage"

const MIN_REPORTABLE_ACTIVE_SECONDS = 5

type PlausibleFn = (
  eventName: string,
  options?: {
    props?: Record<string, unknown>
  }
) => void

function getPlausible() {
  return (window as Window & { plausible?: PlausibleFn }).plausible
}

function getActiveBucket(activeSeconds: number) {
  if (activeSeconds < 10) return "under_10s"
  if (activeSeconds < 30) return "10_to_29s"
  if (activeSeconds < 60) return "30_to_59s"
  if (activeSeconds < 120) return "1_to_2m"
  if (activeSeconds < 300) return "2_to_5m"

  return "5m_plus"
}

/**
 * Stores the latest visit timestamp for UI state and reports active
 * engagement time to Plausible when the tab is hidden or closed.
 */
export function VisitTracker() {
  const activeStartAtRef = useRef<number | null>(null)
  const accumulatedActiveMsRef = useRef(0)
  const lastReportedSecondsRef = useRef(0)

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LAST_VISIT_DATE, new Date().toISOString())
  }, [])

  useEffect(() => {
    const startActiveTimer = () => {
      if (document.visibilityState === "hidden" || activeStartAtRef.current !== null) {
        return
      }

      activeStartAtRef.current = Date.now()
    }

    const stopActiveTimer = () => {
      if (activeStartAtRef.current === null) {
        return
      }

      accumulatedActiveMsRef.current += Date.now() - activeStartAtRef.current
      activeStartAtRef.current = null
    }

    const reportActiveEngagement = () => {
      stopActiveTimer()

      const activeSeconds = Math.round(accumulatedActiveMsRef.current / 1000)
      if (
        activeSeconds < MIN_REPORTABLE_ACTIVE_SECONDS ||
        activeSeconds === lastReportedSecondsRef.current
      ) {
        return
      }

      lastReportedSecondsRef.current = activeSeconds
      getPlausible()?.("Engagement Session", {
        props: {
          active_bucket: getActiveBucket(activeSeconds),
          active_seconds: activeSeconds,
        },
      })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        reportActiveEngagement()
        return
      }

      startActiveTimer()
    }

    startActiveTimer()

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", reportActiveEngagement)

    return () => {
      reportActiveEngagement()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", reportActiveEngagement)
    }
  }, [])

  return null
}
