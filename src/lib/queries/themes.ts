import { createClient } from "@/lib/supabase/server"
import { isHeadlineCounted, type MotiveEvidence } from "@/lib/evidence"
import { isDepartureInWindow, type DatePrecision } from "@/lib/utils/departureDate"

interface ThemeProfile {
  company: string
  departure_date: string
  departure_date_precision?: DatePrecision
  status: string
  motive_evidence: MotiveEvidence
  headline_counted: boolean
}

export interface ThemeData {
  slug: string
  name: string
  count: number
  recentCount: number
  trend: "up" | "down" | "stable"
  companies: Array<{ company: string; count: number }>
}

export async function getThemeData(): Promise<ThemeData[]> {
  const supabase = await createClient()

  // Get all concern tags with profile counts
  const { data: tags } = await supabase
    .from("concern_tags")
    .select("id, name, slug")
    .order("name")

  if (!tags?.length) return []

  // Get all profile-tag associations with profile data
  const { data: associations } = await supabase
    .from("profile_concern_tags")
    .select("concern_tag_id, profiles(company, departure_date, departure_date_precision, status, motive_evidence, headline_counted)")

  if (!associations?.length) return tags.map((t) => ({
    slug: t.slug,
    name: t.name,
    count: 0,
    recentCount: 0,
    trend: "stable" as const,
    companies: [],
  }))

  const now = Date.now()
  const cutoff = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const through = new Date(now).toISOString().slice(0, 10)

  const themes: ThemeData[] = tags.map((tag) => {
    const tagAssocs = associations.filter((a) => a.concern_tag_id === tag.id)
    const publishedAssocs = tagAssocs.filter((a) => {
      const profile = a.profiles as unknown as ThemeProfile | null
      return profile?.status === "published" && isHeadlineCounted({
        motiveEvidence: profile.motive_evidence,
        headlineCounted: profile.headline_counted,
      })
    })

    const companyCounts = new Map<string, number>()
    let recentCount = 0

    for (const a of publishedAssocs) {
      const profile = a.profiles as unknown as ThemeProfile
      companyCounts.set(profile.company, (companyCounts.get(profile.company) ?? 0) + 1)
      if (isDepartureInWindow(profile.departure_date, profile.departure_date_precision,
        cutoff, through)) recentCount++
    }

    const companies = Array.from(companyCounts.entries())
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)

    const total = publishedAssocs.length
    const trend: "up" | "down" | "stable" =
      recentCount > total * 0.4 ? "up" : recentCount === 0 && total > 0 ? "down" : "stable"

    return {
      slug: tag.slug,
      name: tag.name,
      count: total,
      recentCount,
      trend,
      companies,
    }
  })

  return themes.filter((t) => t.count > 0).sort((a, b) => b.count - a.count)
}
