import { getTickerStats } from "@/lib/queries/ticker"
import { TickerClient } from "./TickerClient"

export async function TickerBlock() {
  let stats
  try {
    stats = await getTickerStats()
  } catch (error) {
    console.error("Failed to load ticker stats:", error)
    return null
  }

  return (
    <TickerClient
      documentedCount={stats.documentedCount}
      evidenceLinkedCount={stats.totalCount}
      contextualCount={stats.contextualCount}
      allegedCount={stats.allegedCount}
    />
  )
}
