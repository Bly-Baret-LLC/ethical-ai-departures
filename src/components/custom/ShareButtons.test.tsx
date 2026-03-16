import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react"
import { ShareButtons } from "./ShareButtons"

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("ShareButtons", () => {
  const defaultProps = {
    url: "https://ethicalaidepartures.fyi/profiles/elena-rodriguez",
    twitterText: "Elena Rodriguez left OpenAI over safety concerns.",
  }

  it("renders X/Twitter share link", () => {
    render(<ShareButtons {...defaultProps} />)

    const link = screen.getByRole("link", { name: /Share on X/ })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link.getAttribute("href")).toContain("x.com/intent/tweet")
    expect(link.getAttribute("href")).toContain(encodeURIComponent(defaultProps.twitterText))
  })

  it("renders LinkedIn share link", () => {
    render(<ShareButtons {...defaultProps} />)

    const link = screen.getByRole("link", { name: /Share on LinkedIn/ })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link.getAttribute("href")).toContain("linkedin.com/sharing")
    expect(link.getAttribute("href")).toContain(encodeURIComponent(defaultProps.url))
  })

  it("renders Copy URL button", () => {
    render(<ShareButtons {...defaultProps} />)

    expect(screen.getByRole("button", { name: /Copy link/ })).toBeInTheDocument()
    expect(screen.getByText("Copy URL")).toBeInTheDocument()
  })

  it("copies URL to clipboard and shows confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText },
    })

    render(<ShareButtons {...defaultProps} />)

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Copy link/ }))
    })

    expect(writeText).toHaveBeenCalledWith(defaultProps.url)
    expect(screen.getByText("Link copied!")).toBeInTheDocument()

    // Resets after 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText("Copy URL")).toBeInTheDocument()
  })

  it("has accessible group role", () => {
    render(<ShareButtons {...defaultProps} />)

    expect(screen.getByRole("group", { name: "Share" })).toBeInTheDocument()
  })

  it("includes url in Twitter share link", () => {
    render(<ShareButtons {...defaultProps} />)

    const link = screen.getByRole("link", { name: /Share on X/ })
    expect(link.getAttribute("href")).toContain(encodeURIComponent(defaultProps.url))
  })
})
