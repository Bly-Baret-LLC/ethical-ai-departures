import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("@/lib/queries/latestActivity", () => ({
  getLatestActivity: vi.fn().mockResolvedValue([
    {
      slug: "aisha-patel",
      name: "Aisha Patel",
      company: "OpenAI",
      role: "Head of Alignment",
      departureDate: "2026-02-14",
      createdAt: "2026-03-10T12:00:00Z",
    },
    {
      slug: "sarah-okafor",
      name: "Sarah Okafor",
      company: "Anthropic",
      role: "Senior Researcher",
      departureDate: "2026-01-10",
      createdAt: "2026-03-08T12:00:00Z",
    },
    {
      slug: "elena-rodriguez",
      name: "Elena Rodriguez",
      company: "OpenAI",
      role: "Safety Lead",
      departureDate: "2025-11-15",
      createdAt: "2026-03-05T12:00:00Z",
    },
  ]),
}))

vi.mock("./LatestActivityClient", () => ({
  LatestActivityClient: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="activity-client">{children}</div>
  ),
}))

import { LatestActivitySlot } from "./LatestActivitySlot"

afterEach(() => {
  cleanup()
})

describe("LatestActivitySlot", () => {
  it("renders 3 activity items", async () => {
    const jsx = await LatestActivitySlot()
    render(jsx!)

    expect(screen.getByText("Aisha Patel")).toBeInTheDocument()
    expect(screen.getByText("Sarah Okafor")).toBeInTheDocument()
    expect(screen.getByText("Elena Rodriguez")).toBeInTheDocument()
  })

  it("renders role and company for each item", async () => {
    const jsx = await LatestActivitySlot()
    render(jsx!)

    expect(
      screen.getByText("Head of Alignment · OpenAI")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Senior Researcher · Anthropic")
    ).toBeInTheDocument()
    expect(screen.getByText("Safety Lead · OpenAI")).toBeInTheDocument()
  })

  it("links each item to profile detail page", async () => {
    const jsx = await LatestActivitySlot()
    render(jsx!)

    const links = screen.getAllByRole("link")
    expect(links[0]).toHaveAttribute("href", "/profiles/aisha-patel")
    expect(links[1]).toHaveAttribute("href", "/profiles/sarah-okafor")
    expect(links[2]).toHaveAttribute("href", "/profiles/elena-rodriguez")
  })

  it('has section with aria-label="Latest activity"', async () => {
    const jsx = await LatestActivitySlot()
    render(jsx!)

    expect(
      screen.getByRole("region", { name: "Latest activity" })
    ).toBeInTheDocument()
  })

  it("renders section heading", async () => {
    const jsx = await LatestActivitySlot()
    render(jsx!)

    expect(
      screen.getByRole("heading", { name: "Latest Departures" })
    ).toBeInTheDocument()
  })

  it("returns null when no items exist", async () => {
    const { getLatestActivity } = await import("@/lib/queries/latestActivity")
    vi.mocked(getLatestActivity).mockResolvedValueOnce([])

    const jsx = await LatestActivitySlot()
    expect(jsx).toBeNull()
  })

  it("returns null on data fetch error", async () => {
    const { getLatestActivity } = await import("@/lib/queries/latestActivity")
    vi.mocked(getLatestActivity).mockRejectedValueOnce(new Error("DB down"))

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})
    const jsx = await LatestActivitySlot()

    expect(jsx).toBeNull()
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load latest activity:",
      expect.any(Error)
    )
    consoleError.mockRestore()
  })

  it("renders human-readable timestamps", async () => {
    const jsx = await LatestActivitySlot()
    render(jsx!)

    // Timestamps are rendered via formatRelativeDate — just verify time elements exist
    const timeElements = screen.getAllByRole("time")
    expect(timeElements).toHaveLength(3)
    expect(timeElements[0]).toHaveAttribute("datetime", "2026-02-14")
  })
})
