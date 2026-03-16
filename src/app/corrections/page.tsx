import type { Metadata } from "next"
import { getCorrections, type Correction } from "@/lib/queries/corrections"

export const revalidate = 3600 // 1-hour ISR

export const metadata: Metadata = {
  title: "Corrections Log · Ethical AI Departures",
  description: "Public log of corrections made to Ethical AI Departures profiles.",
}

const severityLabel: Record<string, string> = {
  minor: "Minor",
  major: "Major",
  critical: "Critical",
}

const severityColor: Record<string, string> = {
  minor: "text-text-secondary",
  major: "text-accent-amber",
  critical: "text-status-error",
}

export default async function CorrectionsPage() {
  let corrections: Correction[]
  try {
    corrections = await getCorrections()
  } catch {
    corrections = []
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Corrections Log
      </h1>
      <p className="mt-2 text-text-secondary">
        We are committed to accuracy. This is a public record of all
        corrections made to Ethical AI Departures content.
      </p>

      {corrections.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
          <p className="text-text-secondary">
            No corrections have been issued. If you believe any information is
            inaccurate, please contact us.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {corrections.map((correction) => (
            <li
              key={correction.id}
              className="rounded-lg border border-border-light bg-surface-card p-5"
            >
              <div className="flex items-center gap-3">
                <time className="text-sm text-text-secondary">
                  {correction.date}
                </time>
                <span
                  className={`text-xs font-medium ${severityColor[correction.severity] ?? "text-text-secondary"}`}
                >
                  {severityLabel[correction.severity] ?? correction.severity}
                </span>
              </div>
              <p className="mt-2 text-text-primary">{correction.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
