import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { SiteHeader } from "./SiteHeader"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/"),
}))

afterEach(() => {
  cleanup()
})

describe("SiteHeader", () => {
  it("renders site title as link to home", () => {
    render(<SiteHeader />)
    const title = screen.getByRole("link", { name: "The Warning Collective" })
    expect(title).toHaveAttribute("href", "/")
  })

  it("renders desktop nav links", () => {
    render(<SiteHeader />)
    const nav = screen.getByRole("navigation", { name: "Main navigation" })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Profiles" })).toHaveAttribute("href", "/profiles")
    expect(screen.getByRole("link", { name: "Press" })).toHaveAttribute("href", "/press")
  })

  it("renders mobile menu button", () => {
    render(<SiteHeader />)
    expect(screen.getByRole("button", { name: /Toggle navigation/ })).toBeInTheDocument()
  })

  it("toggles mobile menu on button click", () => {
    render(<SiteHeader />)
    const btn = screen.getByRole("button", { name: /Toggle navigation/ })

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument()

    fireEvent.click(btn)
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument()

    fireEvent.click(btn)
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument()
  })
})
