"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const predictionInputSchema = z.object({
  profileId: z.string().uuid("Invalid profile"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sourceQuote: z.string().min(1, "Source quote is required"),
  resolutionCriteria: z.string().min(1, "Resolution criteria is required"),
  status: z.enum(["open", "pending_review", "confirmed", "disproven", "partially_resolved"]).default("open"),
})

const resolutionInputSchema = z.object({
  predictionId: z.string().uuid(),
  outcome: z.enum(["true", "false", "partial"]),
  rationale: z.string().min(1, "Rationale is required"),
  evidenceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  resolvedBy: z.string().min(1),
})

const reviewInputSchema = z.object({
  predictionId: z.string().uuid(),
  approved: z.boolean(),
  reviewedBy: z.string().min(1),
  reviewNotes: z.string().optional(),
})

export interface PredictionActionResult {
  success: boolean
  message: string
  id?: string
}

export async function createPrediction(formData: FormData): Promise<PredictionActionResult> {
  const raw = {
    profileId: formData.get("profileId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    sourceQuote: formData.get("sourceQuote"),
    resolutionCriteria: formData.get("resolutionCriteria"),
    status: formData.get("status") || "open",
  }

  const parsed = predictionInputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("predictions")
      .insert({
        profile_id: parsed.data.profileId,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        source_quote: parsed.data.sourceQuote,
        resolution_criteria: parsed.data.resolutionCriteria,
        status: parsed.data.status,
      })
      .select("id")
      .single()

    if (error) throw error

    return { success: true, message: "Prediction created successfully", id: data.id }
  } catch {
    return { success: false, message: "Failed to create prediction. Please try again." }
  }
}

export async function submitResolution(formData: FormData): Promise<PredictionActionResult> {
  const raw = {
    predictionId: formData.get("predictionId"),
    outcome: formData.get("outcome"),
    rationale: formData.get("rationale"),
    evidenceUrl: formData.get("evidenceUrl") || undefined,
    resolvedBy: formData.get("resolvedBy"),
  }

  const parsed = resolutionInputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("predictions")
      .update({
        status: "pending_review",
        resolution_outcome: parsed.data.outcome,
        resolution_rationale: parsed.data.rationale,
        resolution_evidence_url: parsed.data.evidenceUrl || null,
        resolved_by: parsed.data.resolvedBy,
      })
      .eq("id", parsed.data.predictionId)

    if (error) throw error

    return { success: true, message: "Resolution submitted for review" }
  } catch {
    return { success: false, message: "Failed to submit resolution." }
  }
}

export async function reviewResolution(formData: FormData): Promise<PredictionActionResult> {
  const raw = {
    predictionId: formData.get("predictionId"),
    approved: formData.get("approved") === "true",
    reviewedBy: formData.get("reviewedBy"),
    reviewNotes: formData.get("reviewNotes") || undefined,
  }

  const parsed = reviewInputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()

    if (parsed.data.approved) {
      // Get current prediction to determine final status
      const { data: prediction } = await supabase
        .from("predictions")
        .select("resolution_outcome")
        .eq("id", parsed.data.predictionId)
        .single()

      const finalStatus =
        prediction?.resolution_outcome === "true"
          ? "confirmed"
          : prediction?.resolution_outcome === "false"
            ? "disproven"
            : "partially_resolved"

      const { error } = await supabase
        .from("predictions")
        .update({
          status: finalStatus,
          reviewed_by: parsed.data.reviewedBy,
          review_notes: parsed.data.reviewNotes ?? null,
        })
        .eq("id", parsed.data.predictionId)

      if (error) throw error

      return { success: true, message: "Resolution approved and published" }
    } else {
      // Reject: revert to open
      const { error } = await supabase
        .from("predictions")
        .update({
          status: "open",
          resolution_outcome: null,
          resolution_rationale: null,
          resolution_evidence_url: null,
          resolved_by: null,
          reviewed_by: parsed.data.reviewedBy,
          review_notes: parsed.data.reviewNotes ?? null,
        })
        .eq("id", parsed.data.predictionId)

      if (error) throw error

      return { success: true, message: "Resolution rejected, prediction reopened" }
    }
  } catch {
    return { success: false, message: "Failed to process review." }
  }
}
