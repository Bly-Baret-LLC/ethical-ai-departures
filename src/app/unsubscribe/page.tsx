import type { Metadata } from "next"
import Link from "next/link"
import { z } from "zod"
import { createServiceClient } from "@/lib/supabase/server"
import { AnalyticsEvent } from "@/components/custom/AnalyticsEvent"

export const metadata: Metadata = {
  title: "Unsubscribe from email updates",
  robots: { index: false, follow: false },
}

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string | string[] }>
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { token: rawToken } = await searchParams
  const parsed = z.string().uuid().safeParse(rawToken)
  let unsubscribed = false

  if (parsed.success) {
    const supabase = createServiceClient()
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("email_subscriptions")
      .update({
        status: "unsubscribed",
        unsubscribed_at: now,
        updated_at: now,
      })
      .eq("confirmation_token", parsed.data)
      .select("id")
      .maybeSingle()

    unsubscribed = !error && Boolean(data)
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      {unsubscribed && <AnalyticsEvent name="Newsletter Unsubscribed" />}
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        {unsubscribed ? "You’re unsubscribed" : "Unsubscribe link not recognized"}
      </h1>
      <p className="mt-4 leading-relaxed text-text-secondary">
        {unsubscribed
          ? "You won’t receive further Ethical AI Departures updates at this address."
          : "This link may be incomplete or no longer valid."}
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
