import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPredictionById, getVoteCounts } from "@/lib/queries/predictions"
import { InsiderVoteBar } from "@/components/custom/InsiderVoteBar"

export const revalidate = 300

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const prediction = await getPredictionById(id)
  if (!prediction) return { title: "Prediction Not Found" }

  return {
    title: `${prediction.title} · Predictions · The Warning Collective`,
    description: prediction.description ?? prediction.resolutionCriteria,
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

  const votes = await getVoteCounts(id)

  const isResolved = ["confirmed", "disproven", "partially_resolved"].includes(
    prediction.status
  )

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/predictions"
        className="text-sm text-text-secondary hover:text-accent-amber"
      >
        &larr; All Predictions
      </Link>

      <div className="mt-6">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBadge[prediction.status] ?? "bg-surface-secondary text-text-secondary"}`}
        >
          {statusLabel[prediction.status] ?? prediction.status}
        </span>

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
      <blockquote className="mt-6 border-l-4 border-accent-amber/40 pl-4 italic text-text-secondary">
        &ldquo;{prediction.sourceQuote}&rdquo;
      </blockquote>

      {/* Resolution Criteria */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          Resolution Criteria
        </h2>
        <p className="mt-2 text-text-secondary">{prediction.resolutionCriteria}</p>
      </div>

      {/* Resolution outcome */}
      {isResolved && prediction.resolutionOutcome && (
        <div className="mt-8 rounded-lg border border-border-light bg-surface-card p-6">
          <h2 className="text-lg font-semibold text-text-primary">Resolution</h2>
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
      {prediction.status === "open" && (
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
