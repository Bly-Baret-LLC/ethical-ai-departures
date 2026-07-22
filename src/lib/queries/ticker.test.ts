import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

let queryResponse: { data: unknown[] | null; error: unknown } = {
  data: [],
  error: null,
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({
        eq: () => queryResponse,
      }),
    }),
  }),
}))

import { getTickerStats } from "./ticker"

const row = (
  departure_date: string,
  motive_evidence: string,
  headline_counted: boolean
) => ({ departure_date, motive_evidence, headline_counted })

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-07-22T12:00:00.000Z"))
})

afterEach(() => {
  vi.useRealTimers()
})

describe("getTickerStats (canonical evidence-model counts)", () => {
  it("counts only direct/reported headline-flagged records in totalCount", async () => {
    queryResponse = {
      data: [
        row("2024-05-14", "direct", true),
        row("2021-04-28", "reported", true),
        row("2026-02-12", "contextual", false),
        row("2025-09-30", "alleged", false),
      ],
      error: null,
    }

    const stats = await getTickerStats()
    expect(stats.totalCount).toBe(2)
    expect(stats.contextualCount).toBe(1)
    expect(stats.allegedCount).toBe(1)
  })

  it("never counts contextual records even if headline_counted is true", async () => {
    queryResponse = {
      data: [row("2024-05-14", "contextual", true)],
      error: null,
    }

    const stats = await getTickerStats()
    expect(stats.totalCount).toBe(0)
    expect(stats.contextualCount).toBe(1)
  })

  it("computes ninetyDayCount from headline records only", async () => {
    queryResponse = {
      data: [
        row("2026-07-01", "direct", true), // within 90 days
        row("2026-07-01", "contextual", false), // within window but contextual
        row("2024-05-14", "direct", true), // outside window
      ],
      error: null,
    }

    const stats = await getTickerStats()
    expect(stats.ninetyDayCount).toBe(1)
    expect(stats.totalCount).toBe(2)
  })

  it("throws on Supabase error", async () => {
    queryResponse = {
      data: null,
      error: { message: "connection refused", code: "PGRST000" },
    }

    await expect(getTickerStats()).rejects.toEqual({
      message: "connection refused",
      code: "PGRST000",
    })
  })
})
