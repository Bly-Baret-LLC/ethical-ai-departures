import { describe, it, expect } from "vitest"
import { formatSeniority } from "./formatSeniority"

describe("formatSeniority", () => {
  it("returns null for empty breakdown", () => {
    expect(formatSeniority({})).toBeNull()
  })

  it("humanizes snake_case keys", () => {
    expect(formatSeniority({ senior_leadership: 1 })).toBe(
      "including 1 senior leader"
    )
  })

  it("pluralizes known roles with count > 1", () => {
    expect(formatSeniority({ researcher: 3 })).toBe(
      "including 3 researchers"
    )
  })

  it("formats two roles with 'and'", () => {
    const result = formatSeniority({
      researcher: 29,
      senior_leadership: 27,
    })
    expect(result).toBe("including 29 researchers and 27 senior leaders")
  })

  it("formats three roles with Oxford comma", () => {
    const result = formatSeniority({
      researcher: 29,
      senior_leadership: 27,
      senior: 4,
    })
    expect(result).toBe(
      "including 29 researchers, 27 senior leaders, and 4 senior employees"
    )
  })

  it("shows top 3 and 'N others' for more than 3 roles", () => {
    const result = formatSeniority({
      researcher: 29,
      senior_leadership: 27,
      senior: 4,
      co_founder: 3,
      vp: 2,
    })
    expect(result).toBe(
      "including 29 researchers, 27 senior leaders, 4 senior employees, and 5 others"
    )
  })

  it("sorts by count descending", () => {
    const result = formatSeniority({
      senior: 1,
      researcher: 5,
    })
    expect(result).toBe("including 5 researchers and 1 senior employee")
  })

  it("filters out zero-count entries", () => {
    const result = formatSeniority({
      researcher: 2,
      senior_leadership: 0,
    })
    expect(result).toBe("including 2 researchers")
  })

  it("falls back to snake_case conversion for unknown keys", () => {
    expect(formatSeniority({ head_of_alignment: 1 })).toBe(
      "including 1 head of alignment"
    )
    expect(formatSeniority({ head_of_alignment: 2 })).toBe(
      "including 2 head of alignments"
    )
  })
})
