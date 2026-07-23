"use client"

import { useState } from "react"
import Link from "next/link"
import type { PredictionWithProfile } from "@/lib/schemas/prediction"
import { PredictionStatusBadge } from "./PredictionStatusBadge"
import { ExpandableText } from "./ExpandableText"
import { RECORD_KIND_LABELS, isForecast } from "@/lib/forecasts"

interface PredictionCardProps {
  prediction: PredictionWithProfile
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const [showCriteria, setShowCriteria] = useState(false)

  return (
    <div id={`prediction-${prediction.id}`} className="scroll-mt-24 rounded-lg border border-border-light bg-surface-card px-5 py-5">
      <div className="flex items-start gap-3">
        {isForecast(prediction) ? (
          <PredictionStatusBadge status={prediction.status} />
        ) : (
          <span className="inline-flex items-center rounded-full border border-border-light bg-transparent px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            {RECORD_KIND_LABELS[prediction.recordKind]}
          </span>
        )}
        {prediction.underReview && (
          <span className="inline-flex items-center rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            Under review
          </span>
        )}
        <h3 className="font-medium text-text-primary leading-snug">
          {prediction.title}
        </h3>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-text-secondary">
        <Link
          href={`/profiles/${prediction.profileSlug}`}
          className="text-accent-amber hover:underline"
        >
          {prediction.profileName}
        </Link>
        {prediction.predictedDate && (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>
              Predicted{" "}
              {new Date(prediction.predictedDate + "T00:00:00").toLocaleDateString(undefined, {
                year: "numeric",
              })}
              {prediction.resolutionDate &&
                (prediction.status === "disproven" ||
                  prediction.status === "contradicted" ||
                  prediction.status === "confirmed") && (
                <>
                  , {prediction.status === "confirmed" ? "confirmed" : "contradicted"}{" "}
                  {new Date(prediction.resolutionDate + "T00:00:00").toLocaleDateString(undefined, {
                    year: "numeric",
                  })}
                </>
              )}
            </span>
          </>
        )}
      </div>

      {prediction.sourceQuote && (
        <blockquote className="mt-3 border-l-2 border-accent-amber/30 pl-4">
          <ExpandableText
            text={prediction.sourceQuote}
            clampLines={3}
            className="text-sm italic text-text-secondary"
          />
          <p className="mt-1 text-xs text-text-secondary">
            {prediction.isVerbatimQuote === false
              ? "Paraphrase — not a verbatim quotation."
              : prediction.isVerbatimQuote === true
                ? "Verbatim excerpt."
                : null}
            {prediction.sourceUrl && (
              <a
                href={prediction.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-accent-info underline hover:text-accent-info/80"
              >
                Source
              </a>
            )}
          </p>
        </blockquote>
      )}

      {prediction.resolutionCriteria && isForecast(prediction) && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowCriteria(!showCriteria)}
            className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {showCriteria ? "Hide" : "What would confirm this?"}
            <span className="ml-1" aria-hidden="true">
              {showCriteria ? "▴" : "▾"}
            </span>
          </button>
          {showCriteria && (
            <div className="mt-2 text-sm text-text-secondary rounded-md bg-surface-secondary/30 px-3 py-2">
              <p>{prediction.resolutionCriteria}</p>
              {prediction.criteriaAdoptedAt && (
                <p className="mt-1 text-xs">
                  Resolution criteria adopted{" "}
                  {new Date(prediction.criteriaAdoptedAt + "T00:00:00").toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  {prediction.predictedDate &&
                    prediction.criteriaAdoptedAt > prediction.predictedDate &&
                    " — after the original statement."}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {prediction.resolutionRationale && prediction.status !== "open" && (
        <div className="mt-3 rounded-md bg-surface-secondary/50 px-4 py-3">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Resolution
            {prediction.resolutionDate && (
              <span className="ml-2 font-normal normal-case">
                — {new Date(prediction.resolutionDate + "T00:00:00").toLocaleDateString(undefined, { year: "numeric", month: "short" })}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {prediction.resolutionRationale}
          </p>
          {prediction.resolutionEvidenceUrl && (
            <a
              href={prediction.resolutionEvidenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-red/80 hover:text-accent-red hover:underline"
            >
              View evidence
              <span aria-hidden="true">⤴</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
