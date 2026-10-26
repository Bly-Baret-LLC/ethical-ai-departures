import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import TickerWidget from "./ticker/page"
import StatsWidget from "./stats/page"

vi.mock("@/lib/queries/ticker", () => ({
  getTickerStats: vi.fn().mockResolvedValue({ totalCount: 49, documentedCount: 55, allegedCount: 6 }),
}))
vi.mock("@/lib/queries/companies", () => ({
  getCompanies: vi.fn().mockResolvedValue([
    { company: "OpenAI", count: 28, evidenceLinkedCount: 23, allegedCount: 5 },
    { company: "Google", count: 19, evidenceLinkedCount: 19, allegedCount: 0 },
    { company: "xAI", count: 1, evidenceLinkedCount: 0, allegedCount: 1 },
  ]),
}))
vi.mock("@/lib/queries/themes", () => ({
  getThemeData: vi.fn().mockResolvedValue([{ name: "Alignment Research Gaps", count: 12 }]),
}))

describe("widget evidence counts", () => {
  it("uses the same eligible headline count as the homepage", async () => {
    const html = renderToStaticMarkup(await TickerWidget({ searchParams: Promise.resolve({}) }))
    expect(html).toContain(">49</p>")
    expect(html).not.toContain(">55</p>")
  })
  it("uses company evidence counts and omits allegation-only companies", async () => {
    const html = renderToStaticMarkup(await StatsWidget({ searchParams: Promise.resolve({ type: "company" }) }))
    expect(html).toContain(">23</span>")
    expect(html).not.toContain(">28</span>")
    expect(html).not.toContain("xAI")
  })
  it("uses the theme map's eligible concern totals", async () => {
    const html = renderToStaticMarkup(await StatsWidget({ searchParams: Promise.resolve({ type: "concern" }) }))
    expect(html).toContain("Alignment Research Gaps")
    expect(html).toContain(">12</span>")
  })
})
