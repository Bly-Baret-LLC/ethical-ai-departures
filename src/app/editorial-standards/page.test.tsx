import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import EditorialStandardsPage from "./page"

afterEach(cleanup)

describe("EditorialStandardsPage", () => {
  it("renders heading", () => {
    render(<EditorialStandardsPage />)
    expect(screen.getByRole("heading", { name: /Editorial Standards/ })).toBeInTheDocument()
  })

  it("renders AI disclosure section", () => {
    render(<EditorialStandardsPage />)
    expect(screen.getByRole("heading", { name: /AI Agent Disclosure/ })).toBeInTheDocument()
  })

  it("renders correction policy with link", () => {
    render(<EditorialStandardsPage />)
    expect(screen.getByRole("link", { name: /Corrections Log/ })).toHaveAttribute("href", "/corrections")
  })

  it("renders data subject rights with contact link", () => {
    render(<EditorialStandardsPage />)
    expect(screen.getByRole("link", { name: /contact form/ })).toHaveAttribute("href", "/contact")
  })
})
