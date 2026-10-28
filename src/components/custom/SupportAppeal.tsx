"use client"

import { trackEvent } from "@/lib/analytics"

export function SupportAppeal({ placement }: { placement: "homepage" | "profile" }) {
  const supportLink = (
    <a
      href="https://ko-fi.com/ethicalaidepartures"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("Support Click", { placement })}
      className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-semibold text-accent-red underline decoration-accent-red/40 underline-offset-4 hover:decoration-accent-red"
    >
      Support the site <span aria-hidden="true">→</span>
    </a>
  )

  if (placement === "profile") {
    return (
      <aside aria-label="Support this resource" className="mt-8 border-t border-border-light pt-4 print:hidden">
        <p className="text-sm leading-relaxed text-text-secondary">
          This site costs $1,000 a year to run. Your support helps to keep it free.
        </p>
        {supportLink}
      </aside>
    )
  }

  return (
    <aside aria-label="Support the site" className="border-b border-accent-red/15 bg-accent-red/[0.06] text-accent-red print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 px-4 text-sm">
        <p>Help keep this record free.</p>
        <a
          href="https://ko-fi.com/ethicalaidepartures"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("Support Click", { placement })}
          className="inline-flex min-h-8 items-center gap-1.5 font-medium underline decoration-accent-red/35 underline-offset-4 hover:decoration-accent-red"
        >
          Support EAD <span aria-hidden="true">→</span>
        </a>
      </div>
    </aside>
  )
}
