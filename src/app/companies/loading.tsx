export default function CompaniesLoading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="h-8 w-40 animate-pulse rounded bg-surface-secondary" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-surface-secondary" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-border-light bg-surface-card px-5 py-4"
          >
            <div className="h-5 w-32 animate-pulse rounded bg-surface-secondary" />
            <div className="h-4 w-20 animate-pulse rounded bg-surface-secondary" />
          </div>
        ))}
      </div>
    </main>
  )
}
