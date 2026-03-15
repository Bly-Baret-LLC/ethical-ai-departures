import { createClient } from "@/lib/supabase/server"

export const revalidate = 300

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewarningcollective.org"
  let items = ""

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("predictions")
      .select("id, title, resolution_outcome, resolution_rationale, resolution_date, updated_at, profiles(name)")
      .in("status", ["confirmed", "disproven", "partially_resolved"])
      .order("updated_at", { ascending: false })
      .limit(50)

    if (data) {
      const outcomeLabel: Record<string, string> = {
        true: "Confirmed",
        false: "Disproven",
        partial: "Partially Resolved",
      }

      items = data
        .map((p) => {
          const outcome = p.resolution_outcome ? outcomeLabel[p.resolution_outcome] ?? "Resolved" : "Resolved"
          const profile = p.profiles as unknown as { name: string } | null
          const author = profile?.name ?? "Unknown"
          return `
    <item>
      <title>${escapeXml(`[${outcome}] ${p.title}`)}</title>
      <description>${escapeXml(p.resolution_rationale ?? `Prediction by ${author} has been ${outcome.toLowerCase()}.`)}</description>
      <link>${siteUrl}/predictions/${p.id}</link>
      <guid isPermaLink="true">${siteUrl}/predictions/${p.id}</guid>
      <pubDate>${new Date(p.resolution_date ?? p.updated_at).toUTCString()}</pubDate>
    </item>`
        })
        .join("")
    }
  } catch {
    // Graceful fallback
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Warning Collective · Prediction Resolutions</title>
    <description>Resolved predictions from AI safety researcher departure statements.</description>
    <link>${siteUrl}/predictions</link>
    <atom:link href="${siteUrl}/predictions/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  })
}
