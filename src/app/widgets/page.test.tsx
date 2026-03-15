import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

import WidgetsPage from "./page"

afterEach(cleanup)

describe("WidgetsPage", () => {
  it("renders heading", () => {
    render(<WidgetsPage />)
    expect(screen.getByRole("heading", { name: /Embeddable Widgets/ })).toBeInTheDocument()
  })

  it("shows ticker widget section", () => {
    render(<WidgetsPage />)
    expect(screen.getByText("Departure Ticker")).toBeInTheDocument()
  })

  it("shows statistics cards section", () => {
    render(<WidgetsPage />)
    expect(screen.getByText("Statistics Cards")).toBeInTheDocument()
  })

  it("shows embed code", () => {
    render(<WidgetsPage />)
    expect(screen.getByText("Embed Code")).toBeInTheDocument()
  })

  it("shows customization info", () => {
    render(<WidgetsPage />)
    expect(screen.getByText("Customization")).toBeInTheDocument()
  })
})
