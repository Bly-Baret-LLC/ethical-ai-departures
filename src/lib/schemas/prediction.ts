import { z } from "zod"

export const predictionRowSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  source_quote: z.string(),
  resolution_criteria: z.string(),
  status: z.enum([
    "open", "pending_review", "confirmed", "disproven", "partially_resolved",
    "contradicted", "unresolvable", "not_applicable",
  ]),
  resolution_date: z.string().nullable(),
  resolution_outcome: z.enum(["true", "false", "partial"]).nullable(),
  resolution_rationale: z.string().nullable(),
  resolution_evidence_url: z.string().nullable(),
  predicted_date: z.string().nullable(),
  resolved_by: z.string().nullable(),
  reviewed_by: z.string().nullable(),
  review_notes: z.string().nullable(),
  // Remediation-brief fields; `.catch()` keeps rows parseable pre-migration.
  record_kind: z
    .enum(["prediction", "probabilistic_forecast", "warning", "contemporaneous_claim", "editorial_synthesis"])
    .catch("prediction"),
  under_review: z.boolean().catch(false),
  event_date: z.string().nullish().catch(null),
  is_verbatim_quote: z.boolean().nullish().catch(null),
  source_url: z.string().nullish().catch(null),
  criteria_adopted_at: z.string().nullish().catch(null),
  resolution_deadline: z.string().nullish().catch(null),
  created_at: z.string(),
  updated_at: z.string(),
})

export const predictionSchema = predictionRowSchema.transform((row) => ({
  id: row.id,
  profileId: row.profile_id,
  title: row.title,
  description: row.description,
  sourceQuote: row.source_quote,
  resolutionCriteria: row.resolution_criteria,
  status: row.status,
  resolutionDate: row.resolution_date,
  resolutionOutcome: row.resolution_outcome,
  resolutionRationale: row.resolution_rationale,
  resolutionEvidenceUrl: row.resolution_evidence_url,
  predictedDate: row.predicted_date,
  resolvedBy: row.resolved_by,
  reviewedBy: row.reviewed_by,
  reviewNotes: row.review_notes,
  recordKind: row.record_kind,
  underReview: row.under_review,
  eventDate: row.event_date ?? null,
  isVerbatimQuote: row.is_verbatim_quote ?? null,
  sourceUrl: row.source_url ?? null,
  criteriaAdoptedAt: row.criteria_adopted_at ?? null,
  resolutionDeadline: row.resolution_deadline ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
}))

export type Prediction = z.output<typeof predictionSchema>
export type PredictionRow = z.input<typeof predictionRowSchema>

/** Schema for prediction with joined profile name */
export const predictionWithProfileSchema = predictionRowSchema
  .extend({
    profiles: z.object({ name: z.string(), slug: z.string() }),
  })
  .transform((row) => ({
    id: row.id,
    profileId: row.profile_id,
    profileName: row.profiles.name,
    profileSlug: row.profiles.slug,
    title: row.title,
    description: row.description,
    sourceQuote: row.source_quote,
    resolutionCriteria: row.resolution_criteria,
    status: row.status,
    resolutionDate: row.resolution_date,
    resolutionOutcome: row.resolution_outcome,
    resolutionRationale: row.resolution_rationale,
    resolutionEvidenceUrl: row.resolution_evidence_url,
    predictedDate: row.predicted_date,
    resolvedBy: row.resolved_by,
    reviewedBy: row.reviewed_by,
    reviewNotes: row.review_notes,
    recordKind: row.record_kind,
    underReview: row.under_review,
    eventDate: row.event_date ?? null,
    isVerbatimQuote: row.is_verbatim_quote ?? null,
    sourceUrl: row.source_url ?? null,
    criteriaAdoptedAt: row.criteria_adopted_at ?? null,
    resolutionDeadline: row.resolution_deadline ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

export type PredictionWithProfile = z.output<typeof predictionWithProfileSchema>
