"use server"

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { sendDepartureNotification } from "@/lib/email"
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
  const sourceUrl = (formData.get("sourceUrl") as string) || null

  const parsed = profileInputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = createServiceClient()
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

    if (sourceUrl && data.id) {
      await supabase.from("profile_sources").insert({
        profile_id: data.id,
        url: sourceUrl,
      })
    }

    // Notify via email (non-blocking — failure must not affect the submission)
    try {
      await sendDepartureNotification({
        name: parsed.data.name,
        company: parsed.data.company,
        role: parsed.data.role,
        departureDate: parsed.data.departureDate,
        statedReason: parsed.data.statedReason,
        sourceUrl: sourceUrl ?? undefined,
      })
    } catch {
      // Email failure should not affect the submission
    }

    return { success: true, message: "Profile created successfully", id: data.id }
  } catch {
    return { success: false, message: "Failed to create profile. Please try again." }
  }
}

export async function submitDeparture(formData: FormData): Promise<ProfileActionResult> {
  const name = (formData.get("name") as string) || ""
  const company = (formData.get("company") as string) || ""
  const role = (formData.get("role") as string) || ""
  const departureDate = (formData.get("departureDate") as string) || ""
  const statedReason = (formData.get("statedReason") as string) || undefined
  const sourceUrl = (formData.get("sourceUrl") as string) || undefined

  try {
    await sendDepartureNotification({
      name,
      company,
      role,
      departureDate,
      statedReason,
      sourceUrl,
    })

    return { success: true, message: "Submission received — thank you." }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
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
