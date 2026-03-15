import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react"
import { ContactForm } from "./ContactForm"

const mockSubmit = vi.fn()

vi.mock("@/lib/actions/contact", () => ({
  submitContactRequest: (...args: unknown[]) => mockSubmit(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(cleanup)

describe("ContactForm", () => {
  it("renders form fields", () => {
    render(<ContactForm />)
    expect(screen.getByLabelText("Request Type")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Message")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit Request" })).toBeInTheDocument()
  })

  it("renders request type options", () => {
    render(<ContactForm />)
    const select = screen.getByLabelText("Request Type") as HTMLSelectElement
    expect(select.options).toHaveLength(4)
  })

  it("shows success message after submission", async () => {
    mockSubmit.mockResolvedValueOnce({
      success: true,
      message: "Your request has been submitted.",
    })

    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Test message content" } })

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Submit Request" }))
    })

    expect(screen.getByRole("status")).toHaveTextContent("submitted")
  })
})
