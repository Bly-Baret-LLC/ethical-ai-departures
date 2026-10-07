"use client"

import { usePathname } from "next/navigation"

export function SkipLinks() {
  const pathname = usePathname()
  const hasProfileList = pathname === "/" || pathname.startsWith("/concerns/")
  return (
    <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-inverse focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-inverse"
      >
        Skip to main content
      </a>
      {hasProfileList && <a
        href="#profiles"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-14 focus:z-50 focus:rounded-md focus:bg-surface-inverse focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-inverse"
      >
        Skip to profiles
      </a>}
    </nav>
  )
}
