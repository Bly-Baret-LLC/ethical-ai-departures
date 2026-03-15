"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const profileInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  statedReason: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
})

export interface ProfileActionResult {
  success: boolean
  message: string
  id?: string
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function createProfile(formData: FormData): Promise<ProfileActionResult> {
  const raw = {
    name: formData.get("name"),
    company: formData.get("company"),
    role: formData.get("role"),
    departureDate: formData.get("departureDate"),
    statedReason: formData.get("statedReason") || undefined,
    photoUrl: formData.get("photoUrl") || undefined,
    status: formData.get("status") || "draft",
  }

  const parsed = profileInputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        slug: slugify(parsed.data.name),
        name: parsed.data.name,
        company: parsed.data.company,
        role: parsed.data.role,
        departure_date: parsed.data.departureDate,
        stated_reason: parsed.data.statedReason ?? null,
        photo_url: parsed.data.photoUrl || null,
        status: parsed.data.status,
      })
      .select("id")
      .single()

    if (error) throw error

    return { success: true, message: "Profile created successfully", id: data.id }
  } catch {
    return { success: false, message: "Failed to create profile. Please try again." }
  }
}

export async function updateProfileStatus(id: string, status: string): Promise<ProfileActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id)

    if (error) throw error

    return { success: true, message: `Profile ${status === "published" ? "published" : "updated"} successfully` }
  } catch {
    return { success: false, message: "Failed to update profile status." }
  }
}
