import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("@/lib/queries/profiles", () => ({
  getPublishedProfiles: vi.fn().mockResolvedValue([
    {
      id: "1",
      slug: "elena-rodriguez",
      name: "Elena Rodriguez",
      photoUrl: null,
      company: "OpenAI",
      role: "Safety Lead",
      departureDate: "2025-11-15",
      statedReason: "Safety concerns",
      status: "published",
      createdAt: "2025-11-18T00:00:00Z",
      updatedAt: "2025-11-18T00:00:00Z",
      concernTags: [{ id: "t1", name: "Safety Deprioritization", slug: "safety-deprioritization" }],
    },
    {
      id: "2",
      slug: "marcus-chen",
      name: "Marcus Chen",
      photoUrl: null,
      company: "Google DeepMind",
      role: "Research Director",
      departureDate: "2025-09-22",
      statedReason: "Alignment research gaps",
      status: "published",
      createdAt: "2025-09-25T00:00:00Z",
      updatedAt: "2025-09-25T00:00:00Z",
      concernTags: [{ id: "t2", name: "Alignment Research Gaps", slug: "alignment-research-gaps" }],
    },
    {
      id: "3",
      slug: "sarah-okafor",
      name: "Sarah Okafor",
      photoUrl: null,
      company: "Anthropic",
      role: "Senior Researcher",
      departureDate: "2026-01-10",
      statedReason: "Deployment concerns",
      status: "published",
      createdAt: "2026-01-15T00:00:00Z",
      updatedAt: "2026-01-15T00:00:00Z",
      concernTags: [],
    },
  ]),
}))

// Mock NewBadge to avoid localStorage dependency in server component tests
vi.mock("./NewBadge", () => ({
  NewBadge: () => null,
}))

import { ProfilePreview } from "./ProfilePreview"

afterEach(() => {
  cleanup()
})

describe("ProfilePreview", () => {
  it("renders profile cards", async () => {
    const jsx = await ProfilePreview()
    render(jsx!)

    expect(screen.getByText("Elena Rodriguez")).toBeInTheDocument()
    expect(screen.getByText("Marcus Chen")).toBeInTheDocument()
    expect(screen.getByText("Sarah Okafor")).toBeInTheDocument()
  })

  it("shows profile count", async () => {
    const jsx = await ProfilePreview()
    render(jsx!)

    expect(screen.getByText("3 profiles")).toBeInTheDocument()
  })

  it("renders section heading", async () => {
    const jsx = await ProfilePreview()
    render(jsx!)

    expect(
      screen.getByRole("heading", { name: "Departures" })
    ).toBeInTheDocument()
  })

  it('has section with id="profiles" for skip link', async () => {
    const jsx = await ProfilePreview()
    render(jsx!)

    const section = screen.getByRole("region", { name: "Departures" })
    expect(section).toHaveAttribute("id", "profiles")
  })

  it("returns null when no profiles exist", async () => {
    const { getPublishedProfiles } = await import("@/lib/queries/profiles")
    vi.mocked(getPublishedProfiles).mockResolvedValueOnce([])

    const jsx = await ProfilePreview()
    expect(jsx).toBeNull()
  })

  it("returns null on fetch error", async () => {
    const { getPublishedProfiles } = await import("@/lib/queries/profiles")
    vi.mocked(getPublishedProfiles).mockRejectedValueOnce(new Error("DB down"))

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})
    const jsx = await ProfilePreview()

    expect(jsx).toBeNull()
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load profile preview:",
      expect.any(Error)
    )
    consoleError.mockRestore()
  })

  it("limits to 9 cards maximum", async () => {
    const { getPublishedProfiles } = await import("@/lib/queries/profiles")
    const manyProfiles = Array.from({ length: 15 }, (_, i) => ({
      id: String(i),
      slug: `profile-${i}`,
      name: `Person ${i}`,
      photoUrl: null,
      company: "Company",
      role: "Role",
      departureDate: "2025-01-01",
      statedReason: "Reason",
      status: "published" as const,
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      concernTags: [],
    }))
    vi.mocked(getPublishedProfiles).mockResolvedValueOnce(manyProfiles)

    const jsx = await ProfilePreview()
    render(jsx!)

    const articles = screen.getAllByRole("article")
    expect(articles).toHaveLength(9)
  })
})
