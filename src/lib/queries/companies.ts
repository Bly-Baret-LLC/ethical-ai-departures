import { createClient } from "@/lib/supabase/server"
import { profileWithTagsSchema } from "@/lib/schemas/profile"

export interface CompanySummary {
  company: string
  slug: string
  count: number
}

export interface CompanyDetail {
  company: string
  slug: string
  profiles: ReturnType<typeof profileWithTagsSchema.parse>[]
  concernBreakdown: { name: string; slug: string; count: number }[]
}

function companySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

/** Fetch all companies with departure counts, sorted by count descending */
export async function getCompanies(): Promise<CompanySummary[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("company")
    .eq("status", "published")

  if (error) throw error

  const counts = new Map<string, number>()
  for (const row of data) {
    counts.set(row.company, (counts.get(row.company) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([company, count]) => ({ company, slug: companySlug(company), count }))
    .sort((a, b) => b.count - a.count)
}

/** Fetch a company's profiles by slug. Returns null if no profiles found. */
export async function getCompanyBySlug(slug: string): Promise<CompanyDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      profile_concern_tags(
        concern_tags(id, name, slug)
      )
    `)
    .eq("status", "published")
    .order("departure_date", { ascending: false })

  if (error) throw error

  // Filter profiles whose company slug matches
  const allProfiles = data.map((row) => profileWithTagsSchema.parse(row))
  const profiles = allProfiles.filter((p) => companySlug(p.company) === slug)

  if (profiles.length === 0) return null

  // Build concern breakdown
  const concernMap = new Map<string, { name: string; slug: string; count: number }>()
  for (const p of profiles) {
    for (const tag of p.concernTags) {
      const existing = concernMap.get(tag.slug)
      if (existing) {
        existing.count++
      } else {
        concernMap.set(tag.slug, { name: tag.name, slug: tag.slug, count: 1 })
      }
    }
  }

  return {
    company: profiles[0].company,
    slug,
    profiles,
    concernBreakdown: Array.from(concernMap.values()).sort((a, b) => b.count - a.count),
  }
}
