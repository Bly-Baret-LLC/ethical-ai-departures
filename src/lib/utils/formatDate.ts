const DAY_MS = 86_400_000

/** Parse "YYYY-MM-DD" as local date (avoids UTC midnight timezone shift) */
function parseLocalDate(dateString: string): Date {
  const [y, m, d] = dateString.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Format a date string as a human-readable relative timestamp.
 *
 * - Today → "Today"
 * - Yesterday → "Yesterday"
 * - 2–6 days → "X days ago"
 * - 1–4 weeks → "X weeks ago"
 * - >30 days → "Jan 15, 2026" (absolute)
 */
export function formatRelativeDate(dateString: string, now?: Date): string {
  const date = parseLocalDate(dateString)
  const reference = now ?? new Date()

  // Strip time components for day-level comparison
  const refDay = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate()
  )

  const diffMs = refDay.getTime() - date.getTime()
  const diffDays = Math.round(diffMs / DAY_MS)

  if (diffDays <= 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`

  const diffWeeks = Math.floor(diffDays / 7)
  if (diffDays <= 30) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
