"use client"

import { useState } from "react"
import Link from "next/link"
import type { PublicationWithProfile } from "@/lib/schemas/publication"
import { ExpandableText } from "./ExpandableText"
import { curatedPublications } from "@/lib/publication-collection"

interface WritingsSectionProps {
  publications: PublicationWithProfile[]
  concernCounts: { tagName: string; tagSlug: string; count: number }[]
}

export function WritingsSection({ publications, concernCounts }: WritingsSectionProps) {
  const [activeConcern, setActiveConcern] = useState<string | null>(null)
  const works = curatedPublications(publications)
  const counts = concernCounts.map((concern) => ({
    ...concern,
    count: works.filter((work) => work.concernTagSlugs.includes(concern.tagSlug)).length,
  })).filter((concern) => concern.count > 0).sort((a, b) => b.count - a.count)

  const filtered = activeConcern
    ? works.filter((pub) => pub.concernTagSlugs.includes(activeConcern))
    : works

  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-semibold text-text-primary">
        Browse by author’s concern
      </h2>

      {counts.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeConcern && (
            <button
              type="button"
              onClick={() => setActiveConcern(null)}
              className="rounded-full bg-surface-secondary px-3 py-1 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary/80"
            >
              All ({works.length})
            </button>
          )}
          {counts.map((c) => (
            <button
              key={c.tagSlug}
              type="button"
              onClick={() => setActiveConcern(activeConcern === c.tagSlug ? null : c.tagSlug)}
              aria-pressed={activeConcern === c.tagSlug}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeConcern === c.tagSlug
                  ? "bg-accent-amber text-white"
                  : "bg-accent-amber/10 text-accent-amber hover:bg-accent-amber/20"
              }`}
            >
              {c.tagName} ({c.count})
            </button>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-text-secondary">
        {filtered.length} {filtered.length === 1 ? "writing" : "writings"}
        {activeConcern ? " matching this concern" : " total"}
      </p>

      <ul className="mt-3 space-y-4">
        {filtered.map((pub) => (
          <li
            key={pub.id}
            className="rounded-lg border border-border-light bg-surface-card px-5 py-5"
          >
            {pub.url ? (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-info hover:underline"
              >
                {pub.title}
                <span className="ml-1 text-xs" aria-hidden="true">
                  ⤴
                </span>
              </a>
            ) : (
              <span className="font-medium text-text-primary">
                {pub.title}
              </span>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-text-secondary">
              {pub.authors.map((author) => (
                <Link key={author.slug} href={`/profiles/${author.slug}`} className="text-accent-amber hover:underline">
                  {author.name}
                </Link>
              ))}
              {pub.publisher && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{pub.publisher}</span>
                </>
              )}
              {pub.publishedDate && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <time>
                    {new Date(pub.publishedDate + "T00:00:00").toLocaleDateString(
                      undefined,
                      { year: "numeric", ...(pub.publishedDatePrecision !== "year" ? { month: "short" as const } : {}) }
                    )}
                  </time>
                </>
              )}
              {pub.publicationType && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span className="capitalize">
                    {pub.publicationType.replace(/_/g, " ")}
                  </span>
                </>
              )}
            </div>
            {pub.abstract && (
              <ExpandableText text={pub.abstract} clampLines={4} className="mt-3" />
            )}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-lg border border-border-light bg-surface-card px-6 py-8 text-center">
          <p className="text-text-secondary">No writings match this concern.</p>
          <button
            type="button"
            onClick={() => setActiveConcern(null)}
            className="mt-2 text-sm text-accent-amber hover:underline"
          >
            Show all writings
          </button>
        </div>
      )}
    </section>
  )
}
