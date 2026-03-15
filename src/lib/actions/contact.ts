"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const contactInputSchema = z.object({
  type: z.enum(["correction", "takedown", "press", "general"]),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export interface ContactResult {
  success: boolean
  message: string
}

export async function submitContactRequest(formData: FormData): Promise<ContactResult> {
  const raw = {
    type: formData.get("type"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  const parsed = contactInputSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("contact_requests").insert({
      type: parsed.data.type,
      email: parsed.data.email,
      message: parsed.data.message,
    })

    if (error) throw error

    return { success: true, message: "Your request has been submitted. We'll respond within 5 business days." }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
