import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  id: "p1",
                  title: "AI regulation prediction",
                  resolution_outcome: "true",
                  resolution_rationale: "EU AI Act passed",
                  resolution_date: "2026-01-15",
                  updated_at: "2026-01-15T00:00:00Z",
                  profiles: { name: "Alice Chen" },
                },
              ],
            }),
          }),
        }),
      }),
    }),
  }),
}))

import { GET } from "./route"

describe("Predictions RSS Feed", () => {
  it("returns RSS XML with content type", async () => {
    const response = await GET()
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8")
  })

  it("returns valid RSS structure", async () => {
    const response = await GET()
    const xml = await response.text()
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain("<rss version=\"2.0\"")
    expect(xml).toContain("<channel>")
    expect(xml).toContain("</channel>")
  })

  it("includes prediction items", async () => {
    const response = await GET()
    const xml = await response.text()
    expect(xml).toContain("[Confirmed] AI regulation prediction")
    expect(xml).toContain("EU AI Act passed")
  })

  it("includes feed metadata", async () => {
    const response = await GET()
    const xml = await response.text()
    expect(xml).toContain("The Warning Collective")
    expect(xml).toContain("Prediction Resolutions")
  })

  it("escapes XML entities", async () => {
    const response = await GET()
    const xml = await response.text()
    // Should not contain unescaped ampersands in content
    expect(xml).not.toMatch(/ & /)
  })
})
