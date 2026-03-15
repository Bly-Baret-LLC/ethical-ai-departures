import { createClient } from "@/lib/supabase/server"

export interface StatsBridgeData {
  companyCount: number
  topConcern: string | null
  seniorPct: number
}

const SENIOR_KEYWORDS = ["Lead", "Director", "Head", "Principal", "Senior"]

/** Fetch aggregated stats for the stats bridge strip */
export async function getStatsBridgeData(): Promise<StatsBridgeData> {
  const supabase = await createClient()

  // Run both queries in parallel — they're independent
  const [profilesResult, concernsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("company, role")
      .eq("status", "published"),
    supabase
      .from("profile_concern_tags")
      .select("concern_tag:concern_tags(name), profile:profiles!inner(status)")
      .eq("profile.status", "published"),
  ])

  if (profilesResult.error) throw profilesResult.error
  if (concernsResult.error) throw concernsResult.error

  const profiles = profilesResult.data
  const concerns = concernsResult.data

  // Compute company count
  const uniqueCompanies = new Set(profiles.map((p) => p.company))
  const companyCount = uniqueCompanies.size

  // Compute senior role percentage
  const seniorCount = profiles.filter((p) =>
    SENIOR_KEYWORDS.some((kw) => p.role.includes(kw))
  ).length
  const seniorPct =
    profiles.length > 0 ? Math.round((seniorCount / profiles.length) * 100) : 0

  // Find most common concern (already filtered to published profiles server-side)
  const concernCounts = new Map<string, number>()
  for (const c of concerns) {
    const tag = c.concern_tag as unknown as { name: string } | null
    if (tag) {
      concernCounts.set(tag.name, (concernCounts.get(tag.name) ?? 0) + 1)
    }
  }
  let topConcern: string | null = null
  let maxCount = 0
  for (const [name, count] of concernCounts) {
    if (count > maxCount) {
      maxCount = count
      topConcern = name
    }
  }

  return { companyCount, topConcern, seniorPct }
}
