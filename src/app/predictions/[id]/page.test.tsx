import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetPredictionById = vi.fn()
const mockGetVoteCounts = vi.fn()
const mockNotFound = vi.fn()

vi.mock("@/lib/queries/predictions", () => ({
  getPredictionById: (...args: unknown[]) => mockGetPredictionById(...args),
  getVoteCounts: (...args: unknown[]) => mockGetVoteCounts(...args),
}))

vi.mock("next/navigation", () => ({
  notFound: () => {
    mockNotFound()
    throw new Error("NEXT_NOT_FOUND")
  },
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("@/components/custom/InsiderVoteBar", () => ({
  InsiderVoteBar: ({ predictionId }: { predictionId: string }) => (
    <div data-testid="vote-bar" data-prediction={predictionId} />
  ),
}))

import PredictionDetailPage from "./page"

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const mockPrediction = {
  id: "p1",
  profileId: "prof1",
  profileName: "Alice Chen",
  profileSlug: "alice-chen",
  profileCompany: "OpenAI",
  title: "AI regulation by 2027",
  description: "Meaningful regulation will be enacted",
  sourceQuote: "We will see regulation within two years",
  resolutionCriteria: "Major economy passes AI safety legislation",
  status: "open" as const,
  resolutionDate: null,
  resolutionOutcome: null,
  resolutionRationale: null,
  resolutionEvidenceUrl: null,
  createdAt: "2025-06-01T00:00:00Z",
  updatedAt: "2025-06-01T00:00:00Z",
}

describe("PredictionDetailPage", () => {
  it("renders prediction title", async () => {
    mockGetPredictionById.mockResolvedValue(mockPrediction)
    mockGetVoteCounts.mockResolvedValue({ agree: 5, disagree: 3, total: 8 })
    const jsx = await PredictionDetailPage({ params: Promise.resolve({ id: "p1" }) })
    render(jsx)
    expect(screen.getByRole("heading", { name: "AI regulation by 2027" })).toBeInTheDocument()
  })

  it("renders researcher link", async () => {
    mockGetPredictionById.mockResolvedValue(mockPrediction)
    mockGetVoteCounts.mockResolvedValue({ agree: 0, disagree: 0, total: 0 })
    const jsx = await PredictionDetailPage({ params: Promise.resolve({ id: "p1" }) })
    render(jsx)
    expect(screen.getByText("Alice Chen")).toBeInTheDocument()
  })

  it("renders source quote", async () => {
    mockGetPredictionById.mockResolvedValue(mockPrediction)
    mockGetVoteCounts.mockResolvedValue({ agree: 0, disagree: 0, total: 0 })
    const jsx = await PredictionDetailPage({ params: Promise.resolve({ id: "p1" }) })
    render(jsx)
    expect(screen.getByText(/We will see regulation/)).toBeInTheDocument()
  })

  it("renders resolution criteria", async () => {
    mockGetPredictionById.mockResolvedValue(mockPrediction)
    mockGetVoteCounts.mockResolvedValue({ agree: 0, disagree: 0, total: 0 })
    const jsx = await PredictionDetailPage({ params: Promise.resolve({ id: "p1" }) })
    render(jsx)
    expect(screen.getByText("Resolution Criteria")).toBeInTheDocument()
    expect(screen.getByText(/Major economy passes/)).toBeInTheDocument()
  })

  it("renders vote bar for open predictions", async () => {
    mockGetPredictionById.mockResolvedValue(mockPrediction)
    mockGetVoteCounts.mockResolvedValue({ agree: 5, disagree: 3, total: 8 })
    const jsx = await PredictionDetailPage({ params: Promise.resolve({ id: "p1" }) })
    render(jsx)
    expect(screen.getByTestId("vote-bar")).toBeInTheDocument()
  })

  it("shows resolution for resolved predictions", async () => {
    mockGetPredictionById.mockResolvedValue({
      ...mockPrediction,
      status: "confirmed",
      resolutionOutcome: "true",
      resolutionRationale: "EU AI Act passed",
      resolutionDate: "2026-01-15",
    })
    mockGetVoteCounts.mockResolvedValue({ agree: 10, disagree: 2, total: 12 })
    const jsx = await PredictionDetailPage({ params: Promise.resolve({ id: "p1" }) })
    render(jsx)
    expect(screen.getByText("Resolution")).toBeInTheDocument()
    expect(screen.getByText("Prediction confirmed as true")).toBeInTheDocument()
    expect(screen.getByText("EU AI Act passed")).toBeInTheDocument()
  })

  it("calls notFound when prediction is missing", async () => {
    mockGetPredictionById.mockResolvedValue(null)
    mockGetVoteCounts.mockResolvedValue({ agree: 0, disagree: 0, total: 0 })
    await expect(
      PredictionDetailPage({ params: Promise.resolve({ id: "nope" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND")
    expect(mockNotFound).toHaveBeenCalled()
  })

  it("renders JSON-LD structured data", async () => {
    mockGetPredictionById.mockResolvedValue(mockPrediction)
    mockGetVoteCounts.mockResolvedValue({ agree: 0, disagree: 0, total: 0 })
    const jsx = await PredictionDetailPage({ params: Promise.resolve({ id: "p1" }) })
    const { container } = render(jsx)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    const json = JSON.parse(script!.textContent!)
    expect(json["@type"]).toBe("Claim")
    expect(json.name).toBe("AI regulation by 2027")
  })
})
