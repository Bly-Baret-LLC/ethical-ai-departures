import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { AnimatedCount } from "./AnimatedCount"

afterEach(() => {
  cleanup()
})

describe("AnimatedCount", () => {
  it("renders with aria-live polite for screen readers", () => {
    const { container } = render(<AnimatedCount value={42} />)

    const liveRegion = container.querySelector("[aria-live='polite']")
    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toHaveAttribute("aria-live", "polite")
  })

  it("applies custom className to both spans", () => {
    const { container } = render(<AnimatedCount value={5} className="text-lg font-bold" />)

    const liveRegion = container.querySelector("[aria-live='polite']")
    expect(liveRegion).toHaveClass("text-lg", "font-bold")
  })

  it("uses tabular-nums for consistent digit width", () => {
    const { container } = render(<AnimatedCount value={99} />)

    const liveRegion = container.querySelector("[aria-live='polite']")
    expect(liveRegion).toHaveClass("tabular-nums")
  })

  it("does not add digit-roll-in when animate is false", () => {
    const { container } = render(<AnimatedCount value={7} />)

    const liveRegion = container.querySelector("[aria-live='polite']")
    expect(liveRegion).not.toHaveClass("digit-roll-in")
  })

  it("adds digit-roll-in when animate prop is true", () => {
    const { container } = render(<AnimatedCount value={20} animate />)

    const liveRegion = container.querySelector("[aria-live='polite']")
    expect(liveRegion).toHaveClass("digit-roll-in")
  })

  it("has an invisible placeholder span for stable width", () => {
    const { container } = render(<AnimatedCount value={42} />)

    const placeholder = container.querySelector("[aria-hidden='true']")
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toHaveClass("invisible")
    expect(placeholder).toHaveTextContent("42")
  })

  it("uses CSS grid overlay layout", () => {
    const { container } = render(<AnimatedCount value={5} />)

    const grid = container.querySelector(".inline-grid")
    expect(grid).toBeInTheDocument()

    const children = grid!.querySelectorAll(":scope > span")
    expect(children).toHaveLength(2)
    expect(children[0]).toHaveClass("col-start-1", "row-start-1")
    expect(children[1]).toHaveClass("col-start-1", "row-start-1")
  })
})
