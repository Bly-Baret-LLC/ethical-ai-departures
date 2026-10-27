import { describe, expect, it, vi } from "vitest"

const row = vi.hoisted(() => ({
  id: "f0000000-0000-4000-8000-000000000001", profile_id: "b0000000-0000-4000-8000-000000000001",
  title: "A forecast", description: null, source_quote: "An editorial paraphrase", resolution_criteria: "A defined outcome",
  status: "open", record_kind: "prediction", under_review: true,
  is_verbatim_quote: false, source_url: "https://example.org/original",
  criteria_adopted_at: "2026-10-26",
  resolution_date: null, resolution_outcome: null, resolution_rationale: null, resolution_evidence_url: null,
  created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
  profiles: { name: "Researcher", slug: "researcher", company: "Lab" },
}))
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ from: () => ({
  select: () => ({ eq: () => ({ neq: () => ({ single: async () => ({ data: row, error: null }) }) }) }),
}) }) }))
vi.mock("@/lib/supabase/public", () => ({ createPublicClient: vi.fn() }))

import { getPredictionById } from "./predictions"
describe("prediction detail evidence fields", () => {
  it("retains review, quotation status and the original source through parsing", async () => {
    const result = await getPredictionById(row.id)
    expect(result).toMatchObject({ underReview: true, isVerbatimQuote: false, sourceUrl: row.source_url, criteriaAdoptedAt: "2026-10-26" })
  })
})
