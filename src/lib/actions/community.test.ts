import { describe, it, expect, vi, beforeEach } from "vitest"

const mockInsert = vi.fn()

let insertResponse = { error: null }

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      insert: (...args: unknown[]) => {
        mockInsert(...args)
        return insertResponse
      },
    }),
  }),
}))

import { submitFanLetter, giveKudos, submitComment } from "./community"

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) {
    fd.set(k, v)
  }
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
  insertResponse = { error: null }
})

describe("submitFanLetter", () => {
  it("submits valid fan letter", async () => {
    const result = await submitFanLetter(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", text: "Thank you!" })
    )
    expect(result.success).toBe(true)
    expect(result.message).toContain("submitted")
  })

  it("rejects empty text", async () => {
    const result = await submitFanLetter(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", text: "" })
    )
    expect(result.success).toBe(false)
  })

  it("rejects text over 500 chars", async () => {
    const result = await submitFanLetter(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", text: "a".repeat(501) })
    )
    expect(result.success).toBe(false)
  })
})

describe("giveKudos", () => {
  it("gives kudos successfully", async () => {
    const result = await giveKudos(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", fingerprintHash: "abc" })
    )
    expect(result.success).toBe(true)
  })

  it("handles duplicate kudos", async () => {
    insertResponse = { error: { code: "23505", message: "unique" } } as never
    const result = await giveKudos(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", fingerprintHash: "abc" })
    )
    expect(result.success).toBe(false)
    expect(result.message).toContain("already")
  })
})

describe("submitComment", () => {
  it("submits valid comment", async () => {
    const result = await submitComment(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", text: "Great point." })
    )
    expect(result.success).toBe(true)
    expect(result.message).toContain("moderation")
  })

  it("rejects spam with excessive URLs", async () => {
    const spamText = "Check https://a.com https://b.com https://c.com https://d.com"
    const result = await submitComment(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", text: spamText })
    )
    expect(result.success).toBe(false)
    expect(result.message).toContain("links")
  })

  it("rejects repeated content", async () => {
    const spamText = "spam spam spam spam spam"
    const result = await submitComment(
      makeFormData({ profileId: "550e8400-e29b-41d4-a716-446655440000", text: spamText })
    )
    expect(result.success).toBe(false)
    expect(result.message).toContain("repeated")
  })
})
