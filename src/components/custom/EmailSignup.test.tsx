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

    expect(screen.getByText("Follow documented AI-safety departures")).toBeInTheDocument()
    expect(screen.getByText(/source-verified profile/)).toBeInTheDocument()
  })

  it("explains immediate signup and unsubscribe", () => {
    render(<EmailSignup />)

    expect(screen.getByText(/unsubscribe at any time/)).toBeInTheDocument()
    expect(screen.getByText(/No confirmation needed/)).toBeInTheDocument()
  })

  it("shows success message after submission", async () => {
    mockSubscribeEmail.mockResolvedValueOnce({
      success: true,
      message: "You’re subscribed. Thanks for following Ethical AI Departures.",
    })

    render(<EmailSignup />)

    const input = screen.getByPlaceholderText("your@email.com")
    fireEvent.change(input, { target: { value: "test@example.com" } })

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Subscribe" }))
    })

    expect(screen.getByRole("status")).toHaveTextContent("You’re subscribed")
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
