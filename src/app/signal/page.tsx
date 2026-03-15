import type { Metadata } from "next"
import Link from "next/link"
import { getSignalCounts } from "@/lib/actions/signals"
import { SignalForm } from "./SignalForm"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Anonymous Signal · The Warning Collective",
  description:
    "Anonymously signal that you share safety concerns about AI development. Zero PII collected.",
}

export default async function SignalPage() {
  let counts = { total: 0, byCategory: [] as Array<{ category: string; count: number }> }

  try {
    counts = await getSignalCounts()
  } catch {
    // Graceful fallback
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Anonymous Signal
      </h1>
      <p className="mt-2 text-text-secondary">
        If you work in AI and share safety concerns, you can anonymously signal
        your support. No personal information is collected.
      </p>

      {/* Aggregate counter */}
      {counts.total > 0 && (
        <div className="mt-8 rounded-lg border border-border-light bg-surface-card p-6 text-center">
          <p className="text-4xl font-bold text-accent-amber">{counts.total}</p>
          <p className="mt-1 text-sm text-text-secondary">
            insider{counts.total !== 1 ? "s" : ""} have signaled shared concerns
          </p>
          {counts.byCategory.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {counts.byCategory.map((c) => (
                <span
                  key={c.category}
                  className="rounded-full bg-surface-secondary px-3 py-1 text-xs text-text-secondary"
                >
                  {c.category} ({c.count})
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Privacy disclosure */}
      <div className="mt-8 rounded-lg border border-accent-amber/30 bg-accent-amber/5 p-4">
        <h2 className="text-sm font-semibold text-text-primary">
          What we collect and what we don&apos;t
        </h2>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-green-700">We collect:</p>
            <ul className="mt-1 space-y-0.5 text-xs text-text-secondary">
              <li>Concern categories (required)</li>
              <li>Company name (optional)</li>
              <li>Free text (optional, 500 chars max)</li>
              <li>Submission timestamp</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-red-700">We do NOT collect:</p>
            <ul className="mt-1 space-y-0.5 text-xs text-text-secondary">
              <li>IP addresses</li>
              <li>Browser fingerprints</li>
              <li>Cookies or tracking</li>
              <li>Any personally identifiable information</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          <Link href="/signal/trust" className="text-accent-amber hover:underline">
            Read our full trust documentation
          </Link>
        </p>
      </div>

      <SignalForm />
    </main>
  )
}
