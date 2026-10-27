import type { PublicationWithProfile } from "@/lib/schemas/publication"

export type CollectedPublication = PublicationWithProfile & {
  authors: { name: string; slug: string }[]
}

// Only normalize trivial URL differences; distinct editions/versions stay separate.
export function publicationKey(pub: Pick<PublicationWithProfile, "url" | "id">): string {
  if (!pub.url) return `id:${pub.id}`
  try {
    const url = new URL(pub.url)
    url.hash = ""
    url.pathname = url.pathname.replace(/\/$/, "")
    return url.toString()
  } catch {
    return pub.url
  }
}

/** Group the display only. Profile records and source relationships stay intact. */
export function groupPublications(publications: PublicationWithProfile[]): CollectedPublication[] {
  const works = new Map<string, CollectedPublication>()
  // Stable representative even when the database returns tied dates in a different order.
  const ordered = [...publications].sort((a, b) =>
    (b.publishedDate ?? "").localeCompare(a.publishedDate ?? "") || a.id.localeCompare(b.id)
  )
  for (const pub of ordered) {
    const key = publicationKey(pub)
    const work = works.get(key)
    if (!work) {
      works.set(key, { ...pub, concernTagSlugs: [...new Set(pub.concernTagSlugs)], authors: [{ name: pub.profileName, slug: pub.profileSlug }] })
    } else {
      if (!work.authors.some((author) => author.slug === pub.profileSlug)) {
        work.authors.push({ name: pub.profileName, slug: pub.profileSlug })
      }
      work.concernTagSlugs = [...new Set([...work.concernTagSlugs, ...pub.concernTagSlugs])]
    }
  }
  return [...works.values()].map((work) => ({
    ...work,
    authors: work.authors.sort((a, b) => a.name.localeCompare(b.name)),
  }))
}

export function curatedPublications(publications: PublicationWithProfile[]): CollectedPublication[] {
  return groupPublications(publications.filter((pub) =>
    pub.listedInPublications !== false && pub.publicationType !== "resignation_letter"
  ))
}
