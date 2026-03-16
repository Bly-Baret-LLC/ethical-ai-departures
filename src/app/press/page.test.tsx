import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
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

  it("renders embedding guidelines", () => {
    render(<PressPage />)
    expect(screen.getByRole("heading", { name: /Embedding & Referencing/ })).toBeInTheDocument()
  })
})
