import { describe, it, expect, vi, beforeEach } from "vitest"

const mockInsert = vi.fn()

let existingVote: { data: { id: string } | null; error: null } = { data: null, error: null }
let insertResponse = { error: null }
let countResponse = { count: 1, error: null }

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn((table: string) => {
      if (table === "prediction_votes") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                single: () => existingVote,
              }),
            }),
          }),
          insert: (...args: unknown[]) => {
            mockInsert(...args)
            return insertResponse
          },
        }
      }
      return {
        select: () => ({
          eq: () => ({
            gte: () => countResponse,
          }),
        }),
      }
    }),
  }),
}))

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: () => "test-user-agent",
  }),
}))

import { castVote } from "./votes"
import { generateFingerprint } from "../fingerprint"

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) {
    fd.set(k, v)
  }
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
  existingVote = { data: null, error: null }
  insertResponse = { error: null }
  countResponse = { count: 1, error: null }
})

describe("castVote", () => {
  const valid = {
    predictionId: "550e8400-e29b-41d4-a716-446655440000",
    vote: "agree",
    fingerprintHash: "abc123",
  }

  it("records a vote successfully", async () => {
    const result = await castVote(makeFormData(valid))
    expect(result.success).toBe(true)
    expect(result.message).toBe("Vote recorded")
  })

  it("inserts with correct fields", async () => {
    await castVote(makeFormData(valid))
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        prediction_id: valid.predictionId,
        vote: "agree",
        fingerprint_hash: "abc123",
        is_insider: true,
      })
    )
  })

  it("rejects duplicate vote", async () => {
    existingVote = { data: { id: "existing" }, error: null }
    const result = await castVote(makeFormData(valid))
    expect(result.success).toBe(false)
    expect(result.duplicate).toBe(true)
  })

  it("handles unique constraint violation", async () => {
    insertResponse = { error: { code: "23505", message: "unique" } } as never
    const result = await castVote(makeFormData(valid))
    expect(result.success).toBe(false)
    expect(result.duplicate).toBe(true)
  })

  it("returns error for invalid vote type", async () => {
    const result = await castVote(makeFormData({ ...valid, vote: "invalid" }))
    expect(result.success).toBe(false)
  })

  it("returns error for missing fingerprint", async () => {
    const result = await castVote(makeFormData({ ...valid, fingerprintHash: "" }))
    expect(result.success).toBe(false)
  })
})

describe("generateFingerprint", () => {
  it("returns consistent hash for same input", () => {
    const a = generateFingerprint("Mozilla/5.0", "en-US", "1920x1080")
    const b = generateFingerprint("Mozilla/5.0", "en-US", "1920x1080")
    expect(a).toBe(b)
  })

  it("returns different hash for different input", () => {
    const a = generateFingerprint("Mozilla/5.0", "en-US", "1920x1080")
    const b = generateFingerprint("Chrome/100", "fr-FR", "1280x720")
    expect(a).not.toBe(b)
  })

  it("returns non-empty string", () => {
    const fp = generateFingerprint("test", "en", "100x100")
    expect(fp.length).toBeGreaterThan(0)
  })
})
