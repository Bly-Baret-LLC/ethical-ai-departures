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
        className="mx-auto max-w-5xl px-6 py-16"
      >
        <h2 className="font-serif text-2xl font-semibold text-text-primary">
          Latest Activity
        </h2>
        <div className="mt-6 space-y-4">
          {items.map((item, i) => (
            <article
              key={item.slug}
              className={
                i === 0
                  ? "block"
                  : i === 1
                    ? "hidden md:block"
                    : "hidden lg:block"
              }
            >
              <Link
                href={`/profiles/${item.slug}`}
                className="group block rounded-lg border border-stone-200 p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-lg font-semibold text-text-primary group-hover:text-accent-amber">
                    {item.name}
                  </h3>
                  <time
                    dateTime={item.departureDate}
                    className="shrink-0 text-sm text-text-secondary"
                  >
                    {formatRelativeDate(item.departureDate)}
                  </time>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {item.role} · {item.company}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </LatestActivityClient>
  )
}
