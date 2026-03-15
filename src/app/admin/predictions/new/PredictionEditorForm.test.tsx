import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { PredictionEditorForm } from "./PredictionEditorForm"

vi.mock("@/lib/actions/predictions", () => ({
  createPrediction: vi.fn(),
}))

const mockProfiles = [
  { id: "p1", name: "Alice Chen" },
  { id: "p2", name: "Bob Torres" },
]

afterEach(cleanup)

describe("PredictionEditorForm", () => {
  it("renders all required fields", () => {
    render(<PredictionEditorForm profiles={mockProfiles} />)
    expect(screen.getByLabelText(/Source Researcher/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Source Quote/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Resolution Criteria/)).toBeInTheDocument()
  })

  it("renders optional description field", () => {
    render(<PredictionEditorForm profiles={mockProfiles} />)
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument()
  })

  it("renders profile options", () => {
    render(<PredictionEditorForm profiles={mockProfiles} />)
    expect(screen.getByRole("option", { name: "Alice Chen" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Bob Torres" })).toBeInTheDocument()
  })

  it("has placeholder option for researcher select", () => {
    render(<PredictionEditorForm profiles={mockProfiles} />)
    expect(screen.getByRole("option", { name: /Select a researcher/ })).toBeInTheDocument()
  })

  it("renders submit button", () => {
    render(<PredictionEditorForm profiles={mockProfiles} />)
    expect(screen.getByRole("button", { name: "Create Prediction" })).toBeInTheDocument()
  })

  it("shows falsifiability guidance", () => {
    render(<PredictionEditorForm profiles={mockProfiles} />)
    expect(screen.getByText(/falsifiable/i)).toBeInTheDocument()
  })

  it("renders with empty profiles list", () => {
    render(<PredictionEditorForm profiles={[]} />)
    const select = screen.getByLabelText(/Source Researcher/)
    // Only the placeholder option
    expect(select.querySelectorAll("option")).toHaveLength(1)
  })
})
