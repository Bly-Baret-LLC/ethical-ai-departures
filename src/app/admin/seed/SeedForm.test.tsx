import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { SeedForm } from "./SeedForm"

vi.mock("@/lib/actions/seed", () => ({
  validateSeedData: vi.fn(),
  importSeedData: vi.fn(),
}))

afterEach(cleanup)

describe("SeedForm", () => {
  it("renders file upload input", () => {
    render(<SeedForm />)
    expect(screen.getByLabelText(/Upload JSON File/)).toBeInTheDocument()
  })

  it("renders JSON textarea", () => {
    render(<SeedForm />)
    expect(screen.getByLabelText(/paste JSON directly/)).toBeInTheDocument()
  })

  it("renders validate button", () => {
    render(<SeedForm />)
    expect(screen.getByRole("button", { name: "Validate" })).toBeInTheDocument()
  })

  it("renders import button", () => {
    render(<SeedForm />)
    expect(screen.getByRole("button", { name: "Import" })).toBeInTheDocument()
  })

  it("disables validate when textarea is empty", () => {
    render(<SeedForm />)
    expect(screen.getByRole("button", { name: "Validate" })).toBeDisabled()
  })

  it("disables import when not validated", () => {
    render(<SeedForm />)
    expect(screen.getByRole("button", { name: "Import" })).toBeDisabled()
  })

  it("has file input that accepts .json", () => {
    render(<SeedForm />)
    expect(screen.getByLabelText(/Upload JSON File/)).toHaveAttribute("accept", ".json")
  })
})
