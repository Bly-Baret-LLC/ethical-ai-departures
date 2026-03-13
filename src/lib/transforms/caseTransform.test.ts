import { describe, it, expect } from "vitest"
import { snakeToCamel, snakeToCamelObject } from "./caseTransform"

describe("snakeToCamel", () => {
  it("converts simple snake_case to camelCase", () => {
    expect(snakeToCamel("departure_date")).toBe("departureDate")
  })

  it("converts multi-word snake_case", () => {
    expect(snakeToCamel("ninety_day_count")).toBe("ninetyDayCount")
  })

  it("returns single words unchanged", () => {
    expect(snakeToCamel("name")).toBe("name")
  })

  it("handles already camelCase strings", () => {
    expect(snakeToCamel("departureDate")).toBe("departureDate")
  })

  it("handles empty string", () => {
    expect(snakeToCamel("")).toBe("")
  })
})

describe("snakeToCamelObject", () => {
  it("converts all object keys from snake_case to camelCase", () => {
    const input = {
      departure_date: "2025-11-15",
      photo_url: null,
      created_at: "2025-11-20T00:00:00Z",
    }

    const result = snakeToCamelObject(input)

    expect(result).toEqual({
      departureDate: "2025-11-15",
      photoUrl: null,
      createdAt: "2025-11-20T00:00:00Z",
    })
  })

  it("preserves values including nested objects", () => {
    const input = { seniority_breakdown: { "Safety Lead": 5 } }
    const result = snakeToCamelObject(input)
    expect(result.seniorityBreakdown).toEqual({ "Safety Lead": 5 })
  })

  it("handles object with no snake_case keys", () => {
    const input = { name: "Elena", slug: "elena" }
    const result = snakeToCamelObject(input)
    expect(result).toEqual({ name: "Elena", slug: "elena" })
  })
})
