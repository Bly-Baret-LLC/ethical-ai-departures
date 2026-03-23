"use client"

import { useState } from "react"
import Link from "next/link"
import { PredictionStatusBadge } from "./PredictionStatusBadge"

export interface SpotlightSlide {
  id: string
  title: string
  sourceQuote: string | null
  status: string
  profileName: string
  profileSlug: string
  resolutionEvidenceUrl: string | null
  resolutionDate: string | null
  predictedDate: string | null
  linkedPublications: { title: string; url: string | null }[]
}

interface SpotlightCarouselProps {
  slides: SpotlightSlide[]
  total: number
}

export function SpotlightCarousel({ slides, total }: SpotlightCarouselProps) {
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
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          Prediction Tracker
        </p>
        <Link
          href="/publications?tab=predictions"
          className="text-xs text-text-secondary hover:text-accent-amber transition-colors shrink-0"
        >
          See all predictions →
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Accuracy stat */}
        <div className="shrink-0 text-center sm:text-left">
          <p className="text-3xl font-bold text-accent-amber">
            {slides.length} of {total}
          </p>
          <p className="text-sm text-text-secondary">
            predictions confirmed
          </p>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-border-light" />

        {/* Carousel */}
        <div className="min-w-0 flex-1">
          <div>
            <div className="flex items-start gap-2">
              <PredictionStatusBadge status={current.status} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/publications?tab=predictions#prediction-${current.id}`}
                  className="group"
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
                        {current.resolutionDate && (
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
              aria-label="Previous prediction"
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
                  aria-label={`Prediction ${i + 1} of ${slides.length}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="text-xs text-text-secondary/60 hover:text-accent-amber transition-colors"
              aria-label="Next prediction"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
