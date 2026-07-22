"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { PublicationWithProfile } from "@/lib/schemas/publication"
import type { PredictionWithProfile } from "@/lib/schemas/prediction"
import { WritingsSection } from "./WritingsSection"
import { PredictionCard } from "./PredictionCard"

const TABS = [
  {
    key: "writings",
    label: "Writings",
    description:
      "Peer-reviewed papers, policy reports, and essays authored by departed researchers.",
  },
  {
    key: "predictions",
    label: "Predictions",
    description:
      "Falsifiable claims extracted from researcher statements — tracked against real-world outcomes.",
  },
] as const

type TabKey = (typeof TABS)[number]["key"]

const STATUS_ORDER: Record<string, number> = {
  confirmed: 0,
  partially_resolved: 1,
  open: 2,
  disproven: 3,
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

  const counts = useMemo(() => {
    const adjudicated = predictions.filter((p) => p.recordKind === "prediction")
    const confirmed = adjudicated.filter((p) => p.status === "confirmed").length
    const open = adjudicated.filter((p) => p.status === "open").length
    const disproven = adjudicated.filter((p) => p.status === "disproven").length
    const partial = adjudicated.filter(
      (p) => p.status === "partially_resolved"
    ).length
    return { confirmed, open, disproven, partial, total: adjudicated.length }
  }, [predictions])

  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredPredictions = useMemo(
    () =>
      statusFilter
        ? sortedPredictions.filter((p) => p.status === statusFilter)
        : sortedPredictions,
    [sortedPredictions, statusFilter]
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
              <div className="flex flex-wrap gap-2">
                {!trackerUnderReview && statusFilter && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter(null)}
                    className="rounded-full bg-surface-secondary px-3 py-1 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary/80"
                  >
                    All ({counts.total})
                  </button>
                )}
                {!trackerUnderReview && counts.confirmed > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === "confirmed" ? null : "confirmed")}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      statusFilter === "confirmed"
                        ? "bg-accent-amber text-white"
                        : "bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20"
                    }`}
                  >
                    Confirmed ({counts.confirmed})
                  </button>
                )}
                {!trackerUnderReview && counts.open > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === "open" ? null : "open")}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      statusFilter === "open"
                        ? "bg-accent-amber text-white"
                        : "bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20"
                    }`}
                  >
                    Open ({counts.open})
                  </button>
                )}
                {!trackerUnderReview && counts.disproven > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === "disproven" ? null : "disproven")}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      statusFilter === "disproven"
                        ? "bg-accent-amber text-white"
                        : "bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20"
                    }`}
                  >
                    Disproven ({counts.disproven})
                  </button>
                )}
                {!trackerUnderReview && counts.partial > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter(statusFilter === "partially_resolved" ? null : "partially_resolved")}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      statusFilter === "partially_resolved"
                        ? "bg-accent-amber text-white"
                        : "bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20"
                    }`}
                  >
                    Partial ({counts.partial})
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm text-text-secondary">
                {filteredPredictions.length} prediction{filteredPredictions.length !== 1 ? "s" : ""}
                {statusFilter ? ` matching "${statusFilter.replace("_", " ")}"` : " total"}
              </p>
              <div className="mt-3 space-y-4">
                {filteredPredictions.map((p) => (
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
