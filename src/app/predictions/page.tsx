import type { Metadata } from "next"
import Link from "next/link"
import { getPredictions } from "@/lib/queries/predictions"
import type { PredictionWithProfile } from "@/lib/schemas/prediction"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Predictions Tracker · The Warning Collective",
  description:
    "Falsifiable predictions extracted from AI safety researcher departure statements. Track what experts warned about and see how their predictions resolve.",
  alternates: {
    types: {
      "application/rss+xml": "/predictions/feed.xml",
    },
  },
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
  partially_resolved: "Partial",
}

export default async function PredictionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; researcher?: string; sort?: string }>
}) {
  const params = await searchParams
  let predictions: PredictionWithProfile[] = []

  try {
    predictions = await getPredictions({
      status: params.status,
      researcher: params.researcher,
      sort: params.sort,
    })
  } catch {
    // Graceful fallback
  }

  const openCount = predictions.filter((p) => p.status === "open").length
  const resolvedCount = predictions.filter((p) =>
    ["confirmed", "disproven", "partially_resolved"].includes(p.status)
  ).length

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Predictions Tracker
      </h1>
      <p className="mt-2 text-text-secondary">
        Falsifiable predictions extracted from researcher departure statements.
        {openCount > 0 && ` ${openCount} open.`}
        {resolvedCount > 0 && ` ${resolvedCount} resolved.`}
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink href="/predictions" label="All" active={!params.status} />
        <FilterLink
          href="/predictions?status=open"
          label="Open"
          active={params.status === "open"}
        />
        <FilterLink
          href="/predictions?status=resolved"
          label="Resolved"
          active={params.status === "resolved"}
        />
      </div>

      {predictions.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
          <p className="text-text-secondary">
            No predictions yet. Check back as researchers&apos; statements are analyzed.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {predictions.map((p) => (
            <li key={p.id}>
              <Link
                href={`/predictions/${p.id}`}
                className="block rounded-lg border border-border-light bg-surface-card px-5 py-4 transition-colors hover:border-accent-amber/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[p.status] ?? "bg-surface-secondary text-text-secondary"}`}
                      >
                        {statusLabel[p.status] ?? p.status}
                      </span>
                      <h2 className="truncate font-medium text-text-primary">
                        {p.title}
                      </h2>
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">
                      {p.profileName}
                    </p>
                    {p.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <time className="shrink-0 text-sm text-text-secondary">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/predictions/track-record"
          className="text-sm text-accent-amber hover:underline"
        >
          View Track Record &amp; Credibility Index
        </Link>
      </div>
    </main>
  )
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-accent-amber text-white"
          : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
      }`}
    >
      {label}
    </Link>
  )
}
