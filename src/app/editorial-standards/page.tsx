import type { Metadata } from "next"
import Link from "next/link"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Editorial Standards · Ethical AI Departures",
  description:
    "Our verification methodology, sourcing standards, correction policy, and AI disclosure.",
}

export default function EditorialStandardsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Editorial Standards
      </h1>

      {/* Verification */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Verification Methodology
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Every profile published on Ethical AI Departures is verified through
          publicly available sources. We require at least one credible,
          linkable source for every factual claim — including the
          individual&apos;s departure, their stated reason, and their role at
          the company.
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-1 text-text-secondary">
          <li>Primary sources: official statements, interviews, blog posts by the individual</li>
          <li>Secondary sources: reporting by established news organizations</li>
          <li>Social media: verified accounts with contextual corroboration</li>
        </ul>
      </section>

      {/* Sourcing Standards */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Sourcing Standards
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Every claim on a profile page must be accompanied by a source link.
          We do not publish unverifiable claims, rumors, or anonymous
          allegations. If a source becomes unavailable, we note this and seek
          archived versions.
        </p>
      </section>

      {/* AI Disclosure */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          AI Agent Disclosure
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Ethical AI Departures uses AI agents to assist with research and
          data gathering. However, no AI-generated content is published
          without human review and verification. Every profile and data point
          is reviewed by a human editor before publication. AI tools are used
          for efficiency, not editorial judgment.
        </p>
      </section>

      {/* Conflict of Interest */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Conflict of Interest Policy
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Ethical AI Departures operates independently and does not accept
          funding from AI companies tracked on this platform. Team members
          disclose any financial or professional relationships with tracked
          organizations.
        </p>
      </section>

      {/* Corrections */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Correction Policy
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          We are committed to accuracy. If we publish incorrect information,
          we correct it promptly and transparently. All corrections are logged
          publicly with the date, affected profile, and description of what
          was changed.
        </p>
        <Link
          href="/corrections"
          className="mt-3 inline-block text-sm text-accent-amber hover:underline"
        >
          View the Corrections Log →
        </Link>
      </section>

      {/* Data Subject Rights */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Data Subject Rights
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Individuals featured on Ethical AI Departures have the right to
          request corrections to their profile or, in certain circumstances,
          removal. Requests are reviewed within 5 business days. To submit a
          request, please use our{" "}
          <Link
            href="/contact"
            className="text-accent-info underline hover:text-accent-info/80"
          >
            contact form
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
