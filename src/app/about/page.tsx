import type { Metadata } from "next"
import { ContactButton } from "@/components/custom/ContactButton"

export const revalidate = 86400 // 24-hour ISR

export const metadata: Metadata = {
  title: "About — Why We Track AI Safety Departures",
  description: "How and why we track researchers and executives who quit or were fired from AI companies over safety and ethics concerns. Methodology and editorial standards.",
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
          Ethical AI Departures documents departures and removals connected to
          public concerns about AI safety, ethics, governance, and
          accountability. Records are classified by the strength and type of
          evidence linking the departure to the concern, so readers can
          distinguish what a person said themselves, what independent reporting
          established, and what remains an unresolved allegation. Team
          dissolutions and reorganizations are documented separately as
          organizational events. We maintain sourced, verifiable accounts
          to help journalists, policymakers, and the public understand patterns
          in AI safety culture.
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

      {/* Inclusion Criteria */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Inclusion Criteria
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          A record may be classified as <strong>Direct</strong> (the person
          explicitly linked their departure to the concern),{" "}
          <strong>Reported</strong> (reputable independent reporting explicitly
          establishes the connection), <strong>Alleged</strong> (the individual
          or a legal complaint alleges the link, and the claim may be disputed
          or unresolved). Only Direct and Reported records appear in the primary
          tally and default directory. Alleged records are shown in a separate
          view. We do not include someone
          based only on their role, the timing of an exit, association with
          another person, or a later employer.
        </p>
        <p className="mt-3 text-text-secondary leading-relaxed">
          A team dissolution or reorganization can be included as an
          organizational event when credible sources establish that a safety,
          ethics, governance, or accountability function was eliminated or
          materially reorganized. Events never enter the person tally and do not
          establish the motives of people associated with the team.
        </p>
      </section>

      {/* Team */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Team
        </h2>
        <p className="mt-3 text-text-secondary">
          Ethical AI Departures is a solo project with input from a handful of
          collaborators who care about AI accountability. If you spot an error
          or have a correction, please reach out — accuracy matters to us.
        </p>
        <ContactButton />
      </section>

      {/* Support */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Support Our Work
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Ethical AI Departures is independently funded. If you find it
          valuable, please consider contributing to its ongoing development on
          Ko-fi.
        </p>
        <a
          href="https://ko-fi.com/ethicalaidepartures"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-amber/90 focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Support on Ko-fi
        </a>
      </section>

    </main>
  )
}
