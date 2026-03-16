import { getTickerStats } from "@/lib/queries/ticker"
import { getCompanies } from "@/lib/queries/companies"
import { TickerClient } from "./TickerClient"

export async function TickerBlock() {
  let stats
  let topCompanyNames: string[] = []
  try {
    stats = await getTickerStats()
  } catch (error) {
    console.error("Failed to load ticker stats:", error)
    return null
  }

  try {
    const companies = await getCompanies()
    topCompanyNames = companies.slice(0, 4).map((c) => c.company)
  } catch {
    // Fall back to no company names
  }

  return (
    <TickerClient
      totalCount={stats.totalCount}
      ninetyDayCount={stats.ninetyDayCount}
      topCompanies={topCompanyNames}
    />
  )
}
