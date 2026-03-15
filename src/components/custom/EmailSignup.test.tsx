import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react"
import { EmailSignup } from "./EmailSignup"

const mockSubscribeEmail = vi.fn()

vi.mock("@/lib/actions/subscribe", () => ({
  subscribeEmail: (...args: unknown[]) => mockSubscribeEmail(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("EmailSignup", () => {
  it("renders email input and subscribe button", () => {
    render(<EmailSignup />)

    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument()
  })

  it("renders heading and description", () => {
    render(<EmailSignup />)

    expect(screen.getByText("Stay Informed")).toBeInTheDocument()
    expect(screen.getByText(/Get notified/)).toBeInTheDocument()
  })

  it("renders GDPR consent text", () => {
    render(<EmailSignup />)

    expect(screen.getByText(/unsubscribe at any time/)).toBeInTheDocument()
    expect(screen.getByText(/never share your email/)).toBeInTheDocument()
  })

  it("shows success message after submission", async () => {
    mockSubscribeEmail.mockResolvedValueOnce({
      success: true,
      message: "Check your email to confirm your subscription.",
    })

    render(<EmailSignup />)

    const input = screen.getByPlaceholderText("your@email.com")
    fireEvent.change(input, { target: { value: "test@example.com" } })

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))
    })

    expect(screen.getByRole("status")).toHaveTextContent("Check your email")
  })

  it("shows error message on failure", async () => {
    mockSubscribeEmail.mockResolvedValueOnce({
      success: false,
      message: "Something went wrong. Please try again.",
    })

    render(<EmailSignup />)

    const input = screen.getByPlaceholderText("your@email.com")
    fireEvent.change(input, { target: { value: "bad@example.com" } })

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))
    })

    expect(screen.getByRole("status")).toHaveTextContent("Something went wrong")
  })

  it("has accessible label for email input", () => {
    render(<EmailSignup />)

    expect(screen.getByLabelText("Email address")).toBeInTheDocument()
  })
})
