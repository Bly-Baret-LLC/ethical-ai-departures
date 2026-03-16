import Link from "next/link"
import { getLatestActivity } from "@/lib/queries/latestActivity"
import { formatRelativeDate } from "@/lib/utils/formatDate"
import { LatestActivityClient } from "./LatestActivityClient"

export async function LatestActivitySlot() {
  let items
  try {
    items = await getLatestActivity()
  } catch (error) {
    console.error("Failed to load latest activity:", error)
    return null
  }

  if (items.length === 0) return null

  return (
    <LatestActivityClient>
      <section
        aria-label="Latest activity"
        className="mx-auto max-w-6xl px-6 py-8"
      >
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Latest Departures
        </h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {items.map((item) => (
            <article key={item.slug} className="shrink-0">
              <Link
                href={`/profiles/${item.slug}`}
                className="group block rounded-lg border border-border-light px-4 py-3 transition-shadow hover:shadow-md"
              >
                <h3 className="font-serif text-base font-semibold text-text-primary group-hover:text-accent-amber whitespace-nowrap">
                  {item.name}
                </h3>
                <p className="mt-0.5 text-sm text-text-secondary whitespace-nowrap">
                  {item.role} · {item.company}
                </p>
                <time
                  dateTime={item.departureDate}
                  className="mt-1 block text-xs text-text-secondary/60"
                >
                  {formatRelativeDate(item.departureDate)}
                </time>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </LatestActivityClient>
  )
}
