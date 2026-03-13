import { describe, it, expect, vi, beforeEach } from "vitest"

const mockTickerData = {
  id: "d0000000-0000-4000-8000-000000000001",
  total_count: 6,
  ninety_day_count: 2,
  seniority_breakdown: { "Safety Lead": 1, "Research Director": 1 },
  updated_at: "2025-11-20T00:00:00Z",
}

let singleResponse: { data: unknown | null; error: unknown } = {
  data: mockTickerData,
  error: null,
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({
        single: () => singleResponse,
      }),
    }),
  }),
}))

import { getTickerStats } from "./ticker"

beforeEach(() => {
  singleResponse = { data: mockTickerData, error: null }
})

describe("getTickerStats", () => {
  it("returns ticker stats with camelCase keys", async () => {
    const stats = await getTickerStats()

    expect(stats.totalCount).toBe(6)
    expect(stats.ninetyDayCount).toBe(2)
    expect(stats.seniorityBreakdown).toEqual({
      "Safety Lead": 1,
      "Research Director": 1,
    })
    expect(stats.updatedAt).toBe("2025-11-20T00:00:00Z")
  })

  it("throws on Supabase error", async () => {
    singleResponse = {
      data: null,
      error: { message: "connection refused", code: "PGRST000" },
    }

    await expect(getTickerStats()).rejects.toEqual({
      message: "connection refused",
      code: "PGRST000",
    })
  })
})
