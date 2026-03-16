import type { Metadata } from "next"
import Link from "next/link"
import { getTrackRecords, type TrackRecord } from "@/lib/queries/predictions"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Track Record & Credibility Index · Ethical AI Departures",
  description:
    "How accurate have AI safety researchers' predictions been? Per-researcher scorecards and aggregate credibility index.",
}

export default async function TrackRecordPage() {
  let records: TrackRecord[] = []
  const aggregate = { total: 0, confirmed: 0, disproven: 0, partial: 0, accuracy: 0 }

  try {
    records = await getTrackRecords()
    aggregate.total = records.reduce((s, r) => s + r.total, 0)
    aggregate.confirmed = records.reduce((s, r) => s + r.confirmed, 0)
    aggregate.disproven = records.reduce((s, r) => s + r.disproven, 0)
    aggregate.partial = records.reduce((s, r) => s + r.partial, 0)
    aggregate.accuracy =
      aggregate.total > 0
        ? Math.round(
            ((aggregate.confirmed + aggregate.partial * 0.5) / aggregate.total) * 100
          )
        : 0
  } catch {
    // Graceful fallback
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/predictions"
        className="text-sm text-text-secondary hover:text-accent-amber"
      >
        &larr; All Predictions
      </Link>

      <h1 className="mt-6 font-serif text-3xl font-semibold text-text-primary">
        Track Record &amp; Credibility Index
      </h1>

      {aggregate.total > 0 ? (
        <>
          {/* Aggregate */}
          <div className="mt-8 rounded-lg border border-border-light bg-surface-card p-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Aggregate Credibility Index
            </h2>
            <p className="mt-4 text-4xl font-bold text-accent-amber">
              {aggregate.accuracy}%
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Based on {aggregate.total} resolved prediction{aggregate.total !== 1 ? "s" : ""}:
              {" "}{aggregate.confirmed} confirmed, {aggregate.disproven} disproven,
              {" "}{aggregate.partial} partially resolved.
            </p>
            <p className="mt-3 text-xs text-text-secondary">
              Methodology: Confirmed predictions score 100%, partially resolved score 50%,
              disproven score 0%. This is a simple accuracy metric; small sample sizes should
              be interpreted with caution.
            </p>
          </div>

          {/* Per-researcher */}
          <h2 className="mt-10 text-lg font-semibold text-text-primary">
            Per-Researcher Scorecards
          </h2>
          <ul className="mt-4 space-y-3">
            {records.map((r) => (
              <li
                key={r.profileSlug}
                className="flex items-center justify-between rounded-lg border border-border-light bg-surface-card px-5 py-4"
              >
                <div>
                  <Link
                    href={`/profiles/${r.profileSlug}`}
                    className="font-medium text-text-primary hover:text-accent-amber"
                  >
                    {r.profileName}
                  </Link>
                  <p className="mt-0.5 text-sm text-text-secondary">
                    {r.confirmed} of {r.total} predictions confirmed
                    {r.partial > 0 && `, ${r.partial} partial`}
                    {r.disproven > 0 && `, ${r.disproven} disproven`}
                  </p>
                </div>
                <span className="text-xl font-bold text-accent-amber">
                  {r.accuracy}%
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-10 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
          <p className="text-text-secondary">
            No predictions have been resolved yet. Track records will appear here as
            predictions are evaluated.
          </p>
        </div>
      )}
    </main>
  )
}
