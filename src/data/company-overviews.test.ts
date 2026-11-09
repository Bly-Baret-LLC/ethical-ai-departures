import { describe, expect, it } from "vitest"
import { getCompanyOverview } from "./company-overviews"

describe("xAI overview", () => {
  it("attributes Kim's account and reports the company's actual response", () => {
    const copy = getCompanyOverview("xai")!
    expect(copy).toContain("Kim alleges")
    expect(copy).toContain("he said most of the safety team resigned")
    expect(copy).toContain("she was unfamiliar with his case")
    expect(copy).toContain("remains unresolved")
    expect(copy).not.toMatch(/xAI disputed|confirmed retaliation|team dissolved/i)
  })
})
