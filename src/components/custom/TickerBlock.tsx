import { getTickerStats } from "@/lib/queries/ticker"
import { formatSeniority } from "@/lib/utils/formatSeniority"
import { TickerClient } from "./TickerClient"

export async function TickerBlock() {
  let stats
  try {
    stats = await getTickerStats()
  } catch (error) {
    console.error("Failed to load ticker stats:", error)
    return null
  }

  const seniorityText = formatSeniority(stats.seniorityBreakdown)

  return (
    <TickerClient
      totalCount={stats.totalCount}
      ninetyDayCount={stats.ninetyDayCount}
      seniorityText={seniorityText}
    />
  )
}
