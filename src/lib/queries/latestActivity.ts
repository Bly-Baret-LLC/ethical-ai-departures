import { createClient } from "@/lib/supabase/server"

export interface ActivityItem {
  slug: string
  name: string
  company: string
  role: string
  departureDate: string
  createdAt: string
}

/** Fetch the most recently added published departures for the Latest Activity slot */
export async function getLatestActivity(
  limit: number = 3
): Promise<ActivityItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("slug, name, company, role, departure_date, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error

  return data.map((row) => ({
    slug: row.slug,
    name: row.name,
    company: row.company,
    role: row.role,
    departureDate: row.departure_date,
    createdAt: row.created_at,
  }))
}
