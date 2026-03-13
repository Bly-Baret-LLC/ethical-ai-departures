import { createClient } from "@/lib/supabase/server"
import { profileSchema } from "@/lib/schemas/profile"

/** Fetch all published profiles, ordered by most recent departure */
export async function getPublishedProfiles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("departure_date", { ascending: false })

  if (error) throw error
  return data.map((row) => profileSchema.parse(row))
}

/** Fetch a single profile by slug */
export async function getProfileBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) throw error
  return profileSchema.parse(data)
}
