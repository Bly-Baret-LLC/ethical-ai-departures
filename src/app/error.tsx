"use client"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-primary px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-2 text-text-secondary">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-state-hover"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
