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

export const revalidate = 300

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi"

export const metadata: Metadata = {
  title: "AI Safety Writings & Predictions — Papers, Essays, and Prediction Tracker",
  description: "Papers, essays, and public statements from researchers who departed leading AI companies, alongside a prediction tracker currently under editorial review.",
  alternates: {
    canonical: `${siteUrl}/publications`,
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
          Across dozens of departures from OpenAI, Google, xAI, Anthropic, Meta, and Stability AI,
          the same concerns surface again and again across their writings. Safety teams are dissolved or absorbed
          into product work. Deployment timelines are compressed past the point where
          meaningful evaluation is possible. Researchers who raise objections internally
          find their concerns deprioritized, and sometimes face retaliation for speaking up.
        </p>
        <p>
          These are not abstract worries about a distant future. Many of the people who
          left were senior scientists, alignment leads, and ethics researchers — some of
          them architects of the safety frameworks at their former employers. Their
          departures span several major AI organizations and accelerated through 2024
          and into 2026, coinciding with the industry&apos;s pivot from cautious research
          to aggressive commercialization.
        </p>
        <p>
          The writings below — peer-reviewed papers, policy reports, public resignation
          letters, and long-form essays — represent the intellectual foundation behind
          these warnings. They document what these researchers saw, what they tried to
          build, and why they ultimately decided they could no longer stay.
        </p>
      </div>

      <Suspense>
        <PublicationsTabs
          publications={publications}
          concernCounts={pubCountsByConcern}
          predictions={predictions}
        />
      </Suspense>
    </main>
  )
}
