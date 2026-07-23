import { Suspense } from "react"
import { getPublishedProfiles } from "@/lib/queries/profiles"
import { ProfileBrowser } from "@/components/custom/ProfileBrowser"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import { TickerBlock } from "@/components/custom/TickerBlock"
import { SubmitDepartureButton } from "@/components/custom/SubmitDepartureButton"
import { PredictionSpotlight } from "@/components/custom/PredictionSpotlight"

// Revalidate at the shorter ticker interval (profiles use 300s but ticker uses 60s)
export const revalidate = 60

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi").trim()

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ethical AI Departures",
  url: siteUrl,
  description:
    "Documenting departures and removals linked to AI safety, ethics, governance, and accountability, labeled by evidence type. An open record for journalists, researchers, and the public.",
}

export default async function HomePage() {
  let profiles: ProfileWithTags[] = []
  try {
    profiles = await getPublishedProfiles()
  } catch (error) {
    console.error("Failed to load profiles:", error)
  }

  return (
    <main id="main-content" className="min-h-screen bg-surface-primary">
      <TickerBlock />
      <PredictionSpotlight />
      <section
        id="profiles"
        aria-label="Departures"
        className="mx-auto max-w-6xl px-6 py-8"
      >
        <Suspense>
          <ProfileBrowser profiles={profiles} />
        </Suspense>
      </section>
      <SubmitDepartureButton />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
    </main>
  )
}
