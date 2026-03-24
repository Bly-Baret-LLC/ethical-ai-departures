"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

type PlausibleFn = (
  eventName: string,
  options?: {
    props?: Record<string, unknown>
    u?: string
  }
) => void

function getPlausible() {
  return (window as Window & { plausible?: PlausibleFn }).plausible
}

export function PlausiblePageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasTrackedInitialLoad = useRef(false)

  useEffect(() => {
    if (!pathname) {
      return
    }

    if (!hasTrackedInitialLoad.current) {
      hasTrackedInitialLoad.current = true
      return
    }

    const query = searchParams.toString()
    const url = query ? `${pathname}?${query}` : pathname

    getPlausible()?.("pageview", { u: url })
  }, [pathname, searchParams])

  return null
}
