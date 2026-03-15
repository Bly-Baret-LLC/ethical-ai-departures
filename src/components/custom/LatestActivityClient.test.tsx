import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { LatestActivityClient } from "./LatestActivityClient"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function stubLocalStorage(store: Record<string, string> = {}) {
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store[key] ?? null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  })
}

describe("LatestActivityClient", () => {
  it("renders children when user has visited", () => {
    stubLocalStorage({ "wc:has-visited": "true" })

    render(
      <LatestActivityClient>
        <div data-testid="child">Activity Content</div>
      </LatestActivityClient>
    )

    expect(screen.getByTestId("child")).toBeInTheDocument()
    // Should NOT have the hiding class
    expect(screen.getByTestId("child").parentElement).not.toHaveClass("hidden")
  })

  it("hides content on mobile for first-visit users", () => {
    stubLocalStorage({}) // no has-visited key

    const { container } = render(
      <LatestActivityClient>
        <div data-testid="child">Activity Content</div>
      </LatestActivityClient>
    )

    // Content still in DOM (for SEO)
    expect(screen.getByTestId("child")).toBeInTheDocument()
    // Wrapper should have hidden md:block class for mobile hiding
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.className).toContain("hidden")
    expect(wrapper.className).toContain("md:block")
  })

  it("does not set aria-hidden (screen readers should access content at all viewports)", () => {
    stubLocalStorage({})

    const { container } = render(
      <LatestActivityClient>
        <div>Content</div>
      </LatestActivityClient>
    )

    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.getAttribute("aria-hidden")).toBeNull()
  })
})
