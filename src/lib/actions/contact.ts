"use server"

import { sendContactNotification } from "@/lib/email"
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
    await sendContactNotification({
      type: parsed.data.type,
      email: parsed.data.email,
      message: parsed.data.message,
    })

    return { success: true, message: "Message sent — thank you." }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
