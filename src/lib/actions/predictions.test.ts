import { describe, it, expect, vi, beforeEach } from "vitest"

const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()
const mockEq = vi.fn()

let singleResponse = { data: { id: "pred-123" }, error: null }
let updateResponse = { error: null }
let selectSingleResponse = { data: { resolution_outcome: "true" }, error: null }

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      insert: (...args: unknown[]) => {
        mockInsert(...args)
        return {
          select: (...sArgs: unknown[]) => {
            mockSelect(...sArgs)
            return {
              single: (...siArgs: unknown[]) => {
                mockSingle(...siArgs)
                return singleResponse
              },
            }
          },
        }
      },
      update: (...args: unknown[]) => {
        mockUpdate(...args)
        return {
          eq: (...eqArgs: unknown[]) => {
            mockEq(...eqArgs)
            return updateResponse
          },
        }
      },
      select: () => ({
        eq: () => ({
          single: () => selectSingleResponse,
        }),
      }),
    }),
  }),
}))

import { createPrediction, submitResolution, reviewResolution } from "./predictions"

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) {
    fd.set(k, v)
  }
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
  singleResponse = { data: { id: "pred-123" }, error: null }
  updateResponse = { error: null }
  selectSingleResponse = { data: { resolution_outcome: "true" }, error: null }
})

describe("createPrediction", () => {
  const valid = {
    profileId: "550e8400-e29b-41d4-a716-446655440000",
    title: "AI safety regulation by 2027",
    sourceQuote: "We will see meaningful regulation within two years.",
    resolutionCriteria: "Major economy passes AI safety legislation by Dec 2027.",
  }

  it("creates prediction with valid data", async () => {
    const result = await createPrediction(makeFormData(valid))
    expect(result.success).toBe(true)
    expect(result.id).toBe("pred-123")
  })

  it("inserts with correct snake_case fields", async () => {
    await createPrediction(makeFormData(valid))
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        profile_id: valid.profileId,
        title: valid.title,
        source_quote: valid.sourceQuote,
        resolution_criteria: valid.resolutionCriteria,
        status: "open",
      })
    )
  })

  it("returns error for missing title", async () => {
    const result = await createPrediction(makeFormData({ ...valid, title: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Title is required")
  })

  it("returns error for missing source quote", async () => {
    const result = await createPrediction(makeFormData({ ...valid, sourceQuote: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Source quote is required")
  })

  it("returns error for missing resolution criteria", async () => {
    const result = await createPrediction(makeFormData({ ...valid, resolutionCriteria: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Resolution criteria is required")
  })

  it("returns error on DB failure", async () => {
    singleResponse = { data: null, error: { message: "fail" } } as never
    const result = await createPrediction(makeFormData(valid))
    expect(result.success).toBe(false)
    expect(result.message).toContain("Failed")
  })
})

describe("submitResolution", () => {
  const valid = {
    predictionId: "550e8400-e29b-41d4-a716-446655440000",
    outcome: "true",
    rationale: "Regulation was passed in EU.",
    resolvedBy: "editor@example.com",
  }

  it("submits resolution and sets pending_review", async () => {
    const result = await submitResolution(makeFormData(valid))
    expect(result.success).toBe(true)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "pending_review",
        resolution_outcome: "true",
      })
    )
  })

  it("returns error for missing rationale", async () => {
    const result = await submitResolution(makeFormData({ ...valid, rationale: "" }))
    expect(result.success).toBe(false)
    expect(result.message).toBe("Rationale is required")
  })
})

describe("reviewResolution", () => {
  const valid = {
    predictionId: "550e8400-e29b-41d4-a716-446655440000",
    approved: "true",
    reviewedBy: "reviewer@example.com",
  }

  it("approves resolution and sets final status", async () => {
    const result = await reviewResolution(makeFormData(valid))
    expect(result.success).toBe(true)
    expect(result.message).toContain("approved")
  })

  it("rejects resolution and reopens prediction", async () => {
    const result = await reviewResolution(
      makeFormData({ ...valid, approved: "false" })
    )
    expect(result.success).toBe(true)
    expect(result.message).toContain("rejected")
  })
})
