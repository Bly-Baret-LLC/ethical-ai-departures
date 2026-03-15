import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProfileEditorForm } from "./ProfileEditorForm"

vi.mock("@/lib/actions/profiles", () => ({
  createProfile: vi.fn(),
}))

afterEach(cleanup)

describe("ProfileEditorForm", () => {
  it("renders all required fields", () => {
    render(<ProfileEditorForm />)
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Company/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Role/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Departure Date/)).toBeInTheDocument()
  })

  it("renders optional fields", () => {
    render(<ProfileEditorForm />)
    expect(screen.getByLabelText(/Stated Reason/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Photo URL/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Status/)).toBeInTheDocument()
  })

  it("renders submit button", () => {
    render(<ProfileEditorForm />)
    expect(screen.getByRole("button", { name: "Create Profile" })).toBeInTheDocument()
  })

  it("has required attributes on mandatory fields", () => {
    render(<ProfileEditorForm />)
    expect(screen.getByLabelText(/Name/)).toBeRequired()
    expect(screen.getByLabelText(/Company/)).toBeRequired()
    expect(screen.getByLabelText(/Role/)).toBeRequired()
    expect(screen.getByLabelText(/Departure Date/)).toBeRequired()
  })

  it("renders status select with draft and published options", () => {
    render(<ProfileEditorForm />)
    const select = screen.getByLabelText(/Status/)
    expect(select).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Draft" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Published" })).toBeInTheDocument()
  })

  it("defaults status to draft", () => {
    render(<ProfileEditorForm />)
    const select = screen.getByLabelText(/Status/) as HTMLSelectElement
    expect(select.value).toBe("draft")
  })

  it("has date input type for departure date", () => {
    render(<ProfileEditorForm />)
    expect(screen.getByLabelText(/Departure Date/)).toHaveAttribute("type", "date")
  })

  it("has url input type for photo URL", () => {
    render(<ProfileEditorForm />)
    expect(screen.getByLabelText(/Photo URL/)).toHaveAttribute("type", "url")
  })
})
