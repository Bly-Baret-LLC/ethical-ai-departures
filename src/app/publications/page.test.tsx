import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetPublicationsWithProfiles = vi.fn()
const mockGetPublicationCountsByConcern = vi.fn()

vi.mock("@/lib/queries/publications", () => ({
  getPublicationsWithProfiles: (...args: unknown[]) => mockGetPublicationsWithProfiles(...args),
  getPublicationCountsByConcern: (...args: unknown[]) => mockGetPublicationCountsByConcern(...args),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import ThemesAndWritingsPage from "./page"

beforeEach(() => {
  mockGetPublicationsWithProfiles.mockResolvedValue([])
  mockGetPublicationCountsByConcern.mockResolvedValue([])
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("ThemesAndWritingsPage", () => {
  it("renders heading", async () => {
    const jsx = await ThemesAndWritingsPage()
    render(jsx)
    expect(screen.getByRole("heading", { name: /Themes & Writings/ })).toBeInTheDocument()
  })

  it("renders thematic overview paragraphs", async () => {
    const jsx = await ThemesAndWritingsPage()
    render(jsx)
    expect(screen.getByText(/the same concerns surface again and again/)).toBeInTheDocument()
    expect(screen.getByText(/peer-reviewed papers, policy reports/)).toBeInTheDocument()
  })

  it("renders writings section when publications exist", async () => {
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

  it("does not render writings section when no publications", async () => {
    const jsx = await ThemesAndWritingsPage()
    render(jsx)
    expect(screen.queryByText(/Filter by Concern/)).not.toBeInTheDocument()
  })
})
