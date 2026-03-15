import { describe, it, expect } from "vitest"
import { formatSeniority } from "./formatSeniority"

describe("formatSeniority", () => {
  it("returns null for empty breakdown", () => {
    expect(formatSeniority({})).toBeNull()
  })

  it("formats a single role", () => {
    expect(formatSeniority({ "Safety Lead": 1 })).toBe(
      "including 1 Safety Lead"
    )
  })

  it("pluralizes roles with count > 1", () => {
    expect(formatSeniority({ "Safety Lead": 2 })).toBe(
      "including 2 Safety Leads"
    )
  })

  it("formats two roles with 'and'", () => {
    const result = formatSeniority({
      "Safety Lead": 2,
      "Research Director": 1,
    })
    expect(result).toBe("including 2 Safety Leads and 1 Research Director")
  })

  it("formats three roles with Oxford comma", () => {
    const result = formatSeniority({
      "Safety Lead": 2,
      "Research Director": 1,
      "Senior Researcher": 1,
    })
    expect(result).toBe(
      "including 2 Safety Leads, 1 Research Director, and 1 Senior Researcher"
    )
  })

  it("shows top 3 and 'N others' for more than 3 roles", () => {
    const result = formatSeniority({
      "Safety Lead": 3,
      "Research Director": 2,
      "Senior Researcher": 1,
      "Principal Engineer": 1,
      "Head of Alignment": 1,
    })
    expect(result).toBe(
      "including 3 Safety Leads, 2 Research Directors, 1 Senior Researcher, and 2 others"
    )
  })

  it("sorts by count descending", () => {
    const result = formatSeniority({
      "Research Director": 1,
      "Safety Lead": 5,
    })
    expect(result).toBe("including 5 Safety Leads and 1 Research Director")
  })

  it("filters out zero-count entries", () => {
    const result = formatSeniority({
      "Safety Lead": 2,
      "Research Director": 0,
    })
    expect(result).toBe("including 2 Safety Leads")
  })
})
