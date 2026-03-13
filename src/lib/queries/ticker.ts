import { createClient } from "@/lib/supabase/server"
import { tickerStatsSchema } from "@/lib/schemas/profile"

/** Fetch the current ticker stats (single row) */
export async function getTickerStats() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("ticker_stats")
    .select("*")
    .single()

  if (error) throw error
  return tickerStatsSchema.parse(data)
}
