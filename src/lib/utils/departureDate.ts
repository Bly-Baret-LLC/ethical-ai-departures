export type DatePrecision = "day" | "month" | "year"

/** Never expose a sorting anchor as a more precise event date. */
export function departureDateIso(date: string, precision: DatePrecision = "day"): string {
  return date.slice(0, precision === "year" ? 4 : precision === "month" ? 7 : 10)
}

export function formatDepartureDate(date: string, precision: DatePrecision = "day"): string {
  if (precision === "year") return departureDateIso(date, precision)
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    ...(precision === "day" ? { day: "numeric" as const } : {}),
  })
}

/**
 * Count only when the earliest possible departure is within the window.
 * A published departure has already happened; its month/year need not have
 * finished. Overlapping uncertain periods are excluded, as are future dates.
 */
export function isDepartureInWindow(
  date: string,
  precision: DatePrecision = "day",
  cutoff: string,
  through: string
): boolean {
  const earliest = precision === "year" ? `${date.slice(0, 4)}-01-01`
    : precision === "month" ? `${date.slice(0, 7)}-01` : date
  return earliest >= cutoff && earliest <= through
}
