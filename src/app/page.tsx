export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-primary">
      <div className="bg-surface-inverse px-6 py-24 text-center">
        <h1 className="font-serif text-[5rem] font-extrabold leading-none text-text-inverse tabular-nums">
          0
        </h1>
        <p className="mt-4 text-base text-text-inverse/80">
          AI researchers have left major companies over safety concerns
        </p>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold">The Warning Collective</h2>
        <p className="mt-4 text-text-secondary">
          A public accountability resource tracking safety-motivated departures
          from AI companies.
        </p>
      </div>
    </main>
  )
}
