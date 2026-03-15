import type { Metadata } from "next"
import Link from "next/link"

export const revalidate = 86400 // 24-hour ISR

export const metadata: Metadata = {
  title: "About · The Warning Collective",
  description:
    "Our mission, team, and approach to tracking safety-motivated departures from AI companies.",
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        About The Warning Collective
      </h1>

      {/* Mission */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Our Mission
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          The Warning Collective is an independent accountability resource that
          tracks safety-motivated departures from AI companies. When
          researchers, engineers, and executives leave their positions because
          of safety and ethics concerns, their decisions carry important
          signals about the state of AI development. We document these
          departures with sourced, verifiable accounts to help journalists,
          policymakers, and the public understand patterns in AI safety
          culture.
        </p>
      </section>

      {/* Founding Story */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Why We Built This
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          As AI capabilities accelerate, the voices of those closest to the
          technology matter more than ever. Safety-motivated departures are a
          leading indicator of organizational culture around AI risk. Yet these
          stories are often scattered across news articles, social media posts,
          and personal blogs. The Warning Collective brings them together in
          one structured, searchable resource.
        </p>
      </section>

      {/* Team */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Team
        </h2>
        <p className="mt-3 text-text-secondary">
          The Warning Collective is maintained by a small team of independent
          researchers and developers committed to AI accountability.
        </p>
      </section>

      {/* Advisory Board */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Advisory Board
        </h2>
        <p className="mt-3 text-text-secondary">
          Our advisory board includes AI safety researchers, investigative
          journalists, and policy experts who guide our editorial standards and
          methodology.
        </p>
      </section>

      {/* Link to Editorial Standards */}
      <div className="mt-12 rounded-lg border border-border-light bg-surface-card p-6">
        <p className="font-medium text-text-primary">
          How we verify and publish information
        </p>
        <Link
          href="/editorial-standards"
          className="mt-2 inline-block text-sm text-accent-amber hover:underline"
        >
          Read our Editorial Standards →
        </Link>
      </div>
    </main>
  )
}
