import { createClient } from "@/lib/supabase/server"
import type { DatePrecision } from "@/lib/utils/departureDate"

export interface ActivityItem {
  slug: string
  name: string
  company: string
  role: string
  departureDate: string
  departureDatePrecision: DatePrecision
  createdAt: string
}

/** Fetch the most recent published departures by departure date for the Latest Activity slot */
export async function getLatestActivity(
  limit: number = 3
): Promise<ActivityItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("slug, name, company, role, departure_date, departure_date_precision, created_at")
    .eq("status", "published")
    .order("departure_date", { ascending: false })
    .limit(limit)

  if (error) throw error

  return data.map((row) => ({
    slug: row.slug,
    name: row.name,
    company: row.company,
    role: row.role,
    departureDate: row.departure_date,
    departureDatePrecision: row.departure_date_precision ?? "day",
    createdAt: row.created_at,
  }))
}
