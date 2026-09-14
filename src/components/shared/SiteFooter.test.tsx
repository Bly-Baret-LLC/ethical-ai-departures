import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { SiteFooter } from "./SiteFooter"

afterEach(cleanup)

describe("SiteFooter", () => {
  it("keeps the evidence-standard update in the public footer", () => {
    render(<SiteFooter />)

    expect(
      screen.getByText(
        /September 2026 update: The headline count now reflects a stricter person-level evidence standard/
      )
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /What changed/ })).toHaveAttribute(
      "href",
      "/corrections"
    )
    expect(
      screen.getByRole("link", { name: /How we decide who's included/ })
    ).toHaveAttribute("href", "/about")
  })
})
