import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { ProfileTable } from "./ProfileTable"
import type { ProfileWithTags } from "@/lib/schemas/profile"

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function makeProfile(overrides: Partial<ProfileWithTags> = {}): ProfileWithTags {
  return {
    id: "1",
    slug: "test-person",
    name: "Test Person",
    photoUrl: null,
    company: "OpenAI",
    role: "Engineer",
    departureDate: "2025-06-15",
    statedReason: null,
    departureContext: null,
    status: "published",
    departureType: "resigned",
    motiveEvidence: "direct",
    headlineCounted: true,
    motiveQuote: null,
    claimStatus: null,
    lastReviewedAt: null,
    reviewer: null,
    correctionNote: null,
    createdAt: "2025-06-20T00:00:00Z",
    updatedAt: "2025-06-20T00:00:00Z",
    concernTags: [],
    ...overrides,
  }
}

const testProfiles: ProfileWithTags[] = [
  makeProfile({ slug: "alice", name: "Alice", company: "OpenAI", departureDate: "2025-06-15" }),
  makeProfile({
    slug: "bob",
    name: "Bob",
    company: "Google",
    departureDate: "2026-01-10",
    concernTags: [{ id: "1", name: "Safety", slug: "safety" }],
  }),
]

describe("ProfileTable", () => {
  it("renders table with column headers", () => {
    render(<ProfileTable profiles={testProfiles} />)

    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Company")).toBeInTheDocument()
    expect(screen.getByText("Role")).toBeInTheDocument()
    expect(screen.getByText("Departure")).toBeInTheDocument()
    expect(screen.getByText("Concerns")).toBeInTheDocument()
  })

  it("renders profile data in rows", () => {
    render(<ProfileTable profiles={testProfiles} />)

    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("OpenAI")).toBeInTheDocument()
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  it("renders concern tags as badges", () => {
    render(<ProfileTable profiles={testProfiles} />)

    expect(screen.getByText("Safety")).toBeInTheDocument()
  })

  it("renders dash for empty concern tags", () => {
    render(<ProfileTable profiles={[makeProfile({ concernTags: [] })]} />)

    expect(screen.getByText("—")).toBeInTheDocument()
  })

  it("navigates to profile on row click", () => {
    render(<ProfileTable profiles={testProfiles} />)

    const rows = screen.getAllByRole("link")
    fireEvent.click(rows[0])

    expect(mockPush).toHaveBeenCalledWith("/profiles/alice")
  })

  it("navigates on Enter key", () => {
    render(<ProfileTable profiles={testProfiles} />)

    const rows = screen.getAllByRole("link")
    fireEvent.keyDown(rows[0], { key: "Enter" })

    expect(mockPush).toHaveBeenCalledWith("/profiles/alice")
  })

  it("sorts by column header click", () => {
    render(<ProfileTable profiles={testProfiles} />)

    const nameHeader = screen.getByText("Name")
    fireEvent.click(nameHeader)

    // After sorting by name ascending, Alice should come first
    const cells = screen.getAllByRole("cell")
    expect(cells[0]).toHaveTextContent("Alice")
  })
})
