import { describe, expect, it, vi } from "vitest"

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
      ].map(([evidence, counted, status]) => ({
        concern_tag_id: "tag-1",
        profiles: {
          company: "Example Lab", departure_date: "2024-01-01", status,
          motive_evidence: evidence, headline_counted: counted,
        },
      })) }),
    }),
  })),
}))

import { getThemeData } from "./themes"

describe("theme evidence counts", () => {
  it("matches the concern guides' primary-count standard", async () => {
    const themes = await getThemeData()
    expect(themes[0].count).toBe(2)
    expect(themes[0].companies).toEqual([{ company: "Example Lab", count: 2 }])
  })
})
