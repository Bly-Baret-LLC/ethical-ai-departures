import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("@/components/custom/EmailSignup", () => ({
  EmailSignup: () => <div data-testid="email-signup" />,
}))

import PressPage from "./page"

afterEach(() => {
  cleanup()
})

describe("PressPage", () => {
  it("renders page heading", () => {
    render(<PressPage />)
    expect(screen.getByRole("heading", { name: /Press & Media Kit/ })).toBeInTheDocument()
  })

  it("renders About section", () => {
    render(<PressPage />)
    expect(screen.getByRole("heading", { name: /About Ethical AI Departures/ })).toBeInTheDocument()
  })

  it("renders citation format section", () => {
    render(<PressPage />)
    expect(screen.getByRole("heading", { name: /How to Cite/ })).toBeInTheDocument()
  })

  it("renders press contact email", () => {
    render(<PressPage />)
    const emailLink = screen.getByRole("link", { name: /press@thewarningcollective\.org/ })
    expect(emailLink).toHaveAttribute("href", "mailto:press@ethicalaidepartures.fyi")
  })

  it("renders embedding guidelines", () => {
    render(<PressPage />)
    expect(screen.getByRole("heading", { name: /Embedding & Referencing/ })).toBeInTheDocument()
  })

  it("renders media kit section", () => {
    render(<PressPage />)
    expect(screen.getByRole("heading", { level: 2, name: /Media Kit/ })).toBeInTheDocument()
  })
})
