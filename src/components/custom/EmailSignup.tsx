"use client"

import { useState, useRef } from "react"
import { subscribeEmail, type SubscribeResult } from "@/lib/actions/subscribe"

export function EmailSignup() {
  const [result, setResult] = useState<SubscribeResult | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    const res = await subscribeEmail(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
    }
  }

  return (
    <div className="rounded-lg border border-border-light bg-surface-card p-6">
      <h3 className="font-serif text-lg font-semibold text-text-primary">
        Stay Informed
      </h3>
      <p className="mt-1 text-sm text-text-secondary">
        Get notified when new profiles are published or predictions are
        resolved.
      </p>

      <form ref={formRef} action={handleSubmit} className="mt-4 flex gap-2">
        <label htmlFor="email-signup" className="sr-only">
          Email address
        </label>
        <input
          id="email-signup"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="min-w-0 flex-1 rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90 disabled:opacity-50"
        >
          {pending ? "..." : "Subscribe"}
        </button>
      </form>

      {result && (
        <p
          className={`mt-3 text-sm ${result.success ? "text-green-600" : "text-red-600"}`}
          role="status"
        >
          {result.message}
        </p>
      )}

      <p className="mt-3 text-xs text-text-secondary/70">
        We send occasional updates about new departures and prediction outcomes.
        You can unsubscribe at any time via the link in each email. We never
        share your email with third parties.
      </p>
    </div>
  )
}
