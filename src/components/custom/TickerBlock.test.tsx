import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("@/lib/queries/ticker", () => ({
  getTickerStats: vi.fn().mockResolvedValue({
    documentedCount: 10,
    totalCount: 6,
    ninetyDayCount: 2,
    contextualCount: 3,
    allegedCount: 1,
  }),
}))

vi.mock("./TickerClient", () => ({
  TickerClient: ({
    documentedCount,
    evidenceLinkedCount,
    contextualCount,
    allegedCount,
  }: {
    documentedCount: number
    evidenceLinkedCount: number
    contextualCount: number
    allegedCount: number
  }) => (
    <div
      data-testid="ticker-client"
      data-documented-count={documentedCount}
      data-total-count={evidenceLinkedCount}
      data-contextual-count={contextualCount}
      data-alleged-count={allegedCount}
    />
  ),
}))

import { TickerBlock } from "./TickerBlock"

afterEach(() => {
  cleanup()
})

describe("TickerBlock", () => {
  it("passes the evidence-linked headline count to TickerClient", async () => {
    const jsx = await TickerBlock()
    render(jsx)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-total-count", "6")
    expect(client).toHaveAttribute("data-documented-count", "10")
  })

  it("passes contextual and alleged counts to TickerClient", async () => {
    const jsx = await TickerBlock()
    render(jsx)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-contextual-count", "3")
    expect(client).toHaveAttribute("data-alleged-count", "1")
  })

  it("returns null when getTickerStats fails", async () => {
    const { getTickerStats } = await import("@/lib/queries/ticker")
    vi.mocked(getTickerStats).mockRejectedValueOnce(new Error("DB down"))

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const jsx = await TickerBlock()

    expect(jsx).toBeNull()
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load ticker stats:",
      expect.any(Error)
    )
    consoleError.mockRestore()
  })

  it("passes zero counts correctly", async () => {
    const { getTickerStats } = await import("@/lib/queries/ticker")
    vi.mocked(getTickerStats).mockResolvedValueOnce({
      documentedCount: 0,
      totalCount: 0,
      ninetyDayCount: 0,
      contextualCount: 0,
      allegedCount: 0,
    })

    const jsx = await TickerBlock()
    render(jsx)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-total-count", "0")
  })
})
