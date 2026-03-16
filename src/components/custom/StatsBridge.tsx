import { getStatsBridgeData } from "@/lib/queries/stats"

export async function StatsBridge() {
  let stats
  try {
    stats = await getStatsBridgeData()
  } catch (error) {
    console.error("Failed to load stats bridge data:", error)
    return null
  }

  const fragments = [
    `${stats.companyCount} companies`,
    stats.topConcern
      ? `Most common concern: ${stats.topConcern}`
      : null,
    `${stats.seniorPct}% senior roles`,
  ].filter(Boolean) as string[]

  return (
    <div className="w-full border-t border-accent-red/20 bg-surface-secondary">
      <p
        role="status"
        aria-label="Key departure statistics"
        className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-1 px-6 py-3 text-center text-sm font-medium text-text-secondary md:h-12 md:flex-row md:gap-0 md:py-0"
      >
        {fragments.map((fragment, i) => (
          <span key={i}>
            {i > 0 && (
              <span aria-hidden="true" className="mx-2 hidden md:inline">
                ·
              </span>
            )}
            {fragment}
          </span>
        ))}
      </p>
    </div>
  )
}
