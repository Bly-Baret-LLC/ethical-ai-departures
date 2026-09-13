import { createClient } from "@/lib/supabase/server"
import { profileWithTagsSchema } from "@/lib/schemas/profile"
import { isHeadlineCounted } from "@/lib/evidence"
import { countOrganizationEventsByCompanySlug } from "@/data/organization-events"

export interface CompanySummary {
  company: string
  slug: string
  count: number
  evidenceLinkedCount: number
  contextualCount: number
  allegedCount: number
  eventCount: number
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
    .select("company, motive_evidence, headline_counted")
    .eq("status", "published")

  if (error) throw error

  const counts = new Map<
    string,
    { count: number; evidenceLinkedCount: number; contextualCount: number; allegedCount: number }
  >()
  for (const row of data) {
    const current = counts.get(row.company) ?? {
      count: 0,
      evidenceLinkedCount: 0,
      contextualCount: 0,
      allegedCount: 0,
    }
    current.count++
    if (
      isHeadlineCounted({
        motiveEvidence: row.motive_evidence,
        headlineCounted: row.headline_counted,
      })
    ) {
      current.evidenceLinkedCount++
    } else if (row.motive_evidence === "contextual") {
      current.contextualCount++
    } else if (row.motive_evidence === "alleged") {
      current.allegedCount++
    }
    counts.set(row.company, current)
  }

  return Array.from(counts.entries())
    .map(([company, categoryCounts]) => ({
      company,
      slug: companySlug(company),
      ...categoryCounts,
      eventCount: countOrganizationEventsByCompanySlug(companySlug(company)),
    }))
    .sort(
      (a, b) =>
        b.evidenceLinkedCount - a.evidenceLinkedCount || b.count - a.count
    )
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
    if (!isHeadlineCounted(p)) continue
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
