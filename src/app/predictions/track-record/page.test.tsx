import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

const mockGetTrackRecords = vi.fn()

vi.mock("@/lib/queries/predictions", () => ({
  getTrackRecords: (...args: unknown[]) => mockGetTrackRecords(...args),
}))

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

import TrackRecordPage from "./page"

afterEach(cleanup)

describe("TrackRecordPage", () => {
  it("renders heading", async () => {
    mockGetTrackRecords.mockResolvedValue([])
    const jsx = await TrackRecordPage()
    render(jsx)
    expect(screen.getByRole("heading", { level: 1, name: /Track Record/ })).toBeInTheDocument()
  })

  it("shows empty state when no records", async () => {
    mockGetTrackRecords.mockResolvedValue([])
    const jsx = await TrackRecordPage()
    render(jsx)
    expect(screen.getByText(/No predictions have been resolved/)).toBeInTheDocument()
  })

  it("shows aggregate credibility index", async () => {
    mockGetTrackRecords.mockResolvedValue([
      {
        profileName: "Alice Chen",
        profileSlug: "alice-chen",
        total: 3,
        confirmed: 2,
        disproven: 1,
        partial: 0,
        accuracy: 67,
      },
    ])
    const jsx = await TrackRecordPage()
    render(jsx)
    expect(screen.getByText(/Aggregate Credibility Index/)).toBeInTheDocument()
    // 67% appears in both aggregate and per-researcher card
    expect(screen.getAllByText("67%")).toHaveLength(2)
  })

  it("shows per-researcher scorecards", async () => {
    mockGetTrackRecords.mockResolvedValue([
      {
        profileName: "Alice Chen",
        profileSlug: "alice-chen",
        total: 2,
        confirmed: 2,
        disproven: 0,
        partial: 0,
        accuracy: 100,
      },
      {
        profileName: "Bob Torres",
        profileSlug: "bob-torres",
        total: 1,
        confirmed: 0,
        disproven: 1,
        partial: 0,
        accuracy: 0,
      },
    ])
    const jsx = await TrackRecordPage()
    render(jsx)
    expect(screen.getByText("Alice Chen")).toBeInTheDocument()
    expect(screen.getByText("Bob Torres")).toBeInTheDocument()
    expect(screen.getByText("100%")).toBeInTheDocument()
    expect(screen.getByText("0%")).toBeInTheDocument()
  })

  it("shows methodology note", async () => {
    mockGetTrackRecords.mockResolvedValue([
      {
        profileName: "Alice",
        profileSlug: "alice",
        total: 1,
        confirmed: 1,
        disproven: 0,
        partial: 0,
        accuracy: 100,
      },
    ])
    const jsx = await TrackRecordPage()
    render(jsx)
    expect(screen.getByText(/Methodology/)).toBeInTheDocument()
    expect(screen.getByText(/caution/)).toBeInTheDocument()
  })
})
