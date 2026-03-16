import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import AboutPage from "./page"

afterEach(cleanup)

describe("AboutPage", () => {
  it("renders heading", () => {
    render(<AboutPage />)
    expect(screen.getByRole("heading", { name: /About Ethical AI Departures/ })).toBeInTheDocument()
  })

  it("renders mission section", () => {
    render(<AboutPage />)
    expect(screen.getByRole("heading", { name: /Our Mission/ })).toBeInTheDocument()
  })

  it("renders team section", () => {
    render(<AboutPage />)
    expect(screen.getByRole("heading", { name: /Team/ })).toBeInTheDocument()
  })
})
