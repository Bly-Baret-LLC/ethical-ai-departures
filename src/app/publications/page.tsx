import type { Metadata } from "next"
import { Suspense } from "react"
import {
  getPublicationsWithProfiles,
  getPublicationCountsByConcern,
} from "@/lib/queries/publications"
import { getPredictions } from "@/lib/queries/predictions"
import type { PublicationWithProfile } from "@/lib/schemas/publication"
import type { PredictionWithProfile } from "@/lib/schemas/prediction"
import { PublicationsTabs } from "@/components/custom/PublicationsTabs"
import { PredictionSpotlight } from "@/components/custom/PredictionSpotlight"

export const revalidate = 300

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi").trim()

export const metadata: Metadata = {
  title: "AI Safety Writings, Forecasts & Warnings",
  description: "Papers, essays, reports, forecasts, and public warnings from people in the Ethical AI Departures record.",
  alternates: {
    canonical: `${siteUrl}/publications`,
    types: {
      "application/rss+xml": `${siteUrl}/publications/feed.xml`,
    },
  },
}

export default async function ThemesAndWritingsPage() {
  let publications: PublicationWithProfile[] = []
  let pubCountsByConcern: { tagName: string; tagSlug: string; count: number }[] = []
  let predictions: PredictionWithProfile[] = []

  try {
    ;[publications, pubCountsByConcern, predictions] =
      await Promise.all([
        getPublicationsWithProfiles(),
        getPublicationCountsByConcern(),
        getPredictions(),
      ])
  } catch {
    // Graceful fallback
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Publications
      </h1>

      <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
        <p>
          Papers, essays, and books on AI’s risks, impacts, and governance,
          by people in the record.
        </p>
      </div>

      <Suspense>
        <PublicationsTabs
          publications={publications}
          concernCounts={pubCountsByConcern}
          predictions={predictions}
          spotlight={<PredictionSpotlight predictions={predictions} />}
        />
      </Suspense>
    </main>
  )
}
