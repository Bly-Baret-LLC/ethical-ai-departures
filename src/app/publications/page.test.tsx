import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetPublicationsWithProfiles = vi.fn()
const mockGetPublicationCountsByConcern = vi.fn()
const mockGetPredictions = vi.fn()

vi.mock("@/lib/queries/publications", () => ({
  getPublicationsWithProfiles: (...args: unknown[]) => mockGetPublicationsWithProfiles(...args),
  getPublicationCountsByConcern: (...args: unknown[]) => mockGetPublicationCountsByConcern(...args),
}))

vi.mock("@/lib/queries/predictions", () => ({
  getPredictions: (...args: unknown[]) => mockGetPredictions(...args),
}))

// Stub the client tabs component (it relies on the app router / search params,
// which aren't mounted in jsdom). Render the publications it receives so the
// page test can assert the page fetches and forwards them.
vi.mock("@/components/custom/PublicationsTabs", () => ({
  PublicationsTabs: ({
    publications,
  }: {
    publications: { id: string; title: string; profileName: string }[]
  }) => (
    <div data-testid="publications-tabs">
      {publications.map((p) => (
        <div key={p.id}>
          <span>{p.title}</span>
          <span>{p.profileName}</span>
        </div>
      ))}
    </div>
  ),
}))

import ThemesAndWritingsPage from "./page"

beforeEach(() => {
  mockGetPublicationsWithProfiles.mockResolvedValue([])
  mockGetPublicationCountsByConcern.mockResolvedValue([])
  mockGetPredictions.mockResolvedValue([])
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("ThemesAndWritingsPage", () => {
  it("renders heading", async () => {
    const jsx = await ThemesAndWritingsPage()
    render(jsx)
    expect(screen.getByRole("heading", { name: /Publications/ })).toBeInTheDocument()
  })

  it("renders thematic overview paragraphs", async () => {
    const jsx = await ThemesAndWritingsPage()
    render(jsx)
    expect(screen.getByText(/the same concerns surface again and again/)).toBeInTheDocument()
    expect(screen.getByText(/peer-reviewed papers, policy reports/)).toBeInTheDocument()
  })

  it("forwards publications to the tabs component", async () => {
    mockGetPublicationsWithProfiles.mockResolvedValue([
      {
        id: "pub1",
        profileId: "prof1",
        profileName: "Alice Chen",
        profileSlug: "alice-chen",
        concernTagSlugs: ["safety-deprioritization"],
        title: "Concrete Problems in AI Safety",
        url: "https://arxiv.org/abs/1606.06565",
        publicationType: "paper",
        publisher: "arXiv",
        publishedDate: "2016-06-21",
        abstract: "A paper about safety.",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ])
    const jsx = await ThemesAndWritingsPage()
    render(jsx)
    expect(screen.getByText("Concrete Problems in AI Safety")).toBeInTheDocument()
    expect(screen.getByText("Alice Chen")).toBeInTheDocument()
  })

  it("renders no publications when the query returns none", async () => {
    const jsx = await ThemesAndWritingsPage()
    render(jsx)
    expect(screen.getByTestId("publications-tabs")).toBeEmptyDOMElement()
  })
})
