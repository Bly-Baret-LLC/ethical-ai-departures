import { createClient } from "@/lib/supabase/server"
import {
  publicationSchema,
  publicationWithProfileSchema,
  type Publication,
  type PublicationWithProfile,
} from "@/lib/schemas/publication"

/** Fetch all publications for a specific profile */
export async function getPublicationsByProfileId(profileId: string): Promise<Publication[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("profile_id", profileId)
    .order("published_date", { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => publicationSchema.parse(row))
}

/** Fetch all publications with author info, for aggregate views */
export async function getPublicationsWithProfiles(): Promise<PublicationWithProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("publications")
    .select("*, profiles(name, slug, profile_concern_tags(concern_tags(slug)))")
    .order("published_date", { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => publicationWithProfileSchema.parse(row))
}

/** Fetch publications linked to a specific prediction via the junction table */
export async function getPublicationsByPredictionId(
  predictionId: string
): Promise<PublicationWithProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("publication_predictions")
    .select("publications(*, profiles(name, slug, profile_concern_tags(concern_tags(slug))))")
    .eq("prediction_id", predictionId)

  if (error) throw error
  return (data ?? []).map((row) => {
    const pub = (row as Record<string, unknown>).publications
    return publicationWithProfileSchema.parse(pub)
  })
}

/** Count publications per concern tag (via profile's concern tags) */
export async function getPublicationCountsByConcern(): Promise<
  { tagName: string; tagSlug: string; count: number }[]
> {
  const supabase = await createClient()

  // Get all publications with their profile's concern tags
  const { data, error } = await supabase
    .from("publications")
    .select(`
      id,
      profiles!inner(
        profile_concern_tags(
          concern_tags(name, slug)
        )
      )
    `)

  if (error) throw error
  if (!data?.length) return []

  const counts = new Map<string, { tagName: string; tagSlug: string; count: number }>()

  for (const pub of data) {
    const profile = pub.profiles as unknown as {
      profile_concern_tags: { concern_tags: { name: string; slug: string } }[]
    }
    for (const pct of profile.profile_concern_tags) {
      const tag = pct.concern_tags
      const existing = counts.get(tag.slug)
      if (existing) {
        existing.count++
      } else {
        counts.set(tag.slug, { tagName: tag.name, tagSlug: tag.slug, count: 1 })
      }
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count)
}
