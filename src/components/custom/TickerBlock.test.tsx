import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("./TickerClient", () => ({
  TickerClient: ({
    evidenceLinkedCount,
    allegedCount,
  }: {
    evidenceLinkedCount: number
    allegedCount: number
  }) => (
    <div
      data-testid="ticker-client"
      data-total-count={evidenceLinkedCount}
      data-alleged-count={allegedCount}
    />
  ),
}))

import { TickerBlock } from "./TickerBlock"

afterEach(() => {
  cleanup()
})

describe("TickerBlock", () => {
  it("passes the evidence-linked headline count to TickerClient", () => {
    render(<TickerBlock evidenceLinkedCount={6} allegedCount={1} />)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-total-count", "6")
  })

  it("passes alleged counts to TickerClient", () => {
    render(<TickerBlock evidenceLinkedCount={6} allegedCount={1} />)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-alleged-count", "1")
  })

  it("passes zero counts correctly", () => {
    render(<TickerBlock evidenceLinkedCount={0} allegedCount={0} />)

    const client = screen.getByTestId("ticker-client")
    expect(client).toHaveAttribute("data-total-count", "0")
    expect(client).toHaveAttribute("data-alleged-count", "0")
  })
})
