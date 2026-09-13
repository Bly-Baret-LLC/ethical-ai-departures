import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LatestDepartureCallout } from "./LatestDepartureCallout"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  delete window.plausible
})

describe("LatestDepartureCallout", () => {
  it("links the factual homepage update to Jacob Coxon's profile", () => {
    render(<LatestDepartureCallout />)

    expect(
      screen.getByRole("heading", { name: /Jacob Coxon resigns from Anthropic/ })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Read the sourced record/ })).toHaveAttribute(
      "href",
      "/profiles/jacob-coxon"
    )
  })

  it("tracks clicks without collecting visitor data", () => {
    const plausible = vi.fn()
    window.plausible = plausible
    render(<LatestDepartureCallout />)

    fireEvent.click(screen.getByRole("link", { name: /Read the sourced record/ }))

    expect(plausible).toHaveBeenCalledWith("Latest Departure Click", {
      props: { profile: "jacob-coxon" },
    })
  })
})
