import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { ForecastUpdateNote } from "./ForecastUpdateNote"
import { forecastUpdates, getForecastUpdate } from "@/data/forecast-updates"

afterEach(cleanup)
describe("dated forecast updates", () => {
  it("keeps card updates collapsed until requested", () => {
    const joe = forecastUpdates[0]
    const { container } = render(<ForecastUpdateNote profileSlug={joe.profileSlug} title={joe.title} compact />)
    const disclosure = container.querySelector("details")!
    expect(disclosure.open).toBe(false)
    fireEvent.click(screen.getByText("October 2026 update"))
    expect(disclosure.open).toBe(true)
    expect(screen.getByText(/verification ongoing/)).toBeVisible()
    expect(screen.getByRole("link", { name: /Results and verification/ })).toHaveAttribute("href", "https://github.com/openai/math")
    expect(screen.queryByText("Confirmed")).toBeNull()
  })
  it("shows the same sourced update expanded on the detail page", () => {
    const joe = forecastUpdates[0]
    const { container } = render(<ForecastUpdateNote profileSlug={joe.profileSlug} title={joe.title} />)
    expect(container.querySelector("details")).toBeNull()
    expect(screen.getByRole("region", { name: "Editorial update" })).toBeVisible()
    expect(screen.getByText(/Reviewed/)).toHaveTextContent("2026-10-26")
  })
  it("never attaches an update to a different statement or person", () => {
    expect(getForecastUpdate("joe-benton", forecastUpdates[1].title)).toBeUndefined()
    const { container } = render(<ForecastUpdateNote profileSlug="unknown" title="unknown" />)
    expect(container).toBeEmptyDOMElement()
  })
  it("has unique record matches, dated review and HTTPS evidence for every update", () => {
    expect(new Set(forecastUpdates.map((u) => `${u.profileSlug}:${u.title}`)).size).toBe(forecastUpdates.length)
    for (const update of forecastUpdates) {
      expect(update.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(update.sources.length).toBeGreaterThan(0)
      for (const source of update.sources) expect(new URL(source.url).protocol).toBe("https:")
    }
  })
})
