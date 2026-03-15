import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { AnimatedCount } from "./AnimatedCount"

afterEach(() => {
  cleanup()
})

describe("AnimatedCount", () => {
  it("renders the value", () => {
    render(<AnimatedCount value={42} />)

    expect(screen.getByText("42")).toBeInTheDocument()
  })

  it("has aria-live polite for screen readers", () => {
    render(<AnimatedCount value={10} />)

    const container = screen.getByText("10").closest("[aria-live]")
    expect(container).toHaveAttribute("aria-live", "polite")
  })

  it("applies custom className", () => {
    render(<AnimatedCount value={5} className="text-lg font-bold" />)

    const container = screen.getByText("5").closest("[aria-live]")
    expect(container).toHaveClass("text-lg", "font-bold")
  })

  it("uses tabular-nums for consistent digit width", () => {
    render(<AnimatedCount value={99} />)

    const digitSpan = screen.getByText("99")
    expect(digitSpan).toHaveClass("tabular-nums")
  })

  it("does not animate when animate is false", () => {
    render(<AnimatedCount value={7} />)

    const digitSpan = screen.getByText("7")
    expect(digitSpan).not.toHaveClass("digit-roll-in")
  })

  it("animates when animate prop is true", () => {
    render(<AnimatedCount value={20} animate />)

    const digitSpan = screen.getByText("20")
    expect(digitSpan).toHaveClass("digit-roll-in")
  })

  it("has overflow hidden on container", () => {
    render(<AnimatedCount value={5} />)

    const container = screen.getByText("5").closest("[aria-live]")
    expect(container).toHaveClass("overflow-hidden")
  })

  it("updates displayed value when prop changes", () => {
    const { rerender } = render(<AnimatedCount value={10} />)

    expect(screen.getByText("10")).toBeInTheDocument()

    rerender(<AnimatedCount value={20} />)

    expect(screen.getByText("20")).toBeInTheDocument()
    expect(screen.queryByText("10")).not.toBeInTheDocument()
  })
})
