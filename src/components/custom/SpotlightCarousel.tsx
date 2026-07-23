"use client"

import { useState } from "react"
import Link from "next/link"
import { PredictionStatusBadge } from "./PredictionStatusBadge"
import { RECORD_KIND_LABELS, isForecast, type RecordKind } from "@/lib/forecasts"

export interface SpotlightSlide {
  id: string
  title: string
  sourceQuote: string | null
  status: string
  recordKind: RecordKind
  underReview: boolean
  profileName: string
  profileSlug: string
  resolutionEvidenceUrl: string | null
  resolutionDate: string | null
  predictedDate: string | null
  linkedPublications: { title: string; url: string | null }[]
}

interface SpotlightCarouselProps {
  slides: SpotlightSlide[]
  openForecasts: number
  warningsAndClaims: number
  underReview: number
}

export function SpotlightCarousel({
  slides,
  openForecasts,
  warningsAndClaims,
  underReview,
}: SpotlightCarouselProps) {
  const [index, setIndex] = useState(0)
  const current = slides[index]

  function prev() {
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))
  }

  function next() {
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="rounded-lg border border-border-light bg-surface-card px-6 py-5">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          Forecasts &amp; Warnings
        </p>
        <Link
          href="/publications?tab=predictions"
          className="text-xs text-text-secondary transition-colors hover:text-accent-amber sm:shrink-0"
        >
          See all →
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Summary — no accuracy percentage while no forecast has reached a
            valid resolution point (Tracker Review, 2026-07-22) */}
        <div className="shrink-0 text-left">
          <p className="text-3xl font-bold text-accent-amber">
            {openForecasts}
          </p>
          <p className="text-sm text-text-secondary">
            open forecast{openForecasts === 1 ? "" : "s"}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            {warningsAndClaims} warning{warningsAndClaims === 1 ? "" : "s"} &amp; claims
            {underReview > 0 ? ` · ${underReview} under review` : ""}
          </p>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-border-light" />

        {/* Carousel */}
        <div className="min-w-0 flex-1">
          <div>
            <div className="flex flex-col items-start gap-2 sm:flex-row">
              <div className="min-w-0 flex-1">
                {isForecast(current) ? (
                  <PredictionStatusBadge status={current.status} />
                ) : (
                  <span className="inline-flex items-center rounded-full border border-border-light px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                    {RECORD_KIND_LABELS[current.recordKind]}
                  </span>
                )}
                <Link
                  href={`/publications?tab=predictions#prediction-${current.id}`}
                  className="group mt-2 block sm:mt-0"
                >
                  <p className="font-medium text-text-primary leading-snug text-sm group-hover:text-accent-amber transition-colors">
                    {current.title}
                  </p>
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-text-secondary">
                  <span className="text-accent-amber">
                    {current.profileName}
                  </span>
                  {current.predictedDate && (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <span>
                        Predicted{" "}
                        {new Date(current.predictedDate + "T00:00:00").toLocaleDateString(undefined, { year: "numeric" })}
                        {current.resolutionDate && current.status === "confirmed" && (
                          <>
                            , confirmed{" "}
                            {new Date(current.resolutionDate + "T00:00:00").toLocaleDateString(undefined, { year: "numeric" })}
                          </>
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="text-xs text-text-secondary/60 hover:text-accent-amber transition-colors"
              aria-label="Previous record"
            >
              ←
            </button>

            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-4 bg-accent-amber"
                      : "w-1.5 bg-border-light hover:bg-text-secondary"
                  }`}
                  aria-label={`Record ${i + 1} of ${slides.length}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="text-xs text-text-secondary/60 hover:text-accent-amber transition-colors"
              aria-label="Next record"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
