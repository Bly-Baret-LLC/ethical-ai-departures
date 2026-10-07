import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { concernGuides } from "@/data/concern-guides"

/** Harden <loc> values: strip whitespace/line breaks that some crawlers reject (SITE-05). */
export function normalizeLoc(url: string): string {
  return url.replace(/\s+/g, "")
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi").trim()

  // NOTE: there is deliberately no /profiles index entry — that route does not
  // exist (profiles are browsed on the homepage); a stale entry here returned
  // 404 to crawlers (SITE-04).
  const staticPages: MetadataRoute.Sitemap = [
    { url: normalizeLoc(siteUrl), changeFrequency: "daily", priority: 1 },
    { url: normalizeLoc(`${siteUrl}/companies`), changeFrequency: "weekly", priority: 0.8 },
    { url: normalizeLoc(`${siteUrl}/organizational-events`), changeFrequency: "monthly", priority: 0.7 },
    { url: normalizeLoc(`${siteUrl}/publications`), changeFrequency: "weekly", priority: 0.8 },
    { url: normalizeLoc(`${siteUrl}/themes`), changeFrequency: "weekly", priority: 0.7 },
    { url: normalizeLoc(`${siteUrl}/concerns`), changeFrequency: "weekly", priority: 0.8 },
    ...concernGuides.map(({ slug }) => ({
      url: normalizeLoc(`${siteUrl}/concerns/${slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: normalizeLoc(`${siteUrl}/widgets`), changeFrequency: "monthly", priority: 0.4 },
    { url: normalizeLoc(`${siteUrl}/about`), changeFrequency: "monthly", priority: 0.5 },
    { url: normalizeLoc(`${siteUrl}/press`), changeFrequency: "monthly", priority: 0.5 },
    { url: normalizeLoc(`${siteUrl}/editorial-standards`), changeFrequency: "monthly", priority: 0.5 },
    { url: normalizeLoc(`${siteUrl}/corrections`), changeFrequency: "monthly", priority: 0.5 },
    { url: normalizeLoc(`${siteUrl}/contact`), changeFrequency: "yearly", priority: 0.3 },
  ]

  try {
    const supabase = await createClient()

    // Profiles provide both their own canonical update dates and the latest
    // meaningful update date for each derived company page.
    const { data: profiles } = await supabase
      .from("profiles")
      .select("slug, company, updated_at")
      .eq("status", "published")

    // Detail routes use prediction IDs, not IDs from the publications table.
    // Only discover reviewed records attached to published profiles.
    const { data: predictions } = await supabase
      .from("predictions")
      .select("id, updated_at, profiles!inner(status)")
      .neq("status", "pending_review")
      .eq("profiles.status", "published")

    const predictionPages: MetadataRoute.Sitemap = (predictions ?? []).map((p) => ({
      url: normalizeLoc(`${siteUrl}/publications/${p.id}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
      url: normalizeLoc(`${siteUrl}/profiles/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    const companyUpdates = new Map<string, Date>()
    for (const profile of profiles ?? []) {
      const updatedAt = new Date(profile.updated_at)
      const current = companyUpdates.get(profile.company)
      if (!current || updatedAt > current) {
        companyUpdates.set(profile.company, updatedAt)
      }
    }

    const companyPages: MetadataRoute.Sitemap = Array.from(companyUpdates).map(
      ([name, lastModified]) => ({
        url: normalizeLoc(`${siteUrl}/companies/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    )

    return [...staticPages, ...profilePages, ...companyPages, ...predictionPages]
  } catch {
    return staticPages
  }
}
