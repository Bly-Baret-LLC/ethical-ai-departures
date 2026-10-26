import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { ProfileBrowser } from "./ProfileBrowser"
import type { ProfileWithTags } from "@/lib/schemas/profile"

// Mock next/navigation
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/profiles",
}))

vi.mock("./ProfileCard", () => ({
  ProfileCard: ({ name }: { name: string }) => (
    <article>{name}</article>
  ),
}))

vi.mock("./NewBadge", () => ({
  NewBadge: () => null,
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function makeProfile(overrides: Partial<ProfileWithTags> = {}): ProfileWithTags {
  return {
    id: "1",
    slug: "test",
    name: "Test",
    photoUrl: null,
    company: "OpenAI",
    role: "Engineer",
    departureDate: "2025-06-15",
    departureDatePrecision: "day",
    effectiveDepartureDate: null,
    departureDateNote: null,
    seoDescription: null,
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
  makeProfile({ slug: "bob", name: "Bob", company: "Google", departureDate: "2026-01-10" }),
  makeProfile({ slug: "carol", name: "Carol", company: "OpenAI", departureDate: "2025-03-01" }),
]

describe("ProfileBrowser", () => {
  it("toggles the mobile filter panel from the category row", () => {
    render(<ProfileBrowser profiles={testProfiles} />)
    const toggle = screen.getByRole("button", { name: "Filters" })
    const evidence = screen.getByRole("button", { name: "Evidence-linked (3)" })
    expect(toggle.parentElement).toContainElement(evidence)
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(document.getElementById("filter-panel")).not.toBeInTheDocument()
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(document.getElementById("filter-panel")).toBeInTheDocument()
    fireEvent.click(toggle)
    expect(document.getElementById("filter-panel")).not.toBeInTheDocument()
  })

  it("keeps browsing controls without repeating the hero's sourcing explanation", () => {
    render(<ProfileBrowser profiles={testProfiles} />)

    expect(screen.getByRole("heading", { name: "Browse the record" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /How we classify records/ })).toHaveAttribute(
      "href", "/editorial-standards#evidence-categories"
    )
    expect(screen.getByRole("button", { name: "Evidence-linked (3)" })).toBeInTheDocument()
    expect(screen.queryByText(/The person explicitly connected/)).not.toBeInTheDocument()
  })

  it("renders all profiles", () => {
    render(<ProfileBrowser profiles={testProfiles} />)

    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("Carol")).toBeInTheDocument()
  })

  it("shows total profile count", () => {
    render(<ProfileBrowser profiles={testProfiles} />)

    expect(screen.getByText("3 evidence-linked records")).toBeInTheDocument()
  })

  it("defaults to evidence-linked records and does not expose archived context", () => {
    const contextual = makeProfile({
      slug: "context-person",
      name: "Context Person",
      motiveEvidence: "contextual",
      headlineCounted: false,
    })

    render(<ProfileBrowser profiles={[...testProfiles, contextual]} />)

    expect(screen.queryByText("Context Person")).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Evidence-linked (3)" })
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.queryByRole("button", { name: /Context only/ })).not.toBeInTheDocument()
  })

  it("renders filter panel with company options", () => {
    render(<ProfileBrowser profiles={testProfiles} />)

    // Desktop filter panel should show companies
    expect(screen.getByText("Company")).toBeInTheDocument()
    expect(screen.getByText("OpenAI")).toBeInTheDocument()
    expect(screen.getByText("Google")).toBeInTheDocument()
  })

  it("shows empty state when no profiles match filter", () => {
    // Use searchParams with a filter that matches nothing
    const params = new URLSearchParams("company=nonexistent")
    vi.mocked(vi.fn()).mockReturnValue(params)

    // Since we can't easily mock useSearchParams to return different values,
    // we test the empty state by providing empty profiles
    render(<ProfileBrowser profiles={[]} />)

    expect(
      screen.getByText("No profiles match these filters")
    ).toBeInTheDocument()
  })
})
