import { LatestActivitySlot } from "@/components/custom/LatestActivitySlot"
import { ProfilePreview } from "@/components/custom/ProfilePreview"
import { StatsBridge } from "@/components/custom/StatsBridge"
import { TickerBlock } from "@/components/custom/TickerBlock"
import { VisitTracker } from "@/components/custom/VisitTracker"

// Matches TICKER_REVALIDATE_SECONDS — inlined because Next.js requires
// statically analyzable segment config values (cannot use imported variables).
export const revalidate = 60

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewarningcollective.org"

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Warning Collective",
  url: siteUrl,
  description:
    "Tracking safety-motivated departures from AI companies. A public accountability resource for journalists, researchers, and the concerned public.",
}

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-surface-primary">
      <VisitTracker />
      <TickerBlock />
      <StatsBridge />
      <LatestActivitySlot />
      <ProfilePreview />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </main>
  )
}
