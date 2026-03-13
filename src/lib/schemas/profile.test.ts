import { describe, it, expect } from "vitest"
import {
  profileSchema,
  profileSourceSchema,
  concernTagSchema,
  tickerStatsSchema,
  profileRowSchema,
  profileSourceRowSchema,
} from "./profile"

const validProfileRow = {
  id: "b0000000-0000-4000-8000-000000000001",
  slug: "elena-rodriguez",
  name: "Elena Rodriguez",
  photo_url: "https://example.com/photo.jpg",
  company: "OpenAI",
  role: "Safety Lead",
  departure_date: "2025-11-15",
  stated_reason: "Safety concerns deprioritized in favor of shipping timelines.",
  status: "published" as const,
  created_at: "2025-11-20T00:00:00Z",
  updated_at: "2025-11-20T00:00:00Z",
}

const validSourceRow = {
  id: "c0000000-0000-4000-8000-000000000001",
  profile_id: "b0000000-0000-4000-8000-000000000001",
  url: "https://example.com/article",
  title: "Why I Left",
  platform: "Substack",
  published_date: "2025-11-18",
  created_at: "2025-11-20T00:00:00Z",
}

const validTagRow = {
  id: "a0000000-0000-4000-8000-000000000001",
  name: "Safety Deprioritization",
  slug: "safety-deprioritization",
  description: "Company deprioritized safety research in favor of capabilities.",
  created_at: "2025-11-20T00:00:00Z",
}

const validTickerStatsRow = {
  id: "d0000000-0000-4000-8000-000000000001",
  total_count: 42,
  ninety_day_count: 7,
  seniority_breakdown: { "Safety Lead": 5, "Research Director": 3 },
  updated_at: "2025-11-20T00:00:00Z",
}

describe("profileSchema", () => {
  it("parses valid profile row and transforms to camelCase", () => {
    const result = profileSchema.parse(validProfileRow)

    expect(result.id).toBe(validProfileRow.id)
    expect(result.slug).toBe("elena-rodriguez")
    expect(result.name).toBe("Elena Rodriguez")
    expect(result.photoUrl).toBe("https://example.com/photo.jpg")
    expect(result.company).toBe("OpenAI")
    expect(result.role).toBe("Safety Lead")
    expect(result.departureDate).toBe("2025-11-15")
    expect(result.statedReason).toBe(validProfileRow.stated_reason)
    expect(result.status).toBe("published")
    expect(result.createdAt).toBe("2025-11-20T00:00:00Z")
    expect(result.updatedAt).toBe("2025-11-20T00:00:00Z")
  })

  it("accepts nullable photo_url and stated_reason", () => {
    const row = { ...validProfileRow, photo_url: null, stated_reason: null }
    const result = profileSchema.parse(row)
    expect(result.photoUrl).toBeNull()
    expect(result.statedReason).toBeNull()
  })

  it("rejects missing required name", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name: _name, ...row } = validProfileRow
    expect(() => profileRowSchema.parse(row)).toThrow()
  })

  it("rejects invalid status value", () => {
    const row = { ...validProfileRow, status: "pending" }
    expect(() => profileRowSchema.parse(row)).toThrow()
  })

  it("rejects invalid UUID for id", () => {
    const row = { ...validProfileRow, id: "not-a-uuid" }
    expect(() => profileRowSchema.parse(row)).toThrow()
  })

  it("validates all three status enum values", () => {
    for (const status of ["draft", "published", "archived"] as const) {
      const row = { ...validProfileRow, status }
      expect(() => profileSchema.parse(row)).not.toThrow()
    }
  })
})

describe("profileSourceSchema", () => {
  it("parses valid source row and transforms to camelCase", () => {
    const result = profileSourceSchema.parse(validSourceRow)

    expect(result.id).toBe(validSourceRow.id)
    expect(result.profileId).toBe(validSourceRow.profile_id)
    expect(result.url).toBe("https://example.com/article")
    expect(result.title).toBe("Why I Left")
    expect(result.platform).toBe("Substack")
    expect(result.publishedDate).toBe("2025-11-18")
    expect(result.createdAt).toBe("2025-11-20T00:00:00Z")
  })

  it("rejects missing required url", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { url: _url, ...row } = validSourceRow
    expect(() => profileSourceRowSchema.parse(row)).toThrow()
  })

  it("rejects invalid url format", () => {
    const row = { ...validSourceRow, url: "not-a-url" }
    expect(() => profileSourceRowSchema.parse(row)).toThrow()
  })

  it("accepts nullable optional fields", () => {
    const row = {
      ...validSourceRow,
      title: null,
      platform: null,
      published_date: null,
    }
    const result = profileSourceSchema.parse(row)
    expect(result.title).toBeNull()
    expect(result.platform).toBeNull()
    expect(result.publishedDate).toBeNull()
  })
})

describe("concernTagSchema", () => {
  it("parses valid tag row and transforms to camelCase", () => {
    const result = concernTagSchema.parse(validTagRow)

    expect(result.id).toBe(validTagRow.id)
    expect(result.name).toBe("Safety Deprioritization")
    expect(result.slug).toBe("safety-deprioritization")
    expect(result.description).toBe(validTagRow.description)
    expect(result.createdAt).toBe("2025-11-20T00:00:00Z")
  })

  it("accepts nullable description", () => {
    const row = { ...validTagRow, description: null }
    const result = concernTagSchema.parse(row)
    expect(result.description).toBeNull()
  })
})

describe("tickerStatsSchema", () => {
  it("parses valid ticker stats and transforms to camelCase", () => {
    const result = tickerStatsSchema.parse(validTickerStatsRow)

    expect(result.id).toBe(validTickerStatsRow.id)
    expect(result.totalCount).toBe(42)
    expect(result.ninetyDayCount).toBe(7)
    expect(result.seniorityBreakdown).toEqual({
      "Safety Lead": 5,
      "Research Director": 3,
    })
    expect(result.updatedAt).toBe("2025-11-20T00:00:00Z")
  })

  it("defaults seniority_breakdown to empty object", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { seniority_breakdown: _breakdown, ...row } = validTickerStatsRow
    const result = tickerStatsSchema.parse(row)
    expect(result.seniorityBreakdown).toEqual({})
  })

  it("rejects non-integer total_count", () => {
    const row = { ...validTickerStatsRow, total_count: 3.5 }
    expect(() => tickerStatsSchema.parse(row)).toThrow()
  })
})
