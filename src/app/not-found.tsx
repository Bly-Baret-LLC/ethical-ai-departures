import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-primary px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">
          Page not found
        </h1>
        <p className="mt-2 text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-state-hover"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}
