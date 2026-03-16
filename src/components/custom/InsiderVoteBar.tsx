"use client"

import { useState, useCallback, useRef } from "react"
import { castVote, type VoteActionResult } from "@/lib/actions/votes"
import { generateFingerprint } from "@/lib/fingerprint"

function readInsiderStatus(): boolean {
  try {
    return localStorage.getItem("wc:insider-verified") === "true"
  } catch {
    return false
  }
}

function readVoteForPrediction(predictionId: string): "agree" | "disagree" | null {
  try {
    const votes = JSON.parse(localStorage.getItem("wc:votes") || "{}")
    return votes[predictionId] ?? null
  } catch {
    return null
  }
}

interface InsiderVoteBarProps {
  predictionId: string
  initialAgree: number
  initialDisagree: number
}

export function InsiderVoteBar({
  predictionId,
  initialAgree,
  initialDisagree,
}: InsiderVoteBarProps) {
  const [isInsider, setIsInsider] = useState(() => readInsiderStatus())
  const [showGate, setShowGate] = useState(false)
  const [agree, setAgree] = useState(initialAgree)
  const [disagree, setDisagree] = useState(initialDisagree)
  const [hasVoted, setHasVoted] = useState<"agree" | "disagree" | null>(() =>
    readVoteForPrediction(predictionId)
  )
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<VoteActionResult | null>(null)
  const fingerprintRef = useRef(
    typeof navigator !== "undefined"
      ? generateFingerprint(
          navigator.userAgent,
          navigator.language,
          `${screen.width}x${screen.height}`
        )
      : ""
  )

  const handleConfirmInsider = useCallback(() => {
    localStorage.setItem("wc:insider-verified", "true")
    setIsInsider(true)
    setShowGate(false)
  }, [])

  async function handleVote(vote: "agree" | "disagree") {
    if (!isInsider) {
      setShowGate(true)
      return
    }

    if (hasVoted || pending) return

    setPending(true)
    setResult(null)

    // Optimistic update
    if (vote === "agree") setAgree((v) => v + 1)
    else setDisagree((v) => v + 1)

    const fd = new FormData()
    fd.set("predictionId", predictionId)
    fd.set("vote", vote)
    fd.set("fingerprintHash", fingerprintRef.current)

    const res = await castVote(fd)
    setPending(false)

    if (res.success) {
      setHasVoted(vote)
      // Persist to localStorage
      try {
        const votes = JSON.parse(localStorage.getItem("wc:votes") || "{}")
        votes[predictionId] = vote
        localStorage.setItem("wc:votes", JSON.stringify(votes))
      } catch {
        // Best effort
      }
    } else {
      // Revert optimistic update
      if (vote === "agree") setAgree((v) => v - 1)
      else setDisagree((v) => v - 1)

      if (res.duplicate) {
        setHasVoted(vote)
      }
    }
    setResult(res)
  }

  const total = agree + disagree
  const agreePercent = total > 0 ? Math.round((agree / total) * 100) : 50

  return (
    <div className="space-y-3">
      {/* Vote bar */}
      <div className="overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-3 rounded-full bg-accent-amber transition-all duration-300"
          style={{ width: `${agreePercent}%` }}
          role="progressbar"
          aria-valuenow={agreePercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${agreePercent}% agree`}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          {total > 0
            ? `${agreePercent}% agree · ${100 - agreePercent}% disagree · ${total} vote${total !== 1 ? "s" : ""}`
            : "No votes yet"}
        </span>
      </div>

      {/* Vote buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleVote("agree")}
          disabled={!!hasVoted || pending}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            hasVoted === "agree"
              ? "bg-accent-amber text-white"
              : "border border-border-light text-text-primary hover:bg-surface-secondary disabled:opacity-50"
          }`}
        >
          Likely true
        </button>
        <button
          type="button"
          onClick={() => handleVote("disagree")}
          disabled={!!hasVoted || pending}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            hasVoted === "disagree"
              ? "bg-text-primary text-white"
              : "border border-border-light text-text-primary hover:bg-surface-secondary disabled:opacity-50"
          }`}
        >
          Unlikely true
        </button>
      </div>

      {/* Insider gate modal */}
      {showGate && (
        <div className="rounded-lg border border-accent-amber/30 bg-accent-amber/5 p-4">
          <p className="text-sm font-medium text-text-primary">
            Insider Voting
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Voting is open to AI industry professionals. Your judgment helps build a credible collective assessment of these predictions.
          </p>
          <label className="mt-3 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) handleConfirmInsider()
              }}
              className="mt-0.5 rounded border-border-light text-accent-amber focus:ring-accent-amber"
            />
            <span className="text-text-primary">
              I currently work or have worked in the AI industry
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowGate(false)}
            className="mt-2 text-xs text-text-secondary underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {result && !result.success && (
        <p className="text-sm text-text-secondary" role="status">
          {result.message}
        </p>
      )}
    </div>
  )
}
