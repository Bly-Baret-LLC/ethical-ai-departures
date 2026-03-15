import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

function makeMockProfiles(count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i),
    slug: `profile-${i}`,
    name: `Person ${i}`,
    photoUrl: null,
    company: "Company",
    role: "Role",
    departureDate: "2025-06-15",
    statedReason: "Reason",
    status: "published" as const,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    concernTags: [],
  }))
}

const mockGetPublishedProfiles = vi.fn()

vi.mock("@/lib/queries/profiles", () => ({
  getPublishedProfiles: (...args: unknown[]) => mockGetPublishedProfiles(...args),
}))

vi.mock("@/components/custom/ProfileBrowser", () => ({
  ProfileBrowser: ({ profiles }: { profiles: unknown[] }) => (
    <div data-testid="profile-browser" data-count={profiles.length} />
  ),
}))

vi.mock("@/components/custom/VisitTracker", () => ({
  VisitTracker: () => null,
}))

vi.mock("@/components/custom/EmailSignup", () => ({
  EmailSignup: () => <div data-testid="email-signup" />,
}))

import ProfilesPage from "./page"

beforeEach(() => {
  mockGetPublishedProfiles.mockResolvedValue(makeMockProfiles())
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe("ProfilesPage", () => {
  it("renders heading", async () => {
    const jsx = await ProfilesPage()
    render(jsx)

    expect(
      screen.getByRole("heading", { name: "All Profiles" })
    ).toBeInTheDocument()
  })

  it("passes profiles to ProfileBrowser", async () => {
    const jsx = await ProfilesPage()
    render(jsx)

    const browser = screen.getByTestId("profile-browser")
    expect(browser).toHaveAttribute("data-count", "5")
  })

  it("shows error message on fetch failure", async () => {
    mockGetPublishedProfiles.mockRejectedValueOnce(new Error("DB down"))

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})
    const jsx = await ProfilesPage()
    render(jsx)

    expect(
      screen.getByText("Unable to load profiles. Please try again later.")
    ).toBeInTheDocument()
    consoleError.mockRestore()
  })
})
