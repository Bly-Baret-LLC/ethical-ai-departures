import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetPredictions = vi.fn()

vi.mock("@/lib/queries/predictions", () => ({
  getPredictions: (...args: unknown[]) => mockGetPredictions(...args),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import PredictionsPage from "./page"

afterEach(cleanup)

const mockPrediction = {
  id: "p1",
  profileId: "prof1",
  profileName: "Alice Chen",
  profileSlug: "alice-chen",
  title: "AI regulation by 2027",
  description: "Meaningful regulation will be enacted",
  sourceQuote: "We will see regulation",
  resolutionCriteria: "Major economy passes legislation",
  status: "open" as const,
  resolutionDate: null,
  resolutionOutcome: null,
  resolutionRationale: null,
  resolutionEvidenceUrl: null,
  resolvedBy: null,
  reviewedBy: null,
  reviewNotes: null,
  createdAt: "2025-06-01T00:00:00Z",
  updatedAt: "2025-06-01T00:00:00Z",
}

describe("PredictionsPage", () => {
  it("renders heading", async () => {
    mockGetPredictions.mockResolvedValue([])
    const jsx = await PredictionsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByRole("heading", { name: /Predictions Tracker/ })).toBeInTheDocument()
  })

  it("renders empty state when no predictions", async () => {
    mockGetPredictions.mockResolvedValue([])
    const jsx = await PredictionsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText(/No predictions yet/)).toBeInTheDocument()
  })

  it("renders prediction list", async () => {
    mockGetPredictions.mockResolvedValue([mockPrediction])
    const jsx = await PredictionsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText("AI regulation by 2027")).toBeInTheDocument()
    expect(screen.getByText("Alice Chen")).toBeInTheDocument()
  })

  it("renders filter buttons", async () => {
    mockGetPredictions.mockResolvedValue([])
    const jsx = await PredictionsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText("All")).toBeInTheDocument()
    expect(screen.getByText("Open")).toBeInTheDocument()
    expect(screen.getByText("Resolved")).toBeInTheDocument()
  })

  it("renders track record link", async () => {
    mockGetPredictions.mockResolvedValue([])
    const jsx = await PredictionsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText(/Track Record/)).toBeInTheDocument()
  })

  it("passes filter params to query", async () => {
    mockGetPredictions.mockResolvedValue([])
    await PredictionsPage({ searchParams: Promise.resolve({ status: "open" }) })
    expect(mockGetPredictions).toHaveBeenCalledWith(
      expect.objectContaining({ status: "open" })
    )
  })

  it("shows status badges", async () => {
    mockGetPredictions.mockResolvedValue([
      mockPrediction,
      { ...mockPrediction, id: "p2", status: "confirmed", title: "Confirmed prediction" },
    ])
    const jsx = await PredictionsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    // "Open" appears both as filter link and badge, so check for Confirmed badge specifically
    expect(screen.getByText("Confirmed")).toBeInTheDocument()
    expect(screen.getByText("Confirmed prediction")).toBeInTheDocument()
  })
})
