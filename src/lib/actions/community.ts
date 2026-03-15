"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Fan letters
const fanLetterSchema = z.object({
  profileId: z.string().uuid(),
  text: z.string().min(1, "Message is required").max(500, "Maximum 500 characters"),
})

export interface CommunityActionResult {
  success: boolean
  message: string
}

export async function submitFanLetter(formData: FormData): Promise<CommunityActionResult> {
  const raw = {
    profileId: formData.get("profileId"),
    text: formData.get("text"),
  }

  const parsed = fanLetterSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("fan_letters").insert({
      profile_id: parsed.data.profileId,
      text: parsed.data.text,
      status: "pending",
    })

    if (error) throw error
    return { success: true, message: "Your note has been submitted and will appear after moderation." }
  } catch {
    return { success: false, message: "Failed to submit note. Please try again." }
  }
}

// Kudos
export async function giveKudos(formData: FormData): Promise<CommunityActionResult> {
  const profileId = formData.get("profileId") as string
  const fingerprintHash = formData.get("fingerprintHash") as string

  if (!profileId || !fingerprintHash) {
    return { success: false, message: "Invalid request" }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("kudos").insert({
      profile_id: profileId,
      fingerprint_hash: fingerprintHash,
    })

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "You've already given kudos" }
      }
      throw error
    }

    return { success: true, message: "Kudos given!" }
  } catch {
    return { success: false, message: "Failed to give kudos." }
  }
}

// Discussion comments
const commentSchema = z.object({
  profileId: z.string().uuid(),
  text: z.string().min(1, "Comment is required").max(1000, "Maximum 1000 characters"),
  displayName: z.string().max(50).optional(),
  parentId: z.string().uuid().optional(),
})

export async function submitComment(formData: FormData): Promise<CommunityActionResult> {
  const raw = {
    profileId: formData.get("profileId"),
    text: formData.get("text"),
    displayName: formData.get("displayName") || undefined,
    parentId: formData.get("parentId") || undefined,
  }

  const parsed = commentSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  // Basic spam check
  const spamResult = checkSpam(parsed.data.text)
  if (spamResult) {
    return { success: false, message: spamResult }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("discussions").insert({
      profile_id: parsed.data.profileId,
      text: parsed.data.text,
      display_name: parsed.data.displayName ?? "Anonymous",
      parent_id: parsed.data.parentId ?? null,
      status: "pending",
    })

    if (error) throw error
    return { success: true, message: "Comment submitted and will appear after moderation." }
  } catch {
    return { success: false, message: "Failed to submit comment. Please try again." }
  }
}

// Basic spam filtering
function checkSpam(text: string): string | null {
  // Excessive URLs
  const urlCount = (text.match(/https?:\/\//g) || []).length
  if (urlCount > 3) return "Too many links. Please reduce the number of URLs."

  // Repeated content (same word 5+ times)
  const words = text.toLowerCase().split(/\s+/)
  const wordCounts = new Map<string, number>()
  for (const word of words) {
    if (word.length > 3) {
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1)
      if ((wordCounts.get(word) ?? 0) >= 5) {
        return "Comment appears to contain repeated content."
      }
    }
  }

  return null
}
