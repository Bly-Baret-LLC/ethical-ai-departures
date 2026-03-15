import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react"
import { SourceTooltip } from "./SourceTooltip"

const mockFetchResponse = {
  ok: true,
  json: () =>
    Promise.resolve({
      title: "Article Title",
      description: "Article description text",
      image: null,
      domain: "example.com",
      path: "/article",
    }),
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockFetchResponse))
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("SourceTooltip", () => {
  it("renders children as a link", () => {
    render(
      <SourceTooltip url="https://example.com/article">
        <span>Source Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link", { name: /Source Link/ })
    expect(link).toHaveAttribute("href", "https://example.com/article")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("does not show tooltip initially", () => {
    render(
      <SourceTooltip url="https://example.com">
        <span>Link</span>
      </SourceTooltip>
    )

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("shows tooltip after hover delay", async () => {
    render(
      <SourceTooltip url="https://example.com">
        <span>Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link")
    fireEvent.mouseEnter(link)

    // Before delay — no tooltip
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()

    // After 300ms delay
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByRole("tooltip")).toBeInTheDocument()
  })

  it("hides tooltip after mouse leave delay", async () => {
    render(
      <SourceTooltip url="https://example.com">
        <span>Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link")
    fireEvent.mouseEnter(link)

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    fireEvent.mouseLeave(link)

    // Still visible during dismiss delay
    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(200)
    })

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("shows tooltip on focus for keyboard navigation", async () => {
    render(
      <SourceTooltip url="https://example.com">
        <span>Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link")
    fireEvent.focus(link)

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByRole("tooltip")).toBeInTheDocument()
  })

  it("dismisses tooltip on Escape key", async () => {
    render(
      <SourceTooltip url="https://example.com">
        <span>Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link")
    fireEvent.mouseEnter(link)

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("keeps tooltip visible when mouse moves to tooltip", async () => {
    render(
      <SourceTooltip url="https://example.com">
        <span>Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link")
    fireEvent.mouseEnter(link)

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    const tooltip = screen.getByRole("tooltip")
    fireEvent.mouseLeave(link)
    fireEvent.mouseEnter(tooltip)

    // Advance past dismiss delay — tooltip should still be visible
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByRole("tooltip")).toBeInTheDocument()
  })

  it("renders 'Open in new tab' link in tooltip", async () => {
    render(
      <SourceTooltip url="https://example.com/article">
        <span>Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link")
    fireEvent.mouseEnter(link)

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    // Wait for fetch to resolve
    await act(async () => {
      await Promise.resolve()
    })

    const openLink = screen.getByText(/Open in new tab/)
    expect(openLink).toHaveAttribute("href", "https://example.com/article")
    expect(openLink).toHaveAttribute("target", "_blank")
  })

  it("has hidden lg:block class for mobile hiding", async () => {
    render(
      <SourceTooltip url="https://example.com">
        <span>Link</span>
      </SourceTooltip>
    )

    const link = screen.getByRole("link")
    fireEvent.mouseEnter(link)

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    const tooltip = screen.getByRole("tooltip")
    expect(tooltip.className).toContain("hidden")
    expect(tooltip.className).toContain("lg:block")
  })
})
