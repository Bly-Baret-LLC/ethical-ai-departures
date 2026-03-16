import type { Metadata } from "next"
import Link from "next/link"
import { getThemeData, type ThemeData } from "@/lib/queries/themes"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Theme Map · Ethical AI Departures",
  description:
    "A visual map of the most common concerns cited by researchers departing AI companies.",
}

const trendIndicator: Record<string, string> = {
  up: "text-red-600",
  down: "text-green-600",
  stable: "text-text-secondary",
}

const trendLabel: Record<string, string> = {
  up: "Increasing",
  down: "Decreasing",
  stable: "Stable",
}

export default async function ThemesPage() {
  let themes: ThemeData[] = []

  try {
    themes = await getThemeData()
  } catch {
    // Graceful fallback
  }

  const maxCount = Math.max(...themes.map((t) => t.count), 1)

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Theme Map
      </h1>
      <p className="mt-2 text-text-secondary">
        The most common concerns cited by researchers departing AI companies,
        weighted by frequency.
      </p>

      {themes.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
          <p className="text-text-secondary">
            Theme data will appear here as profiles are analyzed.
          </p>
        </div>
      ) : (
        <>
          {/* Visual theme map */}
          <div className="mt-8 flex flex-wrap gap-3">
            {themes.map((theme) => {
              const size = Math.max(0.7, theme.count / maxCount)
              return (
                <Link
                  key={theme.slug}
                  href={`/profiles?concern=${theme.slug}`}
                  className="rounded-lg border border-border-light bg-surface-card px-4 py-3 transition-colors hover:border-accent-amber/30"
                  style={{ fontSize: `${0.875 + size * 0.5}rem` }}
                >
                  <span className="font-medium text-text-primary">{theme.name}</span>
                  <span className="ml-2 text-sm text-text-secondary">({theme.count})</span>
                  {theme.trend !== "stable" && (
                    <span className={`ml-1 text-xs ${trendIndicator[theme.trend]}`}>
                      {theme.trend === "up" ? "\u2191" : "\u2193"}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Detailed breakdown */}
          <h2 className="mt-12 text-lg font-semibold text-text-primary">
            Concern Breakdown
          </h2>
          <ul className="mt-4 space-y-4">
            {themes.map((theme) => (
              <li
                key={theme.slug}
                className="rounded-lg border border-border-light bg-surface-card p-4"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/profiles?concern=${theme.slug}`}
                    className="font-medium text-text-primary hover:text-accent-amber"
                  >
                    {theme.name}
                  </Link>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={trendIndicator[theme.trend]}>
                      {trendLabel[theme.trend]}
                    </span>
                    <span className="font-medium text-text-primary">
                      {theme.count} profile{theme.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {/* Frequency bar */}
                <div className="mt-2 overflow-hidden rounded-full bg-surface-secondary">
                  <div
                    className="h-2 rounded-full bg-accent-amber"
                    style={{ width: `${(theme.count / maxCount) * 100}%` }}
                  />
                </div>
                {theme.companies.length > 0 && (
                  <p className="mt-2 text-xs text-text-secondary">
                    Companies: {theme.companies.map((c) => `${c.company} (${c.count})`).join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
