import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

/** Harden <loc> values: strip whitespace/line breaks that some crawlers reject (SITE-05). */
export function normalizeLoc(url: string): string {
  return url.replace(/\s+/g, "")
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi"

  // NOTE: there is deliberately no /profiles index entry — that route does not
  // exist (profiles are browsed on the homepage); a stale entry here returned
  // 404 to crawlers (SITE-04).
  const staticPages: MetadataRoute.Sitemap = [
    { url: normalizeLoc(siteUrl), lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: normalizeLoc(`${siteUrl}/companies`), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: normalizeLoc(`${siteUrl}/publications`), lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: normalizeLoc(`${siteUrl}/about`), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: normalizeLoc(`${siteUrl}/press`), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  try {
    const supabase = await createClient()

    // Profile pages
    const { data: profiles } = await supabase
      .from("profiles")
      .select("slug, updated_at")
      .eq("status", "published")

    const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
      url: normalizeLoc(`${siteUrl}/profiles/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    // Company pages (derived from unique companies)
    const { data: companyData } = await supabase
      .from("profiles")
      .select("company")
      .eq("status", "published")

    const uniqueCompanies = new Set((companyData ?? []).map((r) => r.company))
    const companyPages: MetadataRoute.Sitemap = Array.from(uniqueCompanies).map((name) => ({
      url: normalizeLoc(`${siteUrl}/companies/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

    return [...staticPages, ...profilePages, ...companyPages]
  } catch {
    return staticPages
  }
}
