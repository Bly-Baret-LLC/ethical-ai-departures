import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  getPredictions: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  inFilter: vi.fn(),
}))

vi.mock("@/lib/queries/predictions", () => ({
  getPredictions: mocks.getPredictions,
}))

vi.mock("@/lib/supabase/public", () => ({
  createPublicClient: () => ({
    from: mocks.from.mockReturnValue({
      select: mocks.select.mockReturnValue({ in: mocks.inFilter }),
    }),
  }),
}))

vi.mock("./SpotlightCarousel", () => ({
  SpotlightCarousel: ({
    slides,
  }: {
    slides: { id: string; linkedPublications: { title: string }[] }[]
  }) => (
    <div data-testid="spotlight">
      {slides.map((slide) => (
        <span key={slide.id}>
          {slide.id}:{slide.linkedPublications.map((item) => item.title).join(",")}
        </span>
      ))}
    </div>
  ),
}))

import { PredictionSpotlight } from "./PredictionSpotlight"

const firstId = "a0000000-0000-4000-8000-000000000001"
const secondId = "a0000000-0000-4000-8000-000000000002"

const predictionDefaults = {
  description: null,
  sourceQuote: "A sourced statement",
  resolutionCriteria: "A documented outcome",
  resolutionDate: null,
  resolutionOutcome: null,
  resolutionRationale: null,
  resolutionEvidenceUrl: null,
  predictedDate: null,
  resolvedBy: null,
  reviewedBy: null,
  reviewNotes: null,
  eventDate: null,
  isVerbatimQuote: true,
  sourceUrl: null,
  criteriaAdoptedAt: null,
  resolutionDeadline: null,
  createdAt: "2026-09-01T00:00:00Z",
  updatedAt: "2026-09-01T00:00:00Z",
  profileId: "b0000000-0000-4000-8000-000000000001",
  profileName: "Researcher",
  profileSlug: "researcher",
  underReview: false,
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("PredictionSpotlight", () => {
  it("loads publication links for all spotlight records in one query", async () => {
    mocks.getPredictions.mockResolvedValue([
      {
        ...predictionDefaults,
        id: firstId,
        title: "Open forecast",
        status: "open",
        recordKind: "prediction",
      },
      {
        ...predictionDefaults,
        id: secondId,
        title: "Published warning",
        status: "confirmed",
        recordKind: "warning",
      },
    ])
    mocks.inFilter.mockResolvedValue({
      data: [
        {
          prediction_id: firstId,
          publications: { title: "Linked paper", url: "https://example.com" },
        },
      ],
      error: null,
    })

    const spotlight = await PredictionSpotlight()
    render(spotlight)

    expect(mocks.from).toHaveBeenCalledTimes(1)
    expect(mocks.from).toHaveBeenCalledWith("publication_predictions")
    expect(mocks.inFilter).toHaveBeenCalledWith("prediction_id", [
      firstId,
      secondId,
    ])
    expect(screen.getByText(`${firstId}:Linked paper`)).toBeInTheDocument()
    expect(screen.getByText(`${secondId}:`)).toBeInTheDocument()
  })
})
