import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { SkipLinks } from "./SkipLinks"
import { usePathname } from "next/navigation"

vi.mock("next/navigation", () => ({ usePathname: vi.fn(() => "/") }))

afterEach(() => {
  cleanup()
  vi.mocked(usePathname).mockReturnValue("/")
})

describe("SkipLinks", () => {
  it('renders "Skip to main content" link', () => {
    render(<SkipLinks />)
    const link = screen.getByText("Skip to main content")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "#main-content")
  })

  it('renders "Skip to profiles" link', () => {
    render(<SkipLinks />)
    const link = screen.getByText("Skip to profiles")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "#profiles")
  })

  it("has navigation landmark with skip links label", () => {
    render(<SkipLinks />)
    expect(
      screen.getByRole("navigation", { name: "Skip links" })
    ).toBeInTheDocument()
  })

  it("does not offer a missing profile-list target on the guide index", () => {
    vi.mocked(usePathname).mockReturnValue("/concerns")
    render(<SkipLinks />)
    expect(screen.queryByText("Skip to profiles")).not.toBeInTheDocument()
  })
})
