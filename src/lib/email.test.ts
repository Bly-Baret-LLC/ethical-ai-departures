import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}))

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend }
  },
}))

import {
  sendDepartureNotification,
  sendSubscriptionConfirmation,
  type DepartureSubmission,
} from "./email"

const validSubmission: DepartureSubmission = {
  name: "Jane Smith",
  company: "Acme Corp",
  role: "Lead Engineer",
  departureDate: "2025-06-15",
  statedReason: "Safety concerns",
  sourceUrl: "https://example.com/article",
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv("RESEND_API_KEY", "re_test_key")
  vi.stubEnv("NOTIFICATION_EMAIL", "admin@example.com")
})

describe("sendDepartureNotification", () => {
  it("sends email with correct fields", async () => {
    mockSend.mockResolvedValue({ id: "email-1" })

    await sendDepartureNotification(validSubmission)

    expect(mockSend).toHaveBeenCalledOnce()
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "admin@example.com",
        subject: "New departure submission: Jane Smith (Acme Corp)",
      })
    )
  })

  it("includes all fields in plain text body", async () => {
    mockSend.mockResolvedValue({ id: "email-1" })

    await sendDepartureNotification(validSubmission)

    const call = mockSend.mock.calls[0][0]
    expect(call.text).toContain("Jane Smith")
    expect(call.text).toContain("Acme Corp")
    expect(call.text).toContain("Lead Engineer")
    expect(call.text).toContain("2025-06-15")
    expect(call.text).toContain("Safety concerns")
    expect(call.text).toContain("https://example.com/article")
  })

  it("omits optional fields when not provided", async () => {
    mockSend.mockResolvedValue({ id: "email-1" })
    const minimal: DepartureSubmission = {
      name: "John Doe",
      company: "BigCo",
      role: "Researcher",
      departureDate: "2025-07-01",
    }

    await sendDepartureNotification(minimal)

    const call = mockSend.mock.calls[0][0]
    expect(call.text).not.toContain("Stated Reason:")
    expect(call.text).not.toContain("Source URL:")
  })

  it("skips sending when RESEND_API_KEY is not set", async () => {
    vi.stubEnv("RESEND_API_KEY", "")

    await sendDepartureNotification(validSubmission)

    expect(mockSend).not.toHaveBeenCalled()
  })

  it("skips sending when NOTIFICATION_EMAIL is not set", async () => {
    vi.stubEnv("NOTIFICATION_EMAIL", "")

    await sendDepartureNotification(validSubmission)

    expect(mockSend).not.toHaveBeenCalled()
  })
})

describe("sendSubscriptionConfirmation", () => {
  it("sends a confirmation link using the configured site URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3700/")
    vi.stubEnv("EMAIL_FROM", "Ethical AI Departures <updates@example.com>")
    mockSend.mockResolvedValue({ data: { id: "email-2" }, error: null })

    await sendSubscriptionConfirmation({
      email: "reader@example.com",
      token: "11111111-1111-4111-8111-111111111111",
    })

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Ethical AI Departures <updates@example.com>",
        to: "reader@example.com",
        subject: "Confirm your Ethical AI Departures updates",
        text: expect.stringContaining(
          "http://localhost:3700/subscribe/confirm?token=11111111-1111-4111-8111-111111111111"
        ),
      })
    )
  })

  it("fails closed when email delivery is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "")

    await expect(
      sendSubscriptionConfirmation({
        email: "reader@example.com",
        token: "11111111-1111-4111-8111-111111111111",
      })
    ).rejects.toThrow("RESEND_API_KEY")
  })
})
