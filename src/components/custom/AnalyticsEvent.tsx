"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

interface AnalyticsEventProps {
  name: string
  props?: Record<string, string | number | boolean>
}

export function AnalyticsEvent({ name, props }: AnalyticsEventProps) {
  useEffect(() => {
    trackEvent(name, props)
  }, [name, props])

  return null
}
