import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => ({
      select: () => table === "concern_tags" ? {
        order: async () => ({ data: [{ id: "tag-1", slug: "safety-deprioritization", name: "Safety Deprioritization" }] }),
      } : Promise.resolve({ data: [
        ["direct", true, "published"],
        ["reported", true, "published"],
        ["alleged", true, "published"],
        ["contextual", true, "published"],
        ["direct", false, "published"],
        ["direct", true, "draft"],
      ].map(([evidence, counted, status], index) => ({
        concern_tag_id: "tag-1",
        profiles: {
          company: "Example Lab", status,
          departure_date: index === 0 ? "2026-10-01" : "2026-09-01",
          departure_date_precision: index === 0 ? "year" : "day",
          motive_evidence: evidence, headline_counted: counted,
        },
      })) }),
    }),
  })),
}))

import { getThemeData } from "./themes"

describe("theme evidence counts", () => {
  afterEach(() => vi.useRealTimers())

  it("matches the concern guides' primary-count standard", async () => {
    const themes = await getThemeData()
    expect(themes[0].count).toBe(2)
    expect(themes[0].companies).toEqual([{ company: "Example Lab", count: 2 }])
  })

  it("does not count a year-only sorting anchor as a recent departure", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-08T12:00:00Z"))
    const themes = await getThemeData()
    expect(themes[0].count).toBe(2)
    expect(themes[0].recentCount).toBe(1)
  })
})
