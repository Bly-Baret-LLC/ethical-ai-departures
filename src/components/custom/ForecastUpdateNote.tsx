import { getForecastUpdate } from "@/data/forecast-updates"

export function ForecastUpdateNote({ profileSlug, title, compact = false }: {
  profileSlug: string
  title: string
  compact?: boolean
}) {
  const update = getForecastUpdate(profileSlug, title)
  if (!update) return null

  const date = new Date(`${update.reviewedOn}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long", year: "numeric", timeZone: "UTC",
  })
  const content = <>
    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{update.text}</p>
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {update.sources.map((source) => <li key={source.url}>
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent-amber hover:underline">{source.label} ↗</a>
      </li>)}
    </ul>
    <p className="mt-2 text-xs text-text-secondary">Editorial update · Reviewed <time dateTime={update.reviewedOn}>{update.reviewedOn}</time></p>
  </>

  return compact ? (
    <details className="mt-4 border-t border-border-light pt-3">
      <summary className="cursor-pointer text-sm font-medium text-text-primary">{date} update</summary>
      {content}
    </details>
  ) : (
    <section className="mt-6 rounded-md border border-border-light px-4 py-3" aria-label="Editorial update">
      <h2 className="text-sm font-medium text-text-primary">{date} update</h2>
      {content}
    </section>
  )
}
