"use client"

import { useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { getStorageItem, subscribeNoop } from "@/lib/utils/storage"

interface LatestActivityClientProps {
  children: React.ReactNode
}

export function LatestActivityClient({ children }: LatestActivityClientProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const hasVisited = useSyncExternalStore(
    subscribeNoop,
    () => getStorageItem(STORAGE_KEYS.HAS_VISITED),
    () => "true" // SSR: assume visited (render content for SEO crawlers)
  )

  // On mobile first-visit: hide the section visually but keep in DOM for SEO
  const isFirstVisitMobile = mounted && hasVisited === null

  return (
    <div className={isFirstVisitMobile ? "hidden md:block" : undefined}>
      {children}
    </div>
  )
}
