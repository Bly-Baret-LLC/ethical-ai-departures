"use client"

import { useCallback } from "react"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import type { FilterState } from "@/hooks/useProfileFilters"
import {
  profilesToCsv,
  profilesToJson,
  buildExportFilename,
  downloadFile,
} from "@/lib/utils/export"

interface ExportButtonsProps {
  profiles: ProfileWithTags[]
  filters: FilterState
}

export function ExportButtons({ profiles, filters }: ExportButtonsProps) {
  const handleCsvExport = useCallback(() => {
    const csv = profilesToCsv(profiles)
    const filename = buildExportFilename(filters, "csv")
    downloadFile(csv, filename, "text/csv;charset=utf-8;")
  }, [profiles, filters])

  const handleJsonExport = useCallback(() => {
    const json = profilesToJson(profiles)
    const filename = buildExportFilename(filters, "json")
    downloadFile(json, filename, "application/json")
  }, [profiles, filters])

  if (profiles.length === 0) return null

  return (
    <div className="flex flex-col gap-2" role="group" aria-label="Export data">
      <button
        type="button"
        onClick={handleCsvExport}
        className="w-full rounded-md border border-border-light px-3 py-1 text-sm text-text-secondary hover:bg-surface-secondary"
      >
        Export CSV
      </button>
      <button
        type="button"
        onClick={handleJsonExport}
        className="w-full rounded-md border border-border-light px-3 py-1 text-sm text-text-secondary hover:bg-surface-secondary"
      >
        Export JSON
      </button>
    </div>
  )
}
