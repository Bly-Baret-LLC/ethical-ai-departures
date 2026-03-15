import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("@/lib/queries/stats", () => ({
  getStatsBridgeData: vi.fn().mockResolvedValue({
    companyCount: 4,
    topConcern: "Safety Deprioritization",
    seniorPct: 83,
  }),
}))

import { StatsBridge } from "./StatsBridge"

afterEach(() => {
  cleanup()
})

describe("StatsBridge", () => {
  it("renders 3 stat fragments", async () => {
    const jsx = await StatsBridge()
    render(jsx!)

    expect(screen.getByText(/4 companies/)).toBeInTheDocument()
    expect(
      screen.getByText(/Most common concern: Safety Deprioritization/)
    ).toBeInTheDocument()
    expect(screen.getByText(/83% senior roles/)).toBeInTheDocument()
  })

  it("renders middot separators", async () => {
    const jsx = await StatsBridge()
    render(jsx!)

    const dots = screen.getAllByText("·")
    expect(dots.length).toBe(2)
  })

  it("has role=status for accessibility", async () => {
    const jsx = await StatsBridge()
    render(jsx!)

    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("renders with zero companies and no concern", async () => {
    const { getStatsBridgeData } = await import("@/lib/queries/stats")
    vi.mocked(getStatsBridgeData).mockResolvedValueOnce({
      companyCount: 0,
      topConcern: null,
      seniorPct: 0,
    })

    const jsx = await StatsBridge()
    render(jsx!)

    expect(screen.getByText(/0 companies/)).toBeInTheDocument()
    expect(screen.getByText(/0% senior roles/)).toBeInTheDocument()
    expect(
      screen.queryByText(/Most common concern/)
    ).not.toBeInTheDocument()
  })

  it("returns null on data fetch error", async () => {
    const { getStatsBridgeData } = await import("@/lib/queries/stats")
    vi.mocked(getStatsBridgeData).mockRejectedValueOnce(new Error("DB down"))

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    const jsx = await StatsBridge()

    expect(jsx).toBeNull()
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to load stats bridge data:",
      expect.any(Error)
    )
    consoleError.mockRestore()
  })

  it("renders only 2 fragments when topConcern is null", async () => {
    const { getStatsBridgeData } = await import("@/lib/queries/stats")
    vi.mocked(getStatsBridgeData).mockResolvedValueOnce({
      companyCount: 3,
      topConcern: null,
      seniorPct: 50,
    })

    const jsx = await StatsBridge()
    render(jsx!)

    expect(screen.getByText(/3 companies/)).toBeInTheDocument()
    expect(screen.getByText(/50% senior roles/)).toBeInTheDocument()
    // Only 1 separator between 2 fragments
    const dots = screen.getAllByText("·")
    expect(dots.length).toBe(1)
  })
})
