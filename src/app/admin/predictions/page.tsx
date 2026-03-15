import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { predictionWithProfileSchema, type PredictionWithProfile } from "@/lib/schemas/prediction"

export const metadata: Metadata = {
  title: "Predictions · Editorial Dashboard",
}

const statusBadge: Record<string, string> = {
  open: "bg-accent-info/10 text-accent-info",
  pending_review: "bg-accent-amber/10 text-accent-amber",
  confirmed: "bg-green-100 text-green-700",
  disproven: "bg-red-100 text-red-700",
  partially_resolved: "bg-yellow-100 text-yellow-700",
}

const statusLabel: Record<string, string> = {
  open: "Open",
  pending_review: "Pending Review",
  confirmed: "Confirmed",
  disproven: "Disproven",
  partially_resolved: "Partial",
}

export default async function PredictionsListPage() {
  let predictions: PredictionWithProfile[] = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("predictions")
      .select("*, profiles(name, slug)")
      .order("created_at", { ascending: false })

    if (!error && data) {
      predictions = data.map((row) => predictionWithProfileSchema.parse(row))
    }
  } catch {
    // Graceful fallback - table may not exist yet
  }

  const pendingReview = predictions.filter((p) => p.status === "pending_review")
  const open = predictions.filter((p) => p.status === "open")
  const resolved = predictions.filter((p) =>
    ["confirmed", "disproven", "partially_resolved"].includes(p.status)
  )

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          Predictions
        </h1>
        <Link
          href="/admin/predictions/new"
          className="rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90"
        >
          New Prediction
        </Link>
      </div>

      {pendingReview.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-text-primary">
            Awaiting Second Review ({pendingReview.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {pendingReview.map((p) => (
              <PredictionRow key={p.id} prediction={p} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          Open ({open.length})
        </h2>
        {open.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">No open predictions.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {open.map((p) => (
              <PredictionRow key={p.id} prediction={p} />
            ))}
          </ul>
        )}
      </section>

      {resolved.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-text-primary">
            Resolved ({resolved.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {resolved.map((p) => (
              <PredictionRow key={p.id} prediction={p} />
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

function PredictionRow({ prediction }: { prediction: PredictionWithProfile }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border-light bg-surface-card px-5 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[prediction.status] ?? "bg-surface-secondary text-text-secondary"}`}
          >
            {statusLabel[prediction.status] ?? prediction.status}
          </span>
          <span className="truncate font-medium text-text-primary">
            {prediction.title}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          {prediction.profileName}
        </p>
      </div>
      <time className="ml-4 shrink-0 text-sm text-text-secondary">
        {new Date(prediction.createdAt).toLocaleDateString()}
      </time>
    </li>
  )
}
