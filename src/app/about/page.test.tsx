import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import AboutPage from "./page"

afterEach(cleanup)

describe("AboutPage", () => {
  it("renders heading", () => {
    render(<AboutPage />)
    expect(screen.getByRole("heading", { name: /About The Warning Collective/ })).toBeInTheDocument()
  })

  it("renders mission section", () => {
    render(<AboutPage />)
    expect(screen.getByRole("heading", { name: /Our Mission/ })).toBeInTheDocument()
  })

  it("links to editorial standards", () => {
    render(<AboutPage />)
    expect(screen.getByRole("link", { name: /Editorial Standards/ })).toHaveAttribute("href", "/editorial-standards")
  })
})
