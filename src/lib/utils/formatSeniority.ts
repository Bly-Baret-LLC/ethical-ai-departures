/** Format a seniority breakdown record into a human-readable string.
 *  e.g., { "Safety Lead": 2, "Research Director": 1 } → "including 2 Safety Leads and 1 Research Director"
 */
const SENIORITY_LABELS: Record<string, [string, string]> = {
  senior_leadership: ["senior leader", "senior leaders"],
  researcher: ["researcher", "researchers"],
  senior: ["senior employee", "senior employees"],
  mid: ["mid-level employee", "mid-level employees"],
  junior: ["junior employee", "junior employees"],
  co_founder: ["co-founder", "co-founders"],
  director: ["director", "directors"],
  vp: ["VP", "VPs"],
  fellow: ["fellow", "fellows"],
}

function humanizeRole(role: string, count: number): string {
  const labels = SENIORITY_LABELS[role]
  if (labels) return count === 1 ? labels[0] : labels[1]
  // Fallback: convert snake_case to title case and pluralize
  const readable = role.replace(/_/g, " ")
  return count === 1 ? readable : `${readable}s`
}

export function formatSeniority(breakdown: Record<string, number>): string | null {
  const entries = Object.entries(breakdown)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)

  if (entries.length === 0) return null

  const top = entries.slice(0, 3)
  const remaining = entries.slice(3).reduce((sum, [, count]) => sum + count, 0)

  const parts = top.map(([role, count]) => {
    return `${count} ${humanizeRole(role, count)}`
  })

  if (remaining > 0) {
    parts.push(`${remaining} others`)
  }

  if (parts.length === 1) return `including ${parts[0]}`
  if (parts.length === 2) return `including ${parts[0]} and ${parts[1]}`

  const last = parts.pop()
  return `including ${parts.join(", ")}, and ${last}`
}
