import { z } from "zod"

// --- DB row schemas (snake_case — matches Supabase response) ---

export const profileRowSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  photo_url: z.string().nullable(),
  company: z.string(),
  role: z.string(),
  departure_date: z.string(),
  stated_reason: z.string().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  created_at: z.string(),
  updated_at: z.string(),
})

export const profileSourceRowSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  url: z.string().url(),
  title: z.string().nullable(),
  platform: z.string().nullable(),
  published_date: z.string().nullable(),
  created_at: z.string(),
})

export const concernTagRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
})

export const tickerStatsRowSchema = z.object({
  id: z.string().uuid(),
  total_count: z.number().int(),
  ninety_day_count: z.number().int(),
  seniority_breakdown: z.record(z.string(), z.number()).default({}),
  updated_at: z.string(),
})

// --- Transformed schemas (camelCase — used in components) ---

export const profileSchema = profileRowSchema.transform((row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  photoUrl: row.photo_url,
  company: row.company,
  role: row.role,
  departureDate: row.departure_date,
  statedReason: row.stated_reason,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
}))

export const profileSourceSchema = profileSourceRowSchema.transform((row) => ({
  id: row.id,
  profileId: row.profile_id,
  url: row.url,
  title: row.title,
  platform: row.platform,
  publishedDate: row.published_date,
  createdAt: row.created_at,
}))

export const concernTagSchema = concernTagRowSchema.transform((row) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  createdAt: row.created_at,
}))

export const tickerStatsSchema = tickerStatsRowSchema.transform((row) => ({
  id: row.id,
  totalCount: row.total_count,
  ninetyDayCount: row.ninety_day_count,
  seniorityBreakdown: row.seniority_breakdown,
  updatedAt: row.updated_at,
}))

// --- Exported TypeScript types (camelCase) ---

export type ProfileRow = z.input<typeof profileSchema>
export type Profile = z.output<typeof profileSchema>

export type ProfileSourceRow = z.input<typeof profileSourceSchema>
export type ProfileSource = z.output<typeof profileSourceSchema>

export type ConcernTagRow = z.input<typeof concernTagSchema>
export type ConcernTag = z.output<typeof concernTagSchema>

export type TickerStatsRow = z.input<typeof tickerStatsSchema>
export type TickerStats = z.output<typeof tickerStatsSchema>
