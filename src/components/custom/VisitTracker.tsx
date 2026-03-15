"use client"

import { useEffect } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { setStorageItem } from "@/lib/utils/storage"

/**
 * Writes the current timestamp to localStorage on mount.
 * Used by NewBadge to determine which profiles are "new" since last visit.
 * Renders nothing — side-effect only.
 */
export function VisitTracker() {
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LAST_VISIT_DATE, new Date().toISOString())
  }, [])

  return null
}
