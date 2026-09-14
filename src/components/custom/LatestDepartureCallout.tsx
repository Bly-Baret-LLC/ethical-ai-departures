"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

export function LatestDepartureCallout() {
  return (
    <section
      aria-labelledby="latest-departure-heading"
      className="mx-auto max-w-6xl px-6 pb-2"
    >
      <div className="rounded-lg border border-accent-amber/40 bg-accent-amber/5 px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-amber">
            Latest verified departure · September 8, 2026
          </p>
          <h2
            id="latest-departure-heading"
            className="mt-1 font-serif text-lg font-semibold leading-snug text-text-primary"
          >
            Jacob Coxon resigns from Anthropic over the race toward
            self-improving AI
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            His first-party statement directly connects his departure to AI
            safety concerns. The record includes follow-up reporting and
            Anthropic&apos;s response.
          </p>
        </div>
        <Link
          href="/profiles/jacob-coxon"
          prefetch={false}
          onClick={() =>
            trackEvent("Latest Departure Click", { profile: "jacob-coxon" })
          }
          className="mt-3 inline-flex shrink-0 text-sm font-medium text-accent-info hover:underline sm:mt-0"
        >
          Read the sourced record →
        </Link>
      </div>
    </section>
  )
}
