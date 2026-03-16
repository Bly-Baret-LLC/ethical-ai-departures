import type { Metadata } from "next"

export const revalidate = 86400 // 24-hour ISR

export const metadata: Metadata = {
  title: "About · Ethical AI Departures",
  description:
    "Our mission, team, and approach to tracking safety-motivated departures from AI companies.",
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        About Ethical AI Departures
      </h1>

      {/* Mission */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Our Mission
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Ethical AI Departures is an independent accountability resource that
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
          and personal blogs. Ethical AI Departures brings them together in
          one structured, searchable resource.
        </p>
      </section>

      {/* Team */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Team
        </h2>
        <p className="mt-3 text-text-secondary">
          Ethical AI Departures is a solo project with input from a handful of
          collaborators who care about AI accountability. Want to get involved?
          Use the Submit a Departure button to get in touch.
        </p>
      </section>

    </main>
  )
}
