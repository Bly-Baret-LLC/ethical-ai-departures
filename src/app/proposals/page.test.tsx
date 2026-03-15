import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetProposals = vi.fn()

vi.mock("@/lib/queries/proposals", () => ({
  getProposals: (...args: unknown[]) => mockGetProposals(...args),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import ProposalsPage from "./page"

afterEach(cleanup)

describe("ProposalsPage", () => {
  it("renders heading", async () => {
    mockGetProposals.mockResolvedValue([])
    const jsx = await ProposalsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByRole("heading", { name: /Policy Proposals/ })).toBeInTheDocument()
  })

  it("shows empty state", async () => {
    mockGetProposals.mockResolvedValue([])
    const jsx = await ProposalsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText(/No proposals yet/)).toBeInTheDocument()
  })

  it("renders proposal with legislation badge", async () => {
    mockGetProposals.mockResolvedValue([
      {
        id: "p1",
        title: "AI Liability Framework",
        description: "Companies should be liable for AI harms",
        typeTags: ["liability"],
        sourceUrl: null,
        countryApplicability: ["US"],
        inLegislation: true,
        voteCount: 42,
        createdAt: "2025-06-01T00:00:00Z",
      },
    ])
    const jsx = await ProposalsPage({ searchParams: Promise.resolve({}) })
    render(jsx)
    expect(screen.getByText("AI Liability Framework")).toBeInTheDocument()
    expect(screen.getByText("In legislation")).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
  })
})
