import type { Metadata } from "next"
import {
  getPublicationsWithProfiles,
  getPublicationCountsByConcern,
} from "@/lib/queries/publications"
import type { PublicationWithProfile } from "@/lib/schemas/publication"
import { WritingsSection } from "@/components/custom/WritingsSection"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Themes & Writings · Ethical AI Departures",
  description:
    "Recurring concerns behind AI safety departures, and the papers, essays, and reports the researchers wrote about them.",
}

export default async function ThemesAndWritingsPage() {
  let publications: PublicationWithProfile[] = []
  let pubCountsByConcern: { tagName: string; tagSlug: string; count: number }[] = []

  try {
    ;[publications, pubCountsByConcern] = await Promise.all([
      getPublicationsWithProfiles(),
      getPublicationCountsByConcern(),
    ])
  } catch {
    // Graceful fallback
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Themes &amp; Writings
      </h1>

      <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
        <p>
          Across sixty departures from OpenAI, Google, xAI, Anthropic, Meta, and Stability AI,
          the same concerns surface again and again. Safety teams are dissolved or absorbed
          into product work. Deployment timelines are compressed past the point where
          meaningful evaluation is possible. Researchers who raise objections internally
          find their concerns deprioritized, and sometimes face retaliation for speaking up.
        </p>
        <p>
          These are not abstract worries about a distant future. The people who left were
          senior scientists, alignment leads, and ethics researchers — many of them
          architects of the safety frameworks their former employers now sideline. Their
          departures span every major AI laboratory and accelerated sharply through 2024
          and into 2025, tracking the industry&apos;s pivot from cautious research to
          aggressive commercialization.
        </p>
        <p>
          The writings below — peer-reviewed papers, policy reports, public resignation
          letters, and long-form essays — represent the intellectual foundation behind
          these warnings. They document what these researchers saw, what they tried to
          build, and why they ultimately decided they could no longer stay.
        </p>
      </div>

      {publications.length > 0 && (
        <WritingsSection
          publications={publications}
          concernCounts={pubCountsByConcern}
        />
      )}
    </main>
  )
}
