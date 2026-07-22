import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [
            { slug: "timnit-gebru", updated_at: "2026-01-01T00:00:00Z", company: "Google" },
          ],
          error: null,
        }),
      }),
    }),
  }),
}))

import sitemap, { normalizeLoc } from "./sitemap"

describe("sitemap (SITE-04 / SITE-05)", () => {
  it("does not include the nonexistent /profiles index route", async () => {
    const entries = await sitemap()
    const urls = entries.map((e) => e.url)
    expect(urls.some((u) => /\/profiles$/.test(u))).toBe(false)
  })

  it("contains no whitespace in any loc value", async () => {
    const entries = await sitemap()
    for (const e of entries) {
      expect(e.url).toBe(e.url.trim())
      expect(/\s/.test(e.url)).toBe(false)
    }
  })

  it("normalizeLoc strips embedded whitespace and line breaks", () => {
    expect(normalizeLoc(" https://example.com/a \n")).toBe(
      "https://example.com/a"
    )
    expect(normalizeLoc("https://example.com/\n  path")).toBe(
      "https://example.com/path"
    )
  })
})
