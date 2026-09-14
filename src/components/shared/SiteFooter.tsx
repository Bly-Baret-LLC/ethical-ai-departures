import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border-light bg-surface-primary">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-text-secondary">
          September 2026 update: The headline count now reflects a stricter
          person-level evidence standard.{" "}
          <Link
            href="/corrections"
            className="underline underline-offset-2 transition-colors hover:text-text-primary"
          >
            What changed →
          </Link>
        </p>
        <Link
          href="/about"
          className="shrink-0 text-xs font-medium text-text-secondary underline-offset-2 transition-colors hover:text-text-primary hover:underline"
        >
          How we decide who&apos;s included →
        </Link>
      </div>
    </footer>
  )
}
