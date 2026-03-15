import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const correctionRowSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  profile_id: z.string().uuid().nullable(),
  description: z.string(),
  severity: z.enum(["minor", "major", "critical"]),
  created_at: z.string(),
})

const correctionSchema = correctionRowSchema.transform((row) => ({
  id: row.id,
  date: row.date,
  profileId: row.profile_id,
  description: row.description,
  severity: row.severity,
  createdAt: row.created_at,
}))

export type Correction = z.output<typeof correctionSchema>

export async function getCorrections(): Promise<Correction[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("corrections")
    .select("*")
    .order("date", { ascending: false })

  if (error) {
    // Table may not exist yet — return empty array
    if (error.code === "42P01") return []
    throw error
  }

  return data.map((row) => correctionSchema.parse(row))
}
