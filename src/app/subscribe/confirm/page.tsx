import type { Metadata } from "next"
import Link from "next/link"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { AnalyticsEvent } from "@/components/custom/AnalyticsEvent"

export const metadata: Metadata = {
  title: "Confirm email updates",
  robots: { index: false, follow: false },
}

interface ConfirmSubscriptionPageProps {
  searchParams: Promise<{ token?: string | string[] }>
}

export default async function ConfirmSubscriptionPage({
  searchParams,
}: ConfirmSubscriptionPageProps) {
  const { token: rawToken } = await searchParams
  const parsed = z.string().uuid().safeParse(rawToken)
  let confirmed = false

  if (parsed.success) {
    const supabase = createServiceClient()
    const { data: subscription, error: lookupError } = await supabase
      .from("email_subscriptions")
      .select("id, status")
      .eq("confirmation_token", parsed.data)
      .maybeSingle()

    if (!lookupError && subscription?.status === "confirmed") {
      confirmed = true
    } else if (!lookupError && subscription?.status === "pending") {
      const now = new Date().toISOString()
      const { error: updateError } = await supabase
        .from("email_subscriptions")
        .update({ status: "confirmed", confirmed_at: now, updated_at: now })
        .eq("id", subscription.id)

      confirmed = !updateError
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      {confirmed && <AnalyticsEvent name="Newsletter Confirmed" />}
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        {confirmed ? "You’re subscribed" : "Confirmation link not recognized"}
      </h1>
      <p className="mt-4 leading-relaxed text-text-secondary">
        {confirmed
          ? "We’ll email you when a new, source-verified departure profile is published."
          : "This link may be incomplete or no longer valid. You can request a new confirmation from the homepage."}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-medium text-accent-info hover:underline"
      >
        Return to the tracker →
      </Link>
    </main>
  )
}
