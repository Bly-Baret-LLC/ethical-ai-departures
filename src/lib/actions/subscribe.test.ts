import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockFrom, mockSendSubscriptionConfirmation } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockSendSubscriptionConfirmation: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createServiceClient: () => ({ from: mockFrom }),
}))

vi.mock("@/lib/email", () => ({
  sendSubscriptionConfirmation: (...args: unknown[]) =>
    mockSendSubscriptionConfirmation(...args),
}))

import { subscribeEmail } from "./subscribe"

function lookupBuilder(data: unknown, error: unknown = null) {
  return {
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn().mockResolvedValue({ data, error }),
      })),
    })),
  }
}

function insertBuilder(data: unknown, error: unknown = null) {
  return {
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data, error }),
      })),
    })),
  }
}

function updateBuilder(error: unknown = null) {
  return {
    update: vi.fn(() => ({
      eq: vi.fn().mockResolvedValue({ error }),
    })),
  }
}

function formData(email: string) {
  const data = new FormData()
  data.set("email", email)
  return data
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSendSubscriptionConfirmation.mockResolvedValue(undefined)
})

describe("subscribeEmail", () => {
  it("validates email before touching the private database", async () => {
    const result = await subscribeEmail(formData("not-an-email"))

    expect(result.success).toBe(false)
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it("normalizes and stores a new address before sending confirmation", async () => {
    const insert = insertBuilder({ id: "subscription-1" })
    mockFrom
      .mockReturnValueOnce(lookupBuilder(null))
      .mockReturnValueOnce(insert)
      .mockReturnValueOnce(updateBuilder())

    const result = await subscribeEmail(formData("  Reader@Example.COM "))

    expect(result.success).toBe(true)
    expect(insert.insert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "reader@example.com", status: "pending" })
    )
    expect(mockSendSubscriptionConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ email: "reader@example.com" })
    )
  })

  it("does not reveal whether an address is already confirmed", async () => {
    mockFrom.mockReturnValueOnce(
      lookupBuilder({
        id: "subscription-1",
        status: "confirmed",
        confirmation_token: "11111111-1111-4111-8111-111111111111",
        confirmation_sent_at: new Date().toISOString(),
      })
    )

    const result = await subscribeEmail(formData("reader@example.com"))

    expect(result.success).toBe(true)
    expect(result.message).toContain("isn't already subscribed")
    expect(mockSendSubscriptionConfirmation).not.toHaveBeenCalled()
  })

  it("throttles repeated confirmation emails", async () => {
    mockFrom.mockReturnValueOnce(
      lookupBuilder({
        id: "subscription-1",
        status: "pending",
        confirmation_token: "11111111-1111-4111-8111-111111111111",
        confirmation_sent_at: new Date().toISOString(),
      })
    )

    const result = await subscribeEmail(formData("reader@example.com"))

    expect(result.success).toBe(true)
    expect(mockSendSubscriptionConfirmation).not.toHaveBeenCalled()
  })

  it("returns an error when confirmation delivery fails", async () => {
    mockFrom
      .mockReturnValueOnce(lookupBuilder(null))
      .mockReturnValueOnce(insertBuilder({ id: "subscription-1" }))
    mockSendSubscriptionConfirmation.mockRejectedValueOnce(new Error("delivery failed"))

    const result = await subscribeEmail(formData("reader@example.com"))

    expect(result).toEqual({
      success: false,
      message: "Something went wrong. Please try again.",
    })
  })
})
