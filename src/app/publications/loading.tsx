export default function PublicationsLoading() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="h-8 w-48 animate-pulse rounded bg-surface-secondary" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-surface-secondary" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-secondary" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-surface-secondary" />
      </div>
      <div className="mt-10 space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border-light bg-surface-card p-5"
          >
            <div className="h-5 w-3/4 animate-pulse rounded bg-surface-secondary" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-surface-secondary" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-surface-secondary" />
          </div>
        ))}
      </div>
    </main>
  )
}
