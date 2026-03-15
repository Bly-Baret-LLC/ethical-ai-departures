import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("./ContactForm", () => ({
  ContactForm: () => <div data-testid="contact-form" />,
}))

import ContactPage from "./page"

afterEach(cleanup)

describe("ContactPage", () => {
  it("renders heading", () => {
    render(<ContactPage />)
    expect(screen.getByRole("heading", { name: /Contact Us/ })).toBeInTheDocument()
  })

  it("renders funding transparency", () => {
    render(<ContactPage />)
    expect(screen.getByRole("heading", { name: /Funding & Independence/ })).toBeInTheDocument()
  })

  it("renders press email", () => {
    render(<ContactPage />)
    expect(screen.getByRole("link", { name: /press@thewarningcollective\.org/ })).toBeInTheDocument()
  })

  it("renders contact form", () => {
    render(<ContactPage />)
    expect(screen.getByTestId("contact-form")).toBeInTheDocument()
  })
})
