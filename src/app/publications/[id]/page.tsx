import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPredictionById, getVoteCounts } from "@/lib/queries/predictions"
import { getPublicationsByPredictionId } from "@/lib/queries/publications"
import { InsiderVoteBar } from "@/components/custom/InsiderVoteBar"
import { RECORD_KIND_LABELS, isForecast, isBinaryForecast } from "@/lib/forecasts"
import { ForecastSource } from "@/components/custom/ForecastSource"
import { ForecastUpdateNote } from "@/components/custom/ForecastUpdateNote"
import { groupPublications } from "@/lib/publication-collection"

export const revalidate = 300

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const prediction = await getPredictionById(id)
  if (!prediction) return { title: "Prediction Not Found" }

  const sectionLabel = isForecast(prediction) ? "Forecasts" : "Warnings"
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi").trim()
  const url = `${siteUrl}/publications/${prediction.id}`
  const title = `${prediction.title} · ${sectionLabel}`
  const description = prediction.description ?? prediction.resolutionCriteria

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Ethical AI Departures",
      images: [`${siteUrl}/api/og`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/api/og`],
    },
  }
}

const statusBadge: Record<string, string> = {
  open: "bg-accent-info/10 text-accent-info",
  confirmed: "bg-green-100 text-green-700",
  disproven: "bg-red-100 text-red-700",
  partially_resolved: "bg-yellow-100 text-yellow-700",
}

const statusLabel: Record<string, string> = {
  open: "Open",
  confirmed: "Confirmed",
  disproven: "Disproven",
  partially_resolved: "Partially Resolved",
}

const outcomeLabel: Record<string, string> = {
  true: "Prediction confirmed as true",
  false: "Prediction disproven",
  partial: "Partially resolved",
}

export default async function PredictionDetailPage({ params }: PageProps) {
  const { id } = await params
  const prediction = await getPredictionById(id)

  if (!prediction) notFound()

  const forecast = isForecast(prediction)
  const canVote = isBinaryForecast(prediction) && !prediction.underReview && prediction.status === "open"

  const [votes, publications] = await Promise.all([
    canVote
      ? getVoteCounts(id)
      : Promise.resolve({ agree: 0, disagree: 0, total: 0 }),
    getPublicationsByPredictionId(id),
  ])

  const isResolved =
    forecast &&
    ["confirmed", "disproven", "partially_resolved"].includes(
      prediction.status
    )

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/publications?tab=predictions"
        className="text-sm text-text-secondary hover:text-accent-amber"
      >
        &larr; All Forecasts &amp; Warnings
      </Link>

      <div className="mt-6">
        {forecast ? (
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBadge[prediction.status] ?? "bg-surface-secondary text-text-secondary"}`}
          >
            {statusLabel[prediction.status] ?? prediction.status}
          </span>
        ) : (
          <span className="inline-block rounded-full border border-border-light px-3 py-1 text-xs font-medium text-text-secondary">
            {RECORD_KIND_LABELS[prediction.recordKind]}
          </span>
        )}
        {prediction.underReview && (
          <span className="ml-2 inline-block rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-text-secondary">Under review</span>
        )}

        <h1 className="mt-3 font-serif text-3xl font-semibold text-text-primary">
          {prediction.title}
        </h1>

        <p className="mt-2 text-text-secondary">
          From{" "}
          <Link
            href={`/profiles/${prediction.profileSlug}`}
            className="text-accent-amber hover:underline"
          >
            {prediction.profileName}
          </Link>
          {" · "}
          {prediction.profileCompany}
        </p>
      </div>

      {prediction.description && (
        <p className="mt-6 text-text-primary">{prediction.description}</p>
      )}

      {/* Source Quote */}
      <ForecastSource text={prediction.sourceQuote} verbatim={prediction.isVerbatimQuote} url={prediction.sourceUrl} />
      <ForecastUpdateNote profileSlug={prediction.profileSlug} title={prediction.title} />

      {/* Resolution Criteria */}
      {forecast && prediction.resolutionCriteria && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-text-primary">
            Resolution Criteria
          </h2>
          <p className="mt-2 text-text-secondary">
            {prediction.resolutionCriteria}
          </p>
          {prediction.criteriaAdoptedAt && (
            <p className="mt-2 text-xs text-text-secondary">
              Editorial criteria adopted <time dateTime={prediction.criteriaAdoptedAt}>{prediction.criteriaAdoptedAt}</time>.
            </p>
          )}
        </div>
      )}

      {/* Resolution outcome */}
      {isResolved && prediction.resolutionOutcome && (
        <div className="mt-8 rounded-lg border border-border-light bg-surface-card p-6">
          <h2 className="text-lg font-semibold text-text-primary">{prediction.underReview ? "Previous resolution — under review" : "Resolution"}</h2>
          <p className="mt-2 font-medium text-text-primary">
            {outcomeLabel[prediction.resolutionOutcome]}
          </p>
          {prediction.resolutionRationale && (
            <p className="mt-2 text-sm text-text-secondary">
              {prediction.resolutionRationale}
            </p>
          )}
          {prediction.resolutionEvidenceUrl && (
            <a
              href={prediction.resolutionEvidenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-accent-amber hover:underline"
            >
              View evidence &rarr;
            </a>
          )}
          {prediction.resolutionDate && (
            <p className="mt-2 text-xs text-text-secondary">
              Resolved {new Date(prediction.resolutionDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Voting */}
      {canVote && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-text-primary">
            Insider Assessment
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            AI industry professionals: how likely is this prediction to come true?
          </p>
          <div className="mt-4">
            <InsiderVoteBar
              predictionId={prediction.id}
              initialAgree={votes.agree}
              initialDisagree={votes.disagree}
            />
          </div>
        </div>
      )}

      {/* Related Publications */}
      {publications.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-text-primary">
            Related Publications
          </h2>
          <ul className="mt-4 space-y-3">
            {groupPublications(publications).map((pub) => (
              <li
                key={pub.id}
                className="rounded-lg border border-border-light bg-surface-card px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {pub.url ? (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent-info hover:underline"
                      >
                        {pub.title}
                        <span className="ml-1 text-xs" aria-hidden="true">
                          ⤴
                        </span>
                      </a>
                    ) : (
                      <span className="font-medium text-text-primary">
                        {pub.title}
                      </span>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-text-secondary">
                      {pub.authors.map((author) => (
                        <Link key={author.slug} href={`/profiles/${author.slug}`} className="text-accent-amber hover:underline">{author.name}</Link>
                      ))}
                      {pub.publisher && (
                        <>
                          <span aria-hidden="true">&middot;</span>
                          <span>{pub.publisher}</span>
                        </>
                      )}
                      {pub.publishedDate && (
                        <>
                          <span aria-hidden="true">&middot;</span>
                          <time>
                            {new Date(pub.publishedDate + "T00:00:00").toLocaleDateString(
                              undefined,
                              { year: "numeric", month: "short" }
                            )}
                          </time>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Claim",
            name: prediction.title,
            description: prediction.resolutionCriteria,
            author: {
              "@type": "Person",
              name: prediction.profileName,
            },
            dateCreated: prediction.createdAt,
          }),
        }}
      />
    </main>
  )
}
