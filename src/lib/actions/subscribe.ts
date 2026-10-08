"use server"

import { createServiceClient } from "@/lib/supabase/server"
import { subscribeInputSchema } from "@/lib/schemas/subscription"

export interface SubscribeResult {
  success: boolean
  message: string
}

export async function subscribeEmail(formData: FormData): Promise<SubscribeResult> {
  const parsed = subscribeInputSchema.safeParse({ email: formData.get("email") })
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }
  try {
    // Email delivery is not a condition of subscribing.
    const { error } = await createServiceClient().rpc("subscribe_email", {
      p_email: parsed.data.email,
    })
    if (error) throw error
    return { success: true, message: "You’re subscribed. Thanks for following Ethical AI Departures." }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
