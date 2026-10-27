import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { ForecastSource } from "./ForecastSource"

afterEach(cleanup)
describe("ForecastSource", () => {
  for (const compact of [true, false]) {
    it(`labels paraphrases without quote styling (compact=${compact})`, () => {
      const { container } = render(<ForecastSource text="An attributed summary." verbatim={false} url="https://example.org/source" compact={compact} />)
      expect(screen.getByText(/Paraphrase/)).toBeInTheDocument()
      expect(container.querySelector("blockquote")).toBeNull()
      expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute("href", "https://example.org/source")
    })
  }
  it("marks verified quotations", () => {
    const { container } = render(<ForecastSource text="Original wording." verbatim />)
    expect(screen.getByText("Verbatim excerpt.")).toBeInTheDocument()
    expect(container.querySelector("blockquote")).toHaveTextContent("Original wording.")
  })
  it("does not present unknown quotation status as verified", () => {
    const { container } = render(<ForecastSource text="Unverified wording." />)
    expect(screen.getByText("Quotation status unverified.")).toBeInTheDocument()
    expect(container.querySelector("blockquote")).toBeNull()
  })
})
