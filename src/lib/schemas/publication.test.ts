import { describe, it, expect } from "vitest"
import {
  publicationSchema,
  publicationRowSchema,
  publicationWithProfileSchema,
} from "./publication"

const validPublicationRow = {
  id: "e0000000-0000-4000-8000-000000000001",
  profile_id: "b0000000-0000-4000-8000-000000000001",
  title: "Concrete Problems in AI Safety",
  url: "https://arxiv.org/abs/1606.06565",
  publication_type: "paper" as const,
  publisher: "arXiv",
  published_date: "2016-06-21",
  abstract: "Identifies five practical research problems related to accident risk.",
  created_at: "2026-03-15T00:00:00Z",
  updated_at: "2026-03-15T00:00:00Z",
}

describe("publicationRowSchema", () => {
  it("parses a valid publication row", () => {
    expect(() => publicationRowSchema.parse(validPublicationRow)).not.toThrow()
  })

  it("rejects invalid UUID", () => {
    const row = { ...validPublicationRow, id: "not-a-uuid" }
    expect(() => publicationRowSchema.parse(row)).toThrow()
  })

  it("rejects invalid publication_type", () => {
    const row = { ...validPublicationRow, publication_type: "blog_post" }
    expect(() => publicationRowSchema.parse(row)).toThrow()
  })

  it("accepts all valid publication types", () => {
    for (const type of ["paper", "white_paper", "report", "preprint"] as const) {
      const row = { ...validPublicationRow, publication_type: type }
      expect(() => publicationRowSchema.parse(row)).not.toThrow()
    }
  })

  it("rejects missing required title", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title: _title, ...row } = validPublicationRow
    expect(() => publicationRowSchema.parse(row)).toThrow()
  })

  it("accepts nullable optional fields", () => {
    const row = {
      ...validPublicationRow,
      url: null,
      publication_type: null,
      publisher: null,
      published_date: null,
      abstract: null,
    }
    expect(() => publicationRowSchema.parse(row)).not.toThrow()
  })
})

describe("publicationSchema", () => {
  it("transforms snake_case to camelCase", () => {
    const result = publicationSchema.parse(validPublicationRow)

    expect(result.id).toBe(validPublicationRow.id)
    expect(result.profileId).toBe(validPublicationRow.profile_id)
    expect(result.title).toBe("Concrete Problems in AI Safety")
    expect(result.url).toBe("https://arxiv.org/abs/1606.06565")
    expect(result.publicationType).toBe("paper")
    expect(result.publisher).toBe("arXiv")
    expect(result.publishedDate).toBe("2016-06-21")
    expect(result.abstract).toBe(validPublicationRow.abstract)
    expect(result.createdAt).toBe("2026-03-15T00:00:00Z")
    expect(result.updatedAt).toBe("2026-03-15T00:00:00Z")
  })
})

describe("publicationWithProfileSchema", () => {
  it("transforms publication with joined profile data", () => {
    const row = {
      ...validPublicationRow,
      profiles: {
        name: "Dario Amodei",
        slug: "dario-amodei",
        profile_concern_tags: [
          { concern_tags: { slug: "safety-deprioritization" } },
        ],
      },
    }
    const result = publicationWithProfileSchema.parse(row)

    expect(result.profileName).toBe("Dario Amodei")
    expect(result.profileSlug).toBe("dario-amodei")
    expect(result.title).toBe("Concrete Problems in AI Safety")
    expect(result.publicationType).toBe("paper")
    expect(result.concernTagSlugs).toEqual(["safety-deprioritization"])
  })

  it("defaults concern tags to empty array when missing", () => {
    const row = {
      ...validPublicationRow,
      profiles: { name: "Dario Amodei", slug: "dario-amodei" },
    }
    const result = publicationWithProfileSchema.parse(row)
    expect(result.concernTagSlugs).toEqual([])
  })

  it("rejects missing profiles join", () => {
    expect(() => publicationWithProfileSchema.parse(validPublicationRow)).toThrow()
  })
})
