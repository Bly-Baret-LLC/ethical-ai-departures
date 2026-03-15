import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProfileCard } from "./ProfileCard"

// Mock NewBadge to isolate ProfileCard tests
vi.mock("./NewBadge", () => ({
  NewBadge: ({ createdAt }: { createdAt: string }) => (
    <span data-testid="new-badge" data-created-at={createdAt} />
  ),
}))

afterEach(() => {
  cleanup()
})

const defaultProps = {
  slug: "elena-rodriguez",
  name: "Elena Rodriguez",
  role: "Safety Lead",
  company: "OpenAI",
  departureDate: "2025-11-15",
  photoUrl: null,
  statedReason: "Safety concerns consistently deprioritized in favor of shipping timelines.",
  createdAt: "2025-11-18T00:00:00Z",
  concernTags: [
    { id: "1", name: "Safety Deprioritization", slug: "safety-deprioritization" },
    { id: "2", name: "Rushed Deployment", slug: "rushed-deployment" },
  ],
}

describe("ProfileCard", () => {
  it("renders name, role, company, and year", () => {
    render(<ProfileCard {...defaultProps} />)

    expect(screen.getByText("Elena Rodriguez")).toBeInTheDocument()
    expect(
      screen.getByText("Safety Lead · OpenAI · 2025")
    ).toBeInTheDocument()
  })

  it("links to profile detail page", () => {
    render(<ProfileCard {...defaultProps} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/profiles/elena-rodriguez")
  })

  it("has aria-label with full context", () => {
    render(<ProfileCard {...defaultProps} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute(
      "aria-label",
      "Elena Rodriguez, Safety Lead at OpenAI, 2025"
    )
  })

  it("renders as article element", () => {
    render(<ProfileCard {...defaultProps} />)
    expect(screen.getByRole("article")).toBeInTheDocument()
  })

  it("renders initials avatar when photoUrl is null", () => {
    render(<ProfileCard {...defaultProps} />)

    expect(screen.getByText("ER")).toBeInTheDocument()
  })

  it("renders photo when photoUrl is provided", () => {
    render(
      <ProfileCard {...defaultProps} photoUrl="https://example.com/photo.jpg" />
    )

    const img = screen.getByRole("img")
    expect(img.getAttribute("src")).toContain("photo.jpg")
  })

  it("renders stated reason as blockquote", () => {
    render(<ProfileCard {...defaultProps} />)

    const quote = screen.getByText(/Safety concerns consistently/i)
    expect(quote.tagName).toBe("BLOCKQUOTE")
  })

  it("does not render blockquote when statedReason is null", () => {
    render(<ProfileCard {...defaultProps} statedReason={null} />)

    expect(
      screen.queryByText(/Safety concerns/i)
    ).not.toBeInTheDocument()
  })

  it("renders primary concern tag", () => {
    render(<ProfileCard {...defaultProps} />)

    expect(screen.getByText("Safety Deprioritization")).toBeInTheDocument()
  })

  it("renders kudos placeholder", () => {
    render(<ProfileCard {...defaultProps} />)

    expect(screen.getByText("0 kudos")).toBeInTheDocument()
  })

  it("handles empty concern tags", () => {
    render(<ProfileCard {...defaultProps} concernTags={[]} />)

    expect(
      screen.queryByText("Safety Deprioritization")
    ).not.toBeInTheDocument()
  })

  it("truncates long names", () => {
    render(
      <ProfileCard
        {...defaultProps}
        name="Extremely Long Name That Should Be Truncated In The Display"
      />
    )

    const nameElement = screen.getByText(
      "Extremely Long Name That Should Be Truncated In The Display"
    )
    expect(nameElement).toHaveClass("truncate")
  })

  it("passes createdAt to NewBadge", () => {
    render(<ProfileCard {...defaultProps} />)

    const badge = screen.getByTestId("new-badge")
    expect(badge).toHaveAttribute("data-created-at", "2025-11-18T00:00:00Z")
  })
})
