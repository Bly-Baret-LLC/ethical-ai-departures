import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { TooltipProvider } from "@/components/ui/tooltip"
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

function renderCard(props: React.ComponentProps<typeof ProfileCard>) {
  return render(
    <TooltipProvider>
      <ProfileCard {...props} />
    </TooltipProvider>
  )
}

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
    renderCard(defaultProps)

    expect(screen.getByText("Elena Rodriguez")).toBeInTheDocument()
    expect(
      screen.getByText("Safety Lead · OpenAI · 2025")
    ).toBeInTheDocument()
  })

  it("links to profile detail page", () => {
    renderCard(defaultProps)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/profiles/elena-rodriguez")
  })

  it("has aria-label with full context", () => {
    renderCard(defaultProps)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute(
      "aria-label",
      "Elena Rodriguez, Safety Lead at OpenAI, 2025"
    )
  })

  it("renders as article element", () => {
    renderCard(defaultProps)
    expect(screen.getByRole("article")).toBeInTheDocument()
  })

  it("renders initials avatar when photoUrl is null", () => {
    renderCard(defaultProps)

    expect(screen.getByText("ER")).toBeInTheDocument()
  })

  it("renders photo when photoUrl is provided", () => {
    renderCard({ ...defaultProps, photoUrl: "https://example.com/photo.jpg" })

    const img = screen.getByRole("img")
    expect(img.getAttribute("src")).toContain("photo.jpg")
  })

  it("renders stated reason as blockquote", () => {
    renderCard(defaultProps)

    const quote = screen.getByText(/Safety concerns consistently/i)
    expect(quote.tagName).toBe("BLOCKQUOTE")
  })

  it("does not render blockquote when statedReason is null", () => {
    renderCard({ ...defaultProps, statedReason: null })

    expect(
      screen.queryByText(/Safety concerns/i)
    ).not.toBeInTheDocument()
  })

  it("renders primary concern tag", () => {
    renderCard(defaultProps)

    expect(screen.getByText("Safety Deprioritization")).toBeInTheDocument()
  })

  it("handles empty concern tags", () => {
    renderCard({ ...defaultProps, concernTags: [] })

    expect(
      screen.queryByText("Safety Deprioritization")
    ).not.toBeInTheDocument()
  })

  it("clamps long names to one line", () => {
    renderCard({
      ...defaultProps,
      name: "Extremely Long Name That Should Be Truncated In The Display",
    })

    const nameElement = screen.getByText(
      "Extremely Long Name That Should Be Truncated In The Display"
    )
    expect(nameElement).toHaveClass("line-clamp-1")
  })

  it("passes createdAt to NewBadge", () => {
    renderCard(defaultProps)

    const badge = screen.getByTestId("new-badge")
    expect(badge).toHaveAttribute("data-created-at", "2025-11-18T00:00:00Z")
  })
})
