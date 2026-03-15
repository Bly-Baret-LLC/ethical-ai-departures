import { createClient } from "@/lib/supabase/server"

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
    .select("concern_tag_id, profiles(company, departure_date, status)")

  if (!associations?.length) return tags.map((t) => ({
    slug: t.slug,
    name: t.name,
    count: 0,
    recentCount: 0,
    trend: "stable" as const,
    companies: [],
  }))

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const cutoff = ninetyDaysAgo.toISOString().split("T")[0]

  const themes: ThemeData[] = tags.map((tag) => {
    const tagAssocs = associations.filter((a) => a.concern_tag_id === tag.id)
    const publishedAssocs = tagAssocs.filter((a) => {
      const profile = a.profiles as unknown as { company: string; departure_date: string; status: string } | null
      return profile?.status === "published"
    })

    const companyCounts = new Map<string, number>()
    let recentCount = 0

    for (const a of publishedAssocs) {
      const profile = a.profiles as unknown as { company: string; departure_date: string; status: string }
      companyCounts.set(profile.company, (companyCounts.get(profile.company) ?? 0) + 1)
      if (profile.departure_date >= cutoff) recentCount++
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
