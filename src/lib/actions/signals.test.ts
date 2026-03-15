import { describe, it, expect, vi, beforeEach } from "vitest"

const mockInsert = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      insert: (...args: unknown[]) => {
        mockInsert(...args)
        return { error: null }
      },
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({ data: [], error: null }),
      }),
    }),
  }),
}))

import { submitSignal, getSignalCounts } from "./signals"

function makeFormData(fields: Record<string, string | string[]>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) {
    if (Array.isArray(v)) {
      for (const item of v) fd.append(k, item)
    } else {
      fd.set(k, v)
    }
  }
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("submitSignal", () => {
  it("submits valid signal", async () => {
    const result = await submitSignal(
      makeFormData({ concernCategories: ["Safety culture", "Governance gaps"] })
    )
    expect(result.success).toBe(true)
    expect(result.message).toContain("anonymous")
  })

  it("rejects empty concern categories", async () => {
    const result = await submitSignal(makeFormData({}))
    expect(result.success).toBe(false)
  })

  it("inserts with correct fields", async () => {
    await submitSignal(
      makeFormData({
        concernCategories: ["Safety culture"],
        company: "OpenAI",
        freeText: "Concerned about deployment speed",
      })
    )
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        concern_categories: ["Safety culture"],
        company_optional: "OpenAI",
        free_text_optional: "Concerned about deployment speed",
        status: "approved",
      })
    )
  })
})

describe("getSignalCounts", () => {
  it("returns zero counts when no data", async () => {
    const result = await getSignalCounts()
    expect(result.total).toBe(0)
    expect(result.byCategory).toEqual([])
  })
})
