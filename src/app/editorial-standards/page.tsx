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
          Every record published on Ethical AI Departures is verified through
          publicly available sources. We require credible, linkable support for
          the person&apos;s role and departure. We do not infer a person&apos;s motive
          from their job title, the timing of an exit, who else left, or where
          they worked next.
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-1 text-text-secondary">
          <li>Primary sources: official statements, interviews, blog posts by the individual</li>
          <li>Secondary sources: reporting by established news organizations</li>
          <li>Social media: verified accounts with contextual corroboration</li>
        </ul>
      </section>

      {/* Evidence categories */}
      <section id="evidence-categories" className="mt-10 scroll-mt-24">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Inclusion and Evidence Categories
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          The primary tally and default directory include only evidence-linked
          departures. Unresolved allegations and organizational events are
          presented separately and are never added to that number.
        </p>
        <dl className="mt-4 space-y-4 text-text-secondary">
          <div>
            <dt className="font-medium text-text-primary">Explicitly stated</dt>
            <dd className="mt-1 leading-relaxed">
              The person publicly connected their departure or removal to an AI
              safety, ethics, governance, or accountability concern.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Reported connection</dt>
            <dd className="mt-1 leading-relaxed">
              Credible independent reporting explicitly connected the departure
              to the concern. A shared date or team affiliation alone is not
              sufficient.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-text-primary">Unresolved allegation</dt>
            <dd className="mt-1 leading-relaxed">
              The individual or a legal complaint alleges retaliation or a
              related motive, but the claim is disputed or unresolved. We label
              the claim status, attribute it, and include the organization&apos;s
              response when available.
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-text-secondary leading-relaxed">
          Records supported only by proximity, role, or speculation are not
          eligible. If later review finds that a record no longer meets its
          category&apos;s threshold, we reclassify or archive it and document the
          change.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Organizational Events
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          We separately document dissolutions and material reorganizations of
          teams responsible for AI safety, ethics, governance, or
          accountability. An event requires credible reporting about what
          happened to the function. It does not establish why any individual
          left, and events never enter the departure tally.
        </p>
      </section>

      {/* Sourcing Standards */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Sourcing Standards
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          Every claim on a profile page must be accompanied by a source link.
          We prioritize first-party statements, original reporting, legal
          filings, and official documents. We do not publish unattributed
          rumors. When established reporting relies on anonymous sources, we
          describe the evidence as reporting rather than fact and seek
          corroboration. If a source becomes unavailable, we note this and seek
          an archived version.
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
