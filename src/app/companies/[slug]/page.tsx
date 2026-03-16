import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getCompanyBySlug } from "@/lib/queries/companies"
import { Avatar } from "@/components/custom/Avatar"

export const revalidate = 300

interface CompanyDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: CompanyDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)

  if (!company) {
    return { title: "Company Not Found · Ethical AI Departures" }
  }

  return {
    title: `${company.company} Departures · Ethical AI Departures`,
    description: `${company.profiles.length} safety-motivated departure${company.profiles.length !== 1 ? "s" : ""} tracked from ${company.company}.`,
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

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        {company.company}
      </h1>
      <p className="mt-2 text-lg text-text-secondary">
        {company.profiles.length} safety-motivated departure
        {company.profiles.length !== 1 ? "s" : ""} tracked
      </p>

      {/* Concern Distribution */}
      {company.concernBreakdown.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Concern Breakdown
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {company.concernBreakdown.map((concern) => (
              <Link
                key={concern.slug}
                href={`/?concern=${concern.slug}`}
                className="rounded-full bg-accent-amber/10 px-3 py-1 text-sm font-medium text-accent-amber hover:bg-accent-amber/20"
              >
                {concern.name} ({concern.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Departure Timeline */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Departure Timeline
        </h2>
        <ul className="mt-4 space-y-4">
          {company.profiles.map((profile) => {
            const year = new Date(
              profile.departureDate + "T00:00:00"
            ).getFullYear()
            return (
              <li key={profile.slug}>
                <Link
                  href={`/profiles/${profile.slug}`}
                  className="flex items-center gap-4 rounded-lg border border-border-light bg-surface-card px-5 py-4 hover:border-accent-amber/50"
                >
                  <Avatar
                    name={profile.name}
                    photoUrl={profile.photoUrl}
                    size={40}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary">
                      {profile.name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {profile.role} · {year}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

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
