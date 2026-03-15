import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { SkipLinks } from "./SkipLinks"

afterEach(() => {
  cleanup()
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
})
