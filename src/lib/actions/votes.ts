"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { headers } from "next/headers"

const voteInputSchema = z.object({
  predictionId: z.string().uuid(),
  vote: z.enum(["agree", "disagree"]),
  fingerprintHash: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
})

export interface VoteActionResult {
  success: boolean
  message: string
  duplicate?: boolean
}

export async function castVote(formData: FormData): Promise<VoteActionResult> {
  const raw = {
    predictionId: formData.get("predictionId"),
    vote: formData.get("vote"),
    fingerprintHash: formData.get("fingerprintHash"),
    email: formData.get("email") || undefined,
  }

  const parsed = voteInputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()

    // Check for duplicate
    const { data: existing } = await supabase
      .from("prediction_votes")
      .select("id")
      .eq("prediction_id", parsed.data.predictionId)
      .eq("fingerprint_hash", parsed.data.fingerprintHash)
      .single()

    if (existing) {
      return { success: false, message: "You've already voted on this prediction", duplicate: true }
    }

    // Insert vote
    const { error } = await supabase.from("prediction_votes").insert({
      prediction_id: parsed.data.predictionId,
      vote: parsed.data.vote,
      fingerprint_hash: parsed.data.fingerprintHash,
      is_insider: true,
      email: parsed.data.email || null,
    })

    if (error) {
      // Handle unique constraint violation
      if (error.code === "23505") {
        return { success: false, message: "You've already voted on this prediction", duplicate: true }
      }
      throw error
    }

    // Check for anomaly: more than 3x normal rate in last hour
    await checkVoteAnomaly(parsed.data.predictionId, supabase)

    return { success: true, message: "Vote recorded" }
  } catch {
    return { success: false, message: "Failed to record vote. Please try again." }
  }
}

async function checkVoteAnomaly(
  predictionId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Recent hour count
    const { count: hourCount } = await supabase
      .from("prediction_votes")
      .select("*", { count: "exact", head: true })
      .eq("prediction_id", predictionId)
      .gte("created_at", oneHourAgo)

    // 24h average hourly rate
    const { count: dayCount } = await supabase
      .from("prediction_votes")
      .select("*", { count: "exact", head: true })
      .eq("prediction_id", predictionId)
      .gte("created_at", oneDayAgo)

    const avgHourlyRate = (dayCount ?? 0) / 24
    const recentRate = hourCount ?? 0

    if (avgHourlyRate > 0 && recentRate > avgHourlyRate * 3) {
      // Flag anomaly — in a production system this would write to an anomalies table
      // For now, we log it server-side
      const headerStore = await headers()
      console.warn(
        `[ANOMALY] Prediction ${predictionId}: ${recentRate} votes/hr vs ${avgHourlyRate.toFixed(1)} avg. ` +
        `UA: ${headerStore.get("user-agent")?.slice(0, 50)}`
      )
    }
  } catch {
    // Anomaly check is best-effort
  }
}

export function generateFingerprint(userAgent: string, language: string, screenRes: string): string {
  // Simple hash for dedup — not cryptographic
  const input = `${userAgent}|${language}|${screenRes}`
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return Math.abs(hash).toString(36)
}
