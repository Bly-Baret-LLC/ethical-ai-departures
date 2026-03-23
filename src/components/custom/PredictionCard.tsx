"use client"

import { useState } from "react"
import Link from "next/link"
import type { PredictionWithProfile } from "@/lib/schemas/prediction"
import { PredictionStatusBadge } from "./PredictionStatusBadge"
import { ExpandableText } from "./ExpandableText"

interface PredictionCardProps {
  prediction: PredictionWithProfile
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const [showCriteria, setShowCriteria] = useState(false)

  return (
    <div id={`prediction-${prediction.id}`} className="scroll-mt-24 rounded-lg border border-border-light bg-surface-card px-5 py-5">
      <div className="flex items-start gap-3">
        <PredictionStatusBadge status={prediction.status} />
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
              {prediction.resolutionDate && prediction.status !== "open" && (
                <>
                  , {prediction.status === "disproven" ? "disproven" : "confirmed"}{" "}
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
        </blockquote>
      )}

      {prediction.resolutionCriteria && (
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
            <p className="mt-2 text-sm text-text-secondary rounded-md bg-surface-secondary/30 px-3 py-2">
              {prediction.resolutionCriteria}
            </p>
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
