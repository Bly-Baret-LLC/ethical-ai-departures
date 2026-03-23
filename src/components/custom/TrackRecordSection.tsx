import Link from "next/link"
import type { TrackRecord } from "@/lib/queries/predictions"

interface TrackRecordSectionProps {
  records: TrackRecord[]
  totalPredictions?: number
}

export function TrackRecordSection({ records, totalPredictions }: TrackRecordSectionProps) {
  const aggregate = {
    total: records.reduce((s, r) => s + r.total, 0),
    confirmed: records.reduce((s, r) => s + r.confirmed, 0),
    disproven: records.reduce((s, r) => s + r.disproven, 0),
    partial: records.reduce((s, r) => s + r.partial, 0),
    accuracy: 0,
  }
  aggregate.accuracy =
    aggregate.total > 0
      ? Math.round(
          ((aggregate.confirmed + aggregate.partial * 0.5) / aggregate.total) *
            100
        )
      : 0

  if (aggregate.total === 0) {
    return (
      <div className="mt-6 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
        <p className="text-text-secondary">
          No predictions have been resolved yet. Track records will appear here
          as predictions are evaluated.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="rounded-lg border border-border-light bg-surface-card p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Aggregate Credibility Index
        </h2>
        <p className="mt-4 text-4xl font-bold text-accent-amber">
          {aggregate.accuracy}%
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Based on {aggregate.total} resolved prediction
          {aggregate.total !== 1 ? "s" : ""} out of {totalPredictions ?? aggregate.total} total:{" "}
          {aggregate.confirmed} confirmed,{" "}
          {aggregate.disproven} disproven, {aggregate.partial} partially
          resolved.
          {totalPredictions && totalPredictions > aggregate.total && (
            <> {totalPredictions - aggregate.total} still open.</>
          )}
        </p>
        <p className="mt-3 text-xs text-text-secondary">
          Methodology: Confirmed predictions score 100%, partially resolved
          score 50%, disproven score 0%. Small sample sizes should be
          interpreted with caution.
        </p>
      </div>

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
                {r.totalAll} prediction{r.totalAll !== 1 ? "s" : ""}: {r.confirmed} confirmed
                {r.disproven > 0 && `, ${r.disproven} disproven`}
                {r.partial > 0 && `, ${r.partial} partial`}
                {r.open > 0 && `, ${r.open} open`}
              </p>
            </div>
            {r.total > 1 ? (
              <span className="text-xl font-bold text-accent-amber">
                {r.accuracy}%
              </span>
            ) : (
              <span className="text-sm text-text-secondary">
                Too early to score
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
