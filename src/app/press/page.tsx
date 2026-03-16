import type { Metadata } from "next"

export const revalidate = 86400 // 24-hour ISR

export const metadata: Metadata = {
  title: "Press & Media Kit · Ethical AI Departures",
  description:
    "Press resources, citation guidelines, and media kit for journalists covering Ethical AI Departures.",
}

export default function PressPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Press & Media Kit
      </h1>

      {/* About */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          About Ethical AI Departures
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Ethical AI Departures is an independent, non-partisan public
          accountability resource that tracks safety-motivated departures from
          AI companies. We document sourced accounts of researchers, engineers,
          and executives who have left their positions due to safety and ethics
          concerns. Our goal is to provide journalists, policymakers, and the
          public with transparent, verifiable information about the state of AI
          safety culture.
        </p>
      </section>

      {/* Citation Format */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          How to Cite
        </h2>
        <p className="mt-3 text-text-secondary">
          When referencing Ethical AI Departures data in your reporting, please use
          the following citation format:
        </p>
        <div className="mt-4 rounded-lg border border-border-light bg-surface-card p-4">
          <p className="font-mono text-sm text-text-primary">
            Ethical AI Departures. &quot;[Profile Name] — Why They Left
            [Company].&quot; <em>Ethical AI Departures</em>,
            ethicalaidepartures.fyi/profiles/[slug]. Accessed [date].
          </p>
        </div>
        <p className="mt-3 text-sm text-text-secondary">
          For aggregate statistics, please cite the homepage URL and the date
          of access, as numbers are updated in real time.
        </p>
      </section>

      {/* Embedding Guidelines */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Embedding & Referencing
        </h2>
        <ul className="mt-3 space-y-2 text-text-secondary">
          <li>
            All profile pages have stable permalink URLs suitable for citation.
          </li>
          <li>
            Filtered views can be shared via URL — filter parameters are
            encoded in the query string.
          </li>
          <li>
            Data can be exported as CSV or JSON from the Profiles page for use
            in data journalism.
          </li>
          <li>
            All source links on profile pages point to the original reporting
            — please verify sources independently.
          </li>
        </ul>
      </section>

    </main>
  )
}
