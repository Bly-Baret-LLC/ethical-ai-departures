import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("@/lib/queries/ticker", () => ({
  getTickerStats: vi.fn().mockResolvedValue({
    id: "d0000000-0000-4000-8000-000000000001",
    totalCount: 6,
    ninetyDayCount: 2,
    seniorityBreakdown: { "Safety Lead": 1, "Research Director": 1 },
    updatedAt: "2025-11-20T00:00:00Z",
  }),
}))

vi.mock("./TickerClient", () => ({
  TickerClient: ({
    totalCount,
    ninetyDayCount,
    seniorityText,
  }: {
    totalCount: number
    ninetyDayCount: number
    seniorityText: string
  }) => (
    <div
      data-testid="ticker-client"
      data-total-count={totalCount}
      data-ninety-day-count={ninetyDayCount}
      data-seniority-text={seniorityText}
    />
  ),
}))

import { TickerBlock } from "./TickerBlock"

afterEach(() => {
  cleanup()
})

describe("TickerBlock", () => {
  it("passes totalCount to TickerClient", async () => {
    const jsx = await TickerBlock()
    render(jsx)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-total-count", "6")
  })

  it("passes ninetyDayCount to TickerClient", async () => {
    const jsx = await TickerBlock()
    render(jsx)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-ninety-day-count", "2")
  })

  it("passes formatted seniority text to TickerClient", async () => {
    const jsx = await TickerBlock()
    render(jsx)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute(
      "data-seniority-text",
      "including 1 Safety Lead and 1 Research Director"
    )
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

  it("passes null seniority text when breakdown is empty", async () => {
    const { getTickerStats } = await import("@/lib/queries/ticker")
    vi.mocked(getTickerStats).mockResolvedValueOnce({
      id: "d0000000-0000-4000-8000-000000000001",
      totalCount: 0,
      ninetyDayCount: 0,
      seniorityBreakdown: {},
      updatedAt: "2025-11-20T00:00:00Z",
    })

    const jsx = await TickerBlock()
    render(jsx)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-total-count", "0")
    expect(client).not.toHaveAttribute("data-seniority-text")
  })
})
