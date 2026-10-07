import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { concernGuides, getConcernGuide } from "@/data/concern-guides"
import { getConcernBySlug } from "@/lib/queries/concerns"
import { EVIDENCE_LABELS } from "@/lib/evidence"
import type { ProfileWithTags } from "@/lib/schemas/profile"

export const revalidate = 300
// Only authored guides are public routes; unknown topics must return a real 404.
export const dynamicParams = false

interface PageProps {
  params: Promise<{ slug: string }>
}

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi").trim()

export function generateStaticParams() {
  return concernGuides.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getConcernGuide(slug)
  if (!guide) return { title: "Concern Not Found", robots: { index: false } }
  const url = `${siteUrl}/concerns/${guide.slug}`
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "website",
      images: [`${siteUrl}/api/og`],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [`${siteUrl}/api/og`],
    },
  }
}

function RecordList({ profiles, linkLabel = "Read the record and sources →" }: { profiles: ProfileWithTags[]; linkLabel?: string }) {
  return (
    <ul className="mt-5 space-y-4">
      {profiles.map((profile) => (
        <li key={profile.slug} className="rounded-lg border border-border-light bg-surface-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="font-serif text-xl font-semibold text-text-primary">
              <Link href={`/profiles/${profile.slug}`} className="underline decoration-border-light underline-offset-4 hover:text-accent-amber">
                {profile.name}
              </Link>
            </h3>
            <span className="rounded-full border border-border-light px-3 py-1 text-xs text-text-secondary">
              {EVIDENCE_LABELS[profile.motiveEvidence]}
            </span>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{profile.role} · {profile.company}</p>
          {profile.statedReason && <p className="mt-3 leading-relaxed text-text-secondary">{profile.statedReason}</p>}
          <Link href={`/profiles/${profile.slug}#sources`} className="mt-4 inline-block text-sm text-accent-amber underline underline-offset-2">
            {linkLabel}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default async function ConcernPage({ params }: PageProps) {
  const { slug } = await params
  const concern = await getConcernBySlug(slug)
  if (!concern) notFound()
  const { guide, evidenceLinked, alleged } = concern
  const { pageCopy } = guide
  const related = concernGuides.filter((item) => item.slug !== slug)
  const url = `${siteUrl}/concerns/${slug}`

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-text-secondary">
        <Link href="/" className="hover:underline">Home</Link>
        {" / "}<Link href="/concerns" className="hover:underline">Concerns</Link>
        {" / "}<span aria-current="page">{guide.name}</span>
      </nav>
      <h1 className="mt-6 font-serif text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">{guide.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-text-secondary">{guide.introduction}</p>
      <p id="introduction-sources" className="mt-3 text-sm leading-relaxed text-text-secondary">
        {pageCopy.introductionSourceLabel}: {pageCopy.introductionSources.map((source, index) => (
          <span key={source.href}>
            {index > 0 && " · "}
            <a href={source.href} className="text-accent-amber underline underline-offset-2">{source.label}</a>
          </span>
        ))}
      </p>
      <p className="mt-5 leading-relaxed text-text-secondary">{guide.explanation}</p>

      <section id="profiles" aria-labelledby="evidence-heading" className="mt-10 scroll-mt-6 border-t border-border-light pt-8">
        <h2 id="evidence-heading" className="font-serif text-2xl font-semibold text-text-primary">{pageCopy.evidenceHeading}</h2>
        <p className="mt-3 leading-relaxed text-text-secondary">
          {evidenceLinked.length} documented departure{evidenceLinked.length === 1 ? "" : "s"}. {pageCopy.evidenceSummary}
        </p>
        {evidenceLinked.length > 0 ? <RecordList profiles={evidenceLinked} linkLabel={pageCopy.recordLinkLabel} /> : (
          <p className="mt-5 rounded-lg border border-border-light p-5 text-text-secondary">{pageCopy.emptyEvidence}</p>
        )}
      </section>

      <section id="allegations" aria-labelledby="allegations-heading" className="mt-10 scroll-mt-6">
        <h2 id="allegations-heading" className="font-serif text-2xl font-semibold text-text-primary">Unresolved allegations</h2>
        <p className="mt-3 leading-relaxed text-text-secondary">
          {pageCopy.allegationSummary}
        </p>
        {alleged.length > 0 ? <RecordList profiles={alleged} linkLabel={pageCopy.recordLinkLabel} /> : (
          <p className="mt-3 text-sm text-text-secondary">{pageCopy.emptyAllegations}</p>
        )}
      </section>

      <section className="mt-10 rounded-lg border border-border-light bg-surface-secondary p-6">
        <h2 className="font-serif text-xl font-semibold text-text-primary">{guide.question}</h2>
        <p className="mt-3 leading-relaxed text-text-secondary">{guide.answer}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          {pageCopy.methodNote}
        </p>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-accent-amber">
          <Link href="/about" className="underline underline-offset-2">{pageCopy.methodLinkLabel}</Link>
          <Link href="/organizational-events" className="underline underline-offset-2">Organizational events</Link>
        </div>
      </section>

      <nav aria-label="Related concerns" className="mt-10 border-t border-border-light pt-6">
        <h2 className="font-serif text-xl font-semibold text-text-primary">{pageCopy.relatedHeading}</h2>
        <ul className="mt-4 space-y-3">
          {related.map((item) => <li key={item.slug}><Link href={`/concerns/${item.slug}`} className="text-accent-amber underline underline-offset-2">{item.title}</Link></li>)}
        </ul>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Concerns", item: `${siteUrl}/concerns` },
          { "@type": "ListItem", position: 3, name: guide.name, item: url },
        ],
      }).replace(/</g, "\\u003c") }} />
    </main>
  )
}
