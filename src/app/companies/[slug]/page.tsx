import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getCompanyBySlug } from "@/lib/queries/companies"
import { Avatar } from "@/components/custom/Avatar"
import { getCompanyOverview } from "@/data/company-overviews"
import { EVIDENCE_LABELS, isHeadlineCounted } from "@/lib/evidence"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import { getOrganizationEventsByCompanySlug } from "@/data/organization-events"
import { OrganizationEventCard } from "@/components/custom/OrganizationEventCard"

export const revalidate = 300

interface CompanyDetailPageProps {
  params: Promise<{ slug: string }>
}

function CompanyProfileList({ profiles }: { profiles: ProfileWithTags[] }) {
  return (
    <ul className="mt-4 space-y-4">
      {profiles.map((profile) => {
        const year = new Date(profile.departureDate + "T00:00:00").getFullYear()
        return (
          <li key={profile.slug}>
            <Link
              href={`/profiles/${profile.slug}`}
              className="flex items-center gap-4 rounded-lg border border-border-light bg-surface-card px-5 py-4 hover:border-accent-amber/50"
            >
              <Avatar name={profile.name} photoUrl={profile.photoUrl} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-text-primary">{profile.name}</p>
                <p className="text-sm text-text-secondary">
                  {profile.role} · {year}
                </p>
              </div>
              <span className="shrink-0 text-xs text-text-secondary">
                {EVIDENCE_LABELS[profile.motiveEvidence]}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export async function generateMetadata({
  params,
}: CompanyDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)

  if (!company) {
    return { title: "Company Not Found · Ethical AI Departures" }
  }

  const evidenceLinkedCount = company.profiles.filter(isHeadlineCounted).length
  const eventCount = getOrganizationEventsByCompanySlug(slug).length
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi").trim()
  const canonicalUrl = `${siteUrl}/companies/${slug}`
  const title = `${company.company} — ${evidenceLinkedCount} Evidence-Linked AI Departure${evidenceLinkedCount === 1 ? "" : "s"}`
  const description = `Sourced records involving ${company.company}: ${evidenceLinkedCount} evidence-linked departure${evidenceLinkedCount === 1 ? "" : "s"}${eventCount > 0 ? ` and ${eventCount} documented organizational event${eventCount === 1 ? "" : "s"}` : ""}.`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  }
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)

  if (!company) {
    notFound()
  }

  const evidenceLinkedProfiles = company.profiles.filter(isHeadlineCounted)
  const allegedProfiles = company.profiles.filter(
    (profile) => profile.motiveEvidence === "alleged"
  )
  const organizationEvents = getOrganizationEventsByCompanySlug(slug)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        {company.company}
      </h1>
      <p className="mt-2 text-lg text-text-secondary">
        {evidenceLinkedProfiles.length} evidence-linked departure
        {evidenceLinkedProfiles.length === 1 ? "" : "s"}
        {(allegedProfiles.length > 0 || organizationEvents.length > 0) && (
          <span className="text-base">
            {allegedProfiles.length > 0
              ? ` · ${allegedProfiles.length} unresolved`
              : ""}
            {organizationEvents.length > 0
              ? ` · ${organizationEvents.length} organizational event${organizationEvents.length === 1 ? "" : "s"}`
              : ""}
          </span>
        )}
      </p>

      {/* Overview */}
      {getCompanyOverview(slug) && (
        <p className="mt-6 text-base leading-relaxed text-text-secondary">
          {getCompanyOverview(slug)}
        </p>
      )}

      {/* Concern Distribution */}
      {company.concernBreakdown.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Evidence-Linked Concern Breakdown
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {company.concernBreakdown.map((concern) => (
              <Link
                key={concern.slug}
                href={`/?company=${slug}&concern=${concern.slug}`}
                className="rounded-full bg-accent-amber/10 px-3 py-1 text-sm font-medium text-accent-amber hover:bg-accent-amber/20"
              >
                {concern.name} ({concern.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Evidence-linked timeline */}
      {evidenceLinkedProfiles.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Evidence-Linked Departures
          </h2>
          <CompanyProfileList profiles={evidenceLinkedProfiles} />
        </section>
      )}

      {organizationEvents.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Organizational Events
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Team-level changes are documented separately and never establish an
            individual&apos;s motive or enter the departure count.
          </p>
          <div className="mt-4 space-y-4">
            {organizationEvents.map((event) => (
              <OrganizationEventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>
      )}

      {allegedProfiles.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Unresolved Allegations
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            These claims are disputed or unresolved and are excluded from the primary tally.
          </p>
          <CompanyProfileList profiles={allegedProfiles} />
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: company.company,
          }),
        }}
      />

      {/* Back link */}
      <div className="mt-12 border-t border-border-light pt-6">
        <Link
          href="/companies"
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          ← All companies
        </Link>
      </div>
    </main>
  )
}
