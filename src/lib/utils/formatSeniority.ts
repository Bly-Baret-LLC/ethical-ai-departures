/** Format a seniority breakdown record into a human-readable string.
 *  e.g., { "Safety Lead": 2, "Research Director": 1 } → "including 2 Safety Leads and 1 Research Director"
 */
export function formatSeniority(breakdown: Record<string, number>): string | null {
  const entries = Object.entries(breakdown)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)

  if (entries.length === 0) return null

  const top = entries.slice(0, 3)
  const remaining = entries.slice(3).reduce((sum, [, count]) => sum + count, 0)

  const parts = top.map(([role, count]) => {
    const label = count === 1 ? role : `${role}s`
    return `${count} ${label}`
  })

  if (remaining > 0) {
    parts.push(`${remaining} others`)
  }

  if (parts.length === 1) return `including ${parts[0]}`
  if (parts.length === 2) return `including ${parts[0]} and ${parts[1]}`

  const last = parts.pop()
  return `including ${parts.join(", ")}, and ${last}`
}
