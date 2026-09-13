"use server"

import { createServiceClient } from "@/lib/supabase/server"
import { subscribeInputSchema } from "@/lib/schemas/subscription"
import { sendSubscriptionConfirmation } from "@/lib/email"

export interface SubscribeResult {
  success: boolean
  message: string
}

const SUCCESS_MESSAGE =
  "If this address isn't already subscribed, check your email to confirm."
const RESEND_COOLDOWN_MS = 10 * 60 * 1000

export async function subscribeEmail(formData: FormData): Promise<SubscribeResult> {
  const raw = { email: formData.get("email") }
  const parsed = subscribeInputSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  const { email } = parsed.data

  try {
    const supabase = createServiceClient()

    // Check if already subscribed
    const { data: existing, error: lookupError } = await supabase
      .from("email_subscriptions")
      .select("id, status, confirmation_token, confirmation_sent_at")
      .eq("email", email)
      .maybeSingle()

    if (lookupError) throw lookupError

    if (existing) {
      if (existing.status === "confirmed") {
        return { success: true, message: SUCCESS_MESSAGE }
      }

      const recentlySent =
        existing.confirmation_sent_at &&
        Date.now() - new Date(existing.confirmation_sent_at).getTime() <
          RESEND_COOLDOWN_MS

      if (existing.status === "pending" && recentlySent) {
        return { success: true, message: SUCCESS_MESSAGE }
      }

      const token = crypto.randomUUID()
      const { error: updateError } = await supabase
        .from("email_subscriptions")
        .update({
          status: "pending",
          confirmation_token: token,
          confirmation_sent_at: null,
          confirmed_at: null,
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (updateError) throw updateError

      await sendSubscriptionConfirmation({ email, token })
      await supabase
        .from("email_subscriptions")
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq("id", existing.id)

      return { success: true, message: SUCCESS_MESSAGE }
    }

    // New subscription
    const token = crypto.randomUUID()
    const { data: inserted, error } = await supabase
      .from("email_subscriptions")
      .insert({
        email,
        status: "pending",
        confirmation_token: token,
      })
      .select("id")
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint — race condition
        return { success: true, message: SUCCESS_MESSAGE }
      }
      throw error
    }

    await sendSubscriptionConfirmation({ email, token })
    await supabase
      .from("email_subscriptions")
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq("id", inserted.id)

    return { success: true, message: SUCCESS_MESSAGE }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
