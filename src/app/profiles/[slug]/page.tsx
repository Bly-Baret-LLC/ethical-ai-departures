import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getProfileBySlug } from "@/lib/queries/profiles"
import { Avatar } from "@/components/custom/Avatar"
import { SourceTooltip } from "@/components/custom/SourceTooltip"
import { ShareButtons } from "@/components/custom/ShareButtons"

// ISR: 5-minute revalidation
export const revalidate = 300

interface ProfileDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProfileDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile) {
    return { title: "Profile Not Found · The Warning Collective" }
  }

  const year = new Date(profile.departureDate + "T00:00:00").getFullYear()
  const primaryConcern = profile.concernTags[0]?.name ?? "safety concerns"

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewarningcollective.org"
  const ogParams = new URLSearchParams({
    type: "profile",
    name: profile.name,
    company: profile.company,
    quote: profile.statedReason?.slice(0, 120) ?? "",
  })

  return {
    title: `${profile.name} — Why They Left ${profile.company} · The Warning Collective`,
    description: `${profile.name} left ${profile.company} in ${year} over ${primaryConcern.toLowerCase()}. Read their sourced account.`,
    openGraph: {
      images: [`${siteUrl}/api/og?${ogParams}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${siteUrl}/api/og?${ogParams}`],
    },
  }
}

export default async function ProfileDetailPage({
  params,
}: ProfileDetailPageProps) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile) {
    notFound()
  }

  const year = new Date(profile.departureDate + "T00:00:00").getFullYear()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar name={profile.name} photoUrl={profile.photoUrl} size={64} />
        <div>
          <h1 className="font-serif text-3xl font-semibold text-text-primary">
            {profile.name}
          </h1>
          <p className="mt-1 text-lg text-text-secondary">
            {profile.role} · {profile.company} · {year}
          </p>
        </div>
      </div>

      {/* Stated Reason */}
      {profile.statedReason && (
        <blockquote className="mt-8 border-l-[3px] border-accent-amber pl-4 text-lg italic text-text-secondary">
          {profile.statedReason}
        </blockquote>
      )}

      {/* Concern Tags */}
      {profile.concernTags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {profile.concernTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/profiles?concern=${tag.slug}`}
              className="rounded-full bg-accent-amber/10 px-3 py-1 text-sm font-medium text-accent-amber hover:bg-accent-amber/20"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Sources */}
      {profile.sources.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            Sources
          </h2>
          <ul className="mt-4 space-y-3">
            {profile.sources.map((source) => (
              <li key={source.id}>
                <SourceTooltip url={source.url}>
                  <span className="text-accent-info underline hover:text-accent-info/80">
                    {source.title ?? source.url}
                    <span className="ml-1 text-xs text-text-secondary" aria-hidden="true">
                      ⤴
                    </span>
                  </span>
                </SourceTooltip>
                {source.platform && (
                  <span className="ml-2 text-xs text-text-secondary">
                    {source.platform}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Share */}
      <div className="mt-8">
        <ShareButtons
          url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewarningcollective.org"}/profiles/${profile.slug}`}
          twitterText={`${profile.name} left ${profile.company} over safety concerns. Read their sourced account on @WarningCollect:`}
        />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            jobTitle: profile.role,
            worksFor: {
              "@type": "Organization",
              name: profile.company,
            },
          }),
        }}
      />

      {/* Back link */}
      <div className="mt-12 border-t border-border-light pt-6">
        <Link
          href="/profiles"
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          ← Back to all profiles
        </Link>
      </div>
    </main>
  )
}
