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

  it("shows the sitewide audit when there are no database corrections", async () => {
    const jsx = await CorrectionsPage()
    render(jsx)
    expect(
      screen.getByText(/completed a sitewide audit of Context only profiles/)
    ).toBeInTheDocument()
    expect(screen.getByText(/from 69 published person records to 39 evidence-linked departures/)).toBeInTheDocument()
    expect(screen.getAllByText("Major")).toHaveLength(2)
    expect(screen.getByText(/Corrected the criteria attached to Geoffrey Hinton/)).toBeInTheDocument()
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
    expect(screen.getAllByText("Minor")).toHaveLength(3)
    expect(screen.getByText(/Corrected the summary of Suchir Balaji/)).toBeInTheDocument()
  })

  it("discloses Adler's date precision correction without changing his departure year", async () => {
    render(await CorrectionsPage())
    expect(screen.getByText(/Changed Steven Adler’s departure date from an unsupported exact day to year precision/)).toBeInTheDocument()
    expect(screen.getByText(/His departure year and evidence classification are unchanged/)).toBeInTheDocument()
  })
})
