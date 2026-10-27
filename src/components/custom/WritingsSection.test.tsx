import { afterEach, describe, expect, it } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { WritingsSection } from "./WritingsSection"
import { publicationWithProfileSchema } from "@/lib/schemas/publication"
import { curatedPublications, groupPublications } from "@/lib/publication-collection"

const row = {
  id: "e0000000-0000-4000-8000-000000000001",
  profile_id: "b0000000-0000-4000-8000-000000000001",
  title: "Shared research", url: "https://example.org/paper", publication_type: "paper",
  publisher: "Journal", published_date: "2025-05-01", abstract: "A concise summary.",
  created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  profiles: { name: "Alice", slug: "alice", profile_concern_tags: [{ concern_tags: { slug: "safety" } }] },
}
const alice = publicationWithProfileSchema.parse(row)
const bob = publicationWithProfileSchema.parse({ ...row, id: "e0000000-0000-4000-8000-000000000002", profiles: {
  name: "Bob", slug: "bob", profile_concern_tags: [{ concern_tags: { slug: "governance" } }],
} })
afterEach(cleanup)

describe("curated publications", () => {
  it("groups shared works, preserving all linked authors and concerns", () => {
    const works = groupPublications([bob, alice])
    expect(works).toHaveLength(1)
    expect(works[0].authors.map((a) => a.slug)).toEqual(["alice", "bob"])
    expect(works[0].concernTagSlugs).toEqual(["safety", "governance"])
    expect(groupPublications([alice, bob])).toEqual(works)
    expect(alice.concernTagSlugs).toEqual(["safety"])
  })
  it("omits departure statements and curated exclusions without losing profile data", () => {
    const letter = { ...alice, publicationType: "resignation_letter" as const }
    const excluded = { ...bob, listedInPublications: false }
    expect(curatedPublications([letter, excluded])).toEqual([])
    expect(groupPublications([letter, excluded])).toHaveLength(1)
  })
  it("does not merge unrelated works with no URL or distinct editions", () => {
    expect(groupPublications([{ ...alice, url: null }, { ...bob, url: null }])).toHaveLength(2)
    expect(groupPublications([alice, { ...bob, url: "https://example.org/paper?v=2" }])).toHaveLength(2)
    expect(groupPublications([alice, { ...bob, url: "https://example.org/paper/#abstract" }])).toHaveLength(1)
  })
  it("counts distinct visible works and keeps coauthors visible after filtering", () => {
    render(<WritingsSection publications={[alice, bob, { ...alice, id: "hidden", listedInPublications: false }]} concernCounts={[
      { tagName: "Safety", tagSlug: "safety", count: 99 },
      { tagName: "Governance", tagSlug: "governance", count: 99 },
    ]} />)
    expect(screen.getByText("1 writing total")).toBeInTheDocument()
    expect(screen.getAllByRole("link", { name: /Shared research/ })).toHaveLength(1)
    fireEvent.click(screen.getByRole("button", { name: "Governance (1)" }))
    expect(screen.getByText("1 writing matching this concern")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Alice" })).toHaveAttribute("href", "/profiles/alice")
    expect(screen.getByRole("link", { name: "Bob" })).toHaveAttribute("href", "/profiles/bob")
    fireEvent.click(screen.getByRole("button", { name: "All (1)" }))
    expect(screen.getByText("1 writing total")).toBeInTheDocument()
  })
  it("parses books and respects year-only publication dates", () => {
    const book = publicationWithProfileSchema.parse({ ...row, publication_type: "book", published_date_precision: "year" })
    render(<WritingsSection publications={[book]} concernCounts={[]} />)
    expect(screen.getByText("book")).toBeInTheDocument()
    expect(screen.getByText("2025")).toBeInTheDocument()
    expect(screen.queryByText("May 2025")).not.toBeInTheDocument()
  })
})
