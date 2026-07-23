"use client"

import { useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { PublicationWithProfile } from "@/lib/schemas/publication"
import type { PredictionWithProfile } from "@/lib/schemas/prediction"
import { WritingsSection } from "./WritingsSection"
import { PredictionCard } from "./PredictionCard"
import { forecastSummaryLine } from "@/lib/forecasts"

const TABS = [
  {
    key: "writings",
    label: "Writings",
    description:
      "Peer-reviewed papers, policy reports, and essays authored by departed researchers.",
  },
  {
    key: "predictions",
    label: "Forecasts & Warnings",
    description:
      "Forecasts are future-facing statements with observable outcomes. Warnings and claims capture important insider assessments that are not suitable for an accuracy score. Resolution criteria added after an original statement are dated and disclosed.",
  },
] as const

type TabKey = (typeof TABS)[number]["key"]

const STATUS_ORDER: Record<string, number> = {
  confirmed: 0,
  partially_resolved: 1,
  open: 2,
  disproven: 3,
  contradicted: 3,
  not_applicable: 4,
}

interface PublicationsTabsProps {
  publications: PublicationWithProfile[]
  concernCounts: { tagName: string; tagSlug: string; count: number }[]
  predictions: PredictionWithProfile[]
}

export function PublicationsTabs({
  publications,
  concernCounts,
  predictions,
}: PublicationsTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const rawTab = searchParams.get("tab")
  const activeTab: TabKey =
    rawTab === "predictions" ? rawTab : "writings"

  // Scroll to hash target after predictions tab renders
  useEffect(() => {
    if (activeTab === "predictions" && window.location.hash) {
      const id = window.location.hash.slice(1)
      // Small delay to ensure DOM has rendered
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      })
    }
  }, [activeTab])

  const sortedPredictions = useMemo(
    () =>
      [...predictions].sort(
        (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
      ),
    [predictions]
  )

  // Remediation brief §5: contemporaneous claims are excluded from prediction
  // tallies, and aggregate scores are suppressed while any record is under
  // editorial review.
  const trackerUnderReview = useMemo(
    () => predictions.some((p) => p.underReview),
    [predictions]
  )

  const summaryLine = useMemo(
    () => forecastSummaryLine(predictions),
    [predictions]
  )

  const activeTabConfig = TABS.find((t) => t.key === activeTab)!

  function setTab(tab: TabKey) {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === "writings") {
      params.delete("tab")
    } else {
      params.set("tab", tab)
    }
    const qs = params.toString()
    router.push(`/publications${qs ? `?${qs}` : ""}`, { scroll: false })
  }

  return (
    <div className="mt-8">
      <nav
        className="flex gap-6 border-b border-border-light"
        aria-label="Publications sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTab(tab.key)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-accent-amber text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
            aria-current={activeTab === tab.key ? "page" : undefined}
          >
            {tab.label}
            {tab.key === "predictions" && predictions.length > 0 && (
              <span className="ml-1.5 text-xs text-text-secondary">
                ({predictions.length})
              </span>
            )}
          </button>
        ))}
      </nav>

      <p className="mt-4 text-sm text-text-secondary">
        {activeTabConfig.description}
      </p>

      {activeTab === "writings" && (
        <WritingsSection
          publications={publications}
          concernCounts={concernCounts}
        />
      )}

      {activeTab === "predictions" && (
        <section className="mt-4">
          {trackerUnderReview && (
            <p className="mb-4 rounded-md border border-border-light bg-surface-secondary px-4 py-3 text-sm leading-relaxed text-text-secondary">
              <span className="font-medium text-text-primary">
                Under editorial review:
              </span>{" "}
              this tracker&apos;s resolution criteria and adjudications are
              being re-reviewed. Individual records remain visible; aggregate
              confirmation scores are hidden until the review is complete.
            </p>
          )}
          {predictions.length > 0 ? (
            <>
              <p className="text-sm font-medium text-text-primary">
                {summaryLine}
              </p>
              <div className="mt-3 space-y-4">
                {sortedPredictions.map((p) => (
                  <PredictionCard key={p.id} prediction={p} />
                ))}
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
              <p className="text-text-secondary">
                No predictions tracked yet. Predictions will appear here as they
                are extracted from researcher statements and writings.
              </p>
            </div>
          )}
        </section>
      )}

    </div>
  )
}
