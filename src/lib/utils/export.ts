import type { ProfileWithTags } from "@/lib/schemas/profile"
import type { FilterState } from "@/hooks/useProfileFilters"

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function buildPermalink(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/profiles/${slug}`
  }
  return `/profiles/${slug}`
}

export function profilesToCsv(profiles: ProfileWithTags[]): string {
  const headers = [
    "Name",
    "Company",
    "Role",
    "Departure Date",
    "Stated Reason",
    "Concern Tags",
    "Permalink",
  ]

  const rows = profiles.map((p) => [
    escapeCsvField(p.name),
    escapeCsvField(p.company),
    escapeCsvField(p.role),
    p.departureDate,
    escapeCsvField(p.statedReason ?? ""),
    escapeCsvField(p.concernTags.map((t) => t.name).join("; ")),
    buildPermalink(p.slug),
  ])

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
}

export function profilesToJson(profiles: ProfileWithTags[]): string {
  const data = profiles.map((p) => ({
    name: p.name,
    company: p.company,
    role: p.role,
    departureDate: p.departureDate,
    statedReason: p.statedReason,
    concernTags: p.concernTags.map((t) => t.name),
    permalink: buildPermalink(p.slug),
  }))

  return JSON.stringify(data, null, 2)
}

export function buildExportFilename(filters: FilterState, ext: "csv" | "json"): string {
  const parts = ["ethical-ai-departures"]

  if (filters.company.length === 1) {
    parts.push(filters.company[0].toLowerCase().replace(/\s+/g, "-"))
  }
  if (filters.year.length === 1) {
    parts.push(filters.year[0])
  }
  if (filters.concern.length === 1) {
    parts.push(filters.concern[0].toLowerCase().replace(/\s+/g, "-"))
  }

  return `${parts.join("-")}.${ext}`
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
