export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-surface-primary">
      {/* Ticker skeleton */}
      <div className="relative">
        <section className="relative w-full border-[3px] border-accent-red bg-[#f0ebe0] shadow-[inset_0_0_0_5px_#f0ebe0,inset_0_0_0_6px_#1c1917] overflow-hidden">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center px-6 py-8 sm:py-10 md:grid-cols-[1fr_auto]">
            <div className="text-left">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="shrink-0">
                  <div className="h-[72px] w-[120px] animate-pulse rounded bg-accent-red/10 sm:h-[88px] sm:w-[150px] md:h-[104px] md:w-[180px] lg:h-[120px] lg:w-[200px]" />
                </div>
                <div className="max-w-[400px] space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-text-primary/10" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-text-primary/10" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex flex-col items-center bg-surface-primary pb-6" />
      </div>

      {/* Profile browser skeleton */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4">
          <div className="h-10 w-full animate-pulse rounded-md bg-surface-secondary" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-lg border border-border-light bg-surface-card p-6">
              <div className="mb-3 h-5 w-2/3 animate-pulse rounded bg-surface-secondary" />
              <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-surface-secondary" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-secondary" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
