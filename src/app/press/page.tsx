import type { Metadata } from "next"
import { ContactButton } from "@/components/custom/ContactButton"

export const revalidate = 86400 // 24-hour ISR

export const metadata: Metadata = {
  title: "Press & Media Kit — For Journalists Covering AI Safety",
  description: "Press resources, citation guidelines, and media kit for journalists covering AI safety departures and researcher whistleblowers.",
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
            Ethical AI Departures. &quot;[Name] — Departure from [Company]
            ([Year]).&quot; <em>Ethical AI Departures</em>,
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
            Profile sources may include first-party statements, original
            documents, legal filings, and independent reporting, each labeled
            by source type. Readers should review the underlying material and
            note when a claim is disputed or unresolved.
          </li>
        </ul>
      </section>

      <details className="group mt-10 border-y border-border-light">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-medium text-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
          Where our work is cited
          <span aria-hidden="true" className="shrink-0 group-open:hidden">+</span>
          <span aria-hidden="true" className="hidden shrink-0 group-open:inline">−</span>
        </summary>
        <ul className="space-y-5 pb-5 pt-2">
          <li className="text-sm">
            <p className="font-medium text-text-primary">State complaints against OpenAI</p>
            <p className="mt-1 text-xs text-text-secondary">
              Filed <time dateTime="2026-10-14">October 14, 2026</time>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Seven states cite Ethical AI Departures in their complaints discussing
              OpenAI staff departures and safety concerns.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {[
                ["Arizona", "Arizona", 51],
                ["Idaho", "Idaho", 64],
                ["Iowa", "Iowa", 43],
                ["Kansas", "Kansas", 40],
                ["Montana", "Montana", 54],
                ["Nebraska", "Nebraska", 55],
                ["West Virginia", "West-Virginia", 59],
              ].map(([name, file, page], index) => (
                <span key={name}>
                  {index > 0 && " · "}
                  <a
                    href={`https://www.justsecurity.org/wp-content/uploads/2026/10/${file}.pdf#page=${page}`}
                    className="underline decoration-border-light underline-offset-4 hover:text-text-primary hover:decoration-current"
                    aria-label={`${name} complaint (PDF)`}
                  >
                    {name}
                  </a>
                </span>
              ))}
              {" "}<span className="text-xs">(PDFs)</span>
            </p>
          </li>
          <li className="text-sm">
            <p className="font-medium text-text-primary">
              <a href="https://thezvi.substack.com/p/the-safety-culture-at-the-labs-is" className="underline decoration-border-light underline-offset-4 hover:decoration-current">
                Zvi Mowshowitz
              </a>
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              <time dateTime="2026-10-14">October 14, 2026</time>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Links to the tracker and cites its departure count in an essay on
              safety culture at AI labs.
            </p>
          </li>
          <li className="text-sm">
            <p className="font-medium text-text-primary">
              <a href="https://theprint.in/tech/this-isnt-a-marketing-stunt-ai-could-kill-all-humans-anthropic-researcher-quits-sounds-alarm/3038001/" className="underline decoration-border-light underline-offset-4 hover:decoration-current">
                ThePrint
              </a>
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              <time dateTime="2026-09-09">September 9, 2026</time>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              References the tracker to place Coxon’s departure from Anthropic
              alongside other safety- and ethics-linked departures.
            </p>
          </li>
        </ul>
      </details>

      {/* Media Inquiries */}
      <section className="mt-10">
        <ContactButton
          label="Media Inquiries"
          dialogTitle="Media Inquiries"
          subtitle="Press questions or interview requests? We'd love to hear from you."
          contactType="press"
        />
      </section>

    </main>
  )
}
