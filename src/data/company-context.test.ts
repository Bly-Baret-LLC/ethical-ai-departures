import { describe, expect, it } from "vitest"
import { getCompanyContext } from "./company-context"

describe("company context", () => {
  it("keeps reporting dates, staffing dates and motives distinct", () => {
    const context = getCompanyContext("xai")!
    expect(context.paragraphs).toHaveLength(2)
    expect(context.paragraphs.map(({ source }) => source.date)).toEqual(["2026-01-08", "2026-02-20"])
    const copy = context.paragraphs.map(({ text }) => text).join(" ")
    expect(copy).toContain("did not give reasons")
    expect(copy).toContain("December 2025")
    expect(copy).toContain("safety staff remained")
    expect(copy).not.toMatch(/dissolved|all resigned|six departures|Vincent Stark|Norman Mu|Alex Chen/)
    expect(context.note).toContain("overlapping")
    expect(context.paragraphs.every(({ source }) => source.url.startsWith("https://"))).toBe(true)
  })

  it("adds no unreviewed context to other companies", () => {
    expect(getCompanyContext("openai")).toBeNull()
    expect(getCompanyContext("unknown")).toBeNull()
  })
})
