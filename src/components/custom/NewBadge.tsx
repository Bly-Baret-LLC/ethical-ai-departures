"use client"

import { useSyncExternalStore } from "react"
import { STORAGE_KEYS } from "@/lib/constants"
import { getStorageItem, subscribeNoop } from "@/lib/utils/storage"

interface NewBadgeProps {
  createdAt: string
}

export function NewBadge({ createdAt }: NewBadgeProps) {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false)

  const lastVisitDate = useSyncExternalStore(
    subscribeNoop,
    () => getStorageItem(STORAGE_KEYS.LAST_VISIT_DATE),
    () => null
  )

  if (!mounted || !lastVisitDate) return null

  const isNew = new Date(createdAt) > new Date(lastVisitDate)
  if (!isNew) return null

  return (
    <span className="absolute right-[-8px] top-[-8px] rounded-full bg-accent-amber px-2 py-0.5 text-xs font-medium text-surface-primary">
      New
    </span>
  )
}
