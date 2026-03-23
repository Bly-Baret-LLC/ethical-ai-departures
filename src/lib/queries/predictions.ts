import { createClient } from "@/lib/supabase/server"
import {
  predictionWithProfileSchema,
  type PredictionWithProfile,
} from "@/lib/schemas/prediction"
import { z } from "zod"

export async function getPredictions(filters?: {
  status?: string
  concern?: string
  researcher?: string
  sort?: string
}): Promise<PredictionWithProfile[]> {
  const supabase = await createClient()

  let query = supabase
    .from("predictions")
    .select("*, profiles(name, slug)")
    .neq("status", "pending_review")

  if (filters?.status) {
    if (filters.status === "resolved") {
      query = query.in("status", ["confirmed", "disproven", "partially_resolved"])
    } else {
      query = query.eq("status", filters.status)
    }
  }

  if (filters?.researcher) {
    query = query.eq("profiles.slug", filters.researcher)
  }

  if (filters?.sort === "votes") {
    query = query.order("created_at", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) throw error

  return (data ?? []).map((row) => predictionWithProfileSchema.parse(row))
}

const predictionDetailSchema = z
  .object({
    id: z.string().uuid(),
    profile_id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    source_quote: z.string(),
    resolution_criteria: z.string(),
    status: z.enum(["open", "pending_review", "confirmed", "disproven", "partially_resolved"]),
    resolution_date: z.string().nullable(),
    resolution_outcome: z.enum(["true", "false", "partial"]).nullable(),
    resolution_rationale: z.string().nullable(),
    resolution_evidence_url: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    profiles: z.object({ name: z.string(), slug: z.string(), company: z.string() }),
  })
  .transform((row) => ({
    id: row.id,
    profileId: row.profile_id,
    profileName: row.profiles.name,
    profileSlug: row.profiles.slug,
    profileCompany: row.profiles.company,
    title: row.title,
    description: row.description,
    sourceQuote: row.source_quote,
    resolutionCriteria: row.resolution_criteria,
    status: row.status,
    resolutionDate: row.resolution_date,
    resolutionOutcome: row.resolution_outcome,
    resolutionRationale: row.resolution_rationale,
    resolutionEvidenceUrl: row.resolution_evidence_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

export type PredictionDetail = z.output<typeof predictionDetailSchema>

export async function getPredictionById(id: string): Promise<PredictionDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("predictions")
    .select("*, profiles(name, slug, company)")
    .eq("id", id)
    .neq("status", "pending_review")
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return predictionDetailSchema.parse(data)
}

export interface VoteCounts {
  agree: number
  disagree: number
  total: number
}

export async function getVoteCounts(predictionId: string): Promise<VoteCounts> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("prediction_votes")
    .select("vote")
    .eq("prediction_id", predictionId)

  const votes = data ?? []
  const agree = votes.filter((v) => v.vote === "agree").length
  const disagree = votes.filter((v) => v.vote === "disagree").length

  return { agree, disagree, total: agree + disagree }
}

export interface TrackRecord {
  profileName: string
  profileSlug: string
  total: number
  totalAll: number
  confirmed: number
  disproven: number
  partial: number
  open: number
  accuracy: number
}

export async function getTrackRecords(): Promise<TrackRecord[]> {
  const supabase = await createClient()

  // Get ALL predictions (not just resolved) so we can show total counts
  const { data, error } = await supabase
    .from("predictions")
    .select("profile_id, status, profiles(name, slug)")
    .neq("status", "pending_review")

  if (error) throw error
  if (!data?.length) return []

  const byProfile = new Map<string, TrackRecord>()

  for (const row of data) {
    const profile = row.profiles as unknown as { name: string; slug: string }
    const key = row.profile_id

    if (!byProfile.has(key)) {
      byProfile.set(key, {
        profileName: profile.name,
        profileSlug: profile.slug,
        total: 0,
        totalAll: 0,
        confirmed: 0,
        disproven: 0,
        partial: 0,
        open: 0,
        accuracy: 0,
      })
    }

    const record = byProfile.get(key)!
    record.totalAll++
    if (row.status === "confirmed") { record.confirmed++; record.total++ }
    else if (row.status === "disproven") { record.disproven++; record.total++ }
    else if (row.status === "partially_resolved") { record.partial++; record.total++ }
    else if (row.status === "open") { record.open++ }
  }

  for (const record of byProfile.values()) {
    record.accuracy = record.total > 0
      ? Math.round(((record.confirmed + record.partial * 0.5) / record.total) * 100)
      : 0
  }

  // Only return researchers who have at least one resolved prediction
  return Array.from(byProfile.values())
    .filter((r) => r.total > 0)
    .sort((a, b) => b.accuracy - a.accuracy)
}

