"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const seedProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  statedReason: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("published"),
  sources: z
    .array(
      z.object({
        url: z.string().url("Source URL must be valid"),
        title: z.string().min(1, "Source title is required"),
        platform: z.string().optional(),
        publishedDate: z.string().optional(),
      })
    )
    .optional(),
  concernTags: z.array(z.string()).optional(),
})

const seedInputSchema = z.array(seedProfileSchema).min(1, "At least one profile is required")

export type SeedProfile = z.input<typeof seedProfileSchema>

export interface SeedValidationResult {
  valid: boolean
  profileCount: number
  sourceCount: number
  tagCount: number
  errors: Array<{ row: number; field: string; message: string }>
}

export interface SeedImportResult {
  success: boolean
  message: string
  importedCount?: number
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function validateSeedData(jsonString: string): Promise<SeedValidationResult> {
  try {
    const raw = JSON.parse(jsonString)
    const parsed = seedInputSchema.safeParse(raw)

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => {
        const path = issue.path
        const row = typeof path[0] === "number" ? path[0] : -1
        const field = path.slice(1).join(".")
        return { row, field: field || "root", message: issue.message }
      })
      return { valid: false, profileCount: 0, sourceCount: 0, tagCount: 0, errors }
    }

    const profiles = parsed.data
    const sourceCount = profiles.reduce((sum, p) => sum + (p.sources?.length ?? 0), 0)
    const allTags = new Set(profiles.flatMap((p) => p.concernTags ?? []))

    return {
      valid: true,
      profileCount: profiles.length,
      sourceCount,
      tagCount: allTags.size,
      errors: [],
    }
  } catch {
    return {
      valid: false,
      profileCount: 0,
      sourceCount: 0,
      tagCount: 0,
      errors: [{ row: -1, field: "json", message: "Invalid JSON format" }],
    }
  }
}

export async function importSeedData(jsonString: string): Promise<SeedImportResult> {
  try {
    const raw = JSON.parse(jsonString)
    const parsed = seedInputSchema.safeParse(raw)

    if (!parsed.success) {
      return { success: false, message: "Validation failed. Please validate first." }
    }

    const supabase = await createClient()
    const profiles = parsed.data
    let imported = 0

    for (const profile of profiles) {
      const slug = slugify(profile.name)

      // Insert profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          slug,
          name: profile.name,
          company: profile.company,
          role: profile.role,
          departure_date: profile.departureDate,
          stated_reason: profile.statedReason ?? null,
          photo_url: profile.photoUrl || null,
          status: profile.status,
        })
        .select("id")
        .single()

      if (profileError) {
        return {
          success: false,
          message: `Failed to import "${profile.name}": ${profileError.message}`,
          importedCount: imported,
        }
      }

      // Insert sources
      if (profile.sources?.length) {
        const { error: srcError } = await supabase.from("profile_sources").insert(
          profile.sources.map((s) => ({
            profile_id: profileData.id,
            url: s.url,
            title: s.title,
            platform: s.platform ?? null,
            published_date: s.publishedDate ?? null,
          }))
        )
        if (srcError) {
          return {
            success: false,
            message: `Failed to import sources for "${profile.name}": ${srcError.message}`,
            importedCount: imported,
          }
        }
      }

      // Link concern tags
      if (profile.concernTags?.length) {
        for (const tagSlug of profile.concernTags) {
          const { data: tag } = await supabase
            .from("concern_tags")
            .select("id")
            .eq("slug", tagSlug)
            .single()

          if (tag) {
            await supabase.from("profile_concern_tags").insert({
              profile_id: profileData.id,
              concern_tag_id: tag.id,
            })
          }
        }
      }

      imported++
    }

    // Recalculate ticker stats
    try {
      const { count: totalCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")

      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      const { count: ninetyDayCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .gte("departure_date", ninetyDaysAgo.toISOString().split("T")[0])

      await supabase
        .from("ticker_stats")
        .upsert({
          id: 1,
          total_count: totalCount ?? 0,
          ninety_day_count: ninetyDayCount ?? 0,
          updated_at: new Date().toISOString(),
        })
    } catch {
      // Stats update is best-effort
    }

    return {
      success: true,
      message: `Successfully imported ${imported} profile${imported !== 1 ? "s" : ""}`,
      importedCount: imported,
    }
  } catch {
    return { success: false, message: "Import failed. Please try again." }
  }
}
