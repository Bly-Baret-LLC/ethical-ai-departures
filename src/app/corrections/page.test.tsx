import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetCorrections = vi.fn()

vi.mock("@/lib/queries/corrections", () => ({
  getCorrections: (...args: unknown[]) => mockGetCorrections(...args),
}))

import CorrectionsPage from "./page"

beforeEach(() => {
  mockGetCorrections.mockResolvedValue([])
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("CorrectionsPage", () => {
  it("renders heading", async () => {
    const jsx = await CorrectionsPage()
    render(jsx)
    expect(screen.getByRole("heading", { name: /Corrections Log/ })).toBeInTheDocument()
  })

  it("shows empty state when no corrections", async () => {
    const jsx = await CorrectionsPage()
    render(jsx)
    expect(screen.getByText(/No corrections have been issued/)).toBeInTheDocument()
  })

  it("renders corrections when they exist", async () => {
    mockGetCorrections.mockResolvedValueOnce([
      {
        id: "c1",
        date: "2025-12-01",
        profileId: "p1",
        description: "Fixed incorrect departure date",
        severity: "minor",
        createdAt: "2025-12-01T00:00:00Z",
      },
    ])

    const jsx = await CorrectionsPage()
    render(jsx)
    expect(screen.getByText("Fixed incorrect departure date")).toBeInTheDocument()
    expect(screen.getByText("Minor")).toBeInTheDocument()
  })
})
