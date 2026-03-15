"use server"

import { createClient } from "@/lib/supabase/server"
import { subscribeInputSchema } from "@/lib/schemas/subscription"

export interface SubscribeResult {
  success: boolean
  message: string
}

export async function subscribeEmail(formData: FormData): Promise<SubscribeResult> {
  const raw = { email: formData.get("email") }
  const parsed = subscribeInputSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const { email } = parsed.data

  try {
    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("email_subscriptions")
      .select("id, status")
      .eq("email", email)
      .single()

    if (existing) {
      if (existing.status === "confirmed") {
        return { success: true, message: "You're already subscribed!" }
      }
      if (existing.status === "pending") {
        return { success: true, message: "Check your email to confirm your subscription." }
      }
      // Resubscribe if previously unsubscribed
      await supabase
        .from("email_subscriptions")
        .update({ status: "pending", confirmation_token: crypto.randomUUID() })
        .eq("id", existing.id)

      return { success: true, message: "Check your email to confirm your subscription." }
    }

    // New subscription
    const { error } = await supabase.from("email_subscriptions").insert({
      email,
      status: "pending",
      confirmation_token: crypto.randomUUID(),
    })

    if (error) {
      if (error.code === "23505") {
        // Unique constraint — race condition
        return { success: true, message: "Check your email to confirm your subscription." }
      }
      throw error
    }

    // TODO: Send confirmation email via email provider (Resend, SendGrid, etc.)

    return { success: true, message: "Check your email to confirm your subscription." }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
