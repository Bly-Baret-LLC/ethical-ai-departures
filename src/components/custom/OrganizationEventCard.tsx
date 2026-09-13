import type { OrganizationEvent } from "@/data/organization-events"

function formatEventDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function OrganizationEventCard({
  event,
  showCompany = false,
}: {
  event: OrganizationEvent
  showCompany?: boolean
}) {
  return (
    <article
      id={event.slug}
      className="rounded-lg border border-border-light bg-surface-card p-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          {showCompany && (
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-amber">
              {event.company}
            </p>
          )}
          <h3 className="font-serif text-xl font-semibold text-text-primary">
            {event.title}
          </h3>
        </div>
        <time
          dateTime={event.eventDate}
          className="shrink-0 text-sm text-text-secondary"
        >
          {formatEventDate(event.eventDate)}
        </time>
      </div>

      <p className="mt-4 leading-relaxed text-text-secondary">{event.summary}</p>
      <p className="mt-3 leading-relaxed text-text-secondary">{event.outcome}</p>
      <p className="mt-4 border-l-[3px] border-accent-amber pl-4 text-sm leading-relaxed text-text-secondary">
        <strong className="font-medium text-text-primary">People and motive:</strong>{" "}
        {event.peopleNote}
      </p>

      <div className="mt-5">
        <h4 className="text-sm font-medium text-text-primary">Sources</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {event.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-info hover:underline"
              >
                {source.title}
              </a>{" "}
              <span className="text-text-secondary">— {source.publisher}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
