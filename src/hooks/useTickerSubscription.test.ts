import { describe, it, expect, vi, afterEach, beforeEach } from "vitest"
import { renderHook, act, cleanup } from "@testing-library/react"
import { useTickerSubscription } from "./useTickerSubscription"

// Track the callback registered via .on() so we can trigger it in tests
let realtimeCallback: ((payload: { new: Record<string, unknown> }) => void) | null = null
const mockRemoveChannel = vi.fn()

const mockChannel: Record<string, unknown> = {
  on: vi.fn((_event: string, _filter: unknown, cb: (payload: { new: Record<string, unknown> }) => void) => {
    realtimeCallback = cb
    return mockChannel
  }),
  subscribe: vi.fn(() => mockChannel),
}

vi.mock("@/lib/supabase/browser", () => ({
  createClient: vi.fn(() => ({
    channel: vi.fn(() => mockChannel),
    removeChannel: mockRemoveChannel,
  })),
}))

beforeEach(() => {
  realtimeCallback = null
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("useTickerSubscription", () => {
  it("returns null liveCount initially", () => {
    const { result } = renderHook(() => useTickerSubscription())

    expect(result.current.liveCount).toBeNull()
  })

  it("subscribes to ticker_stats changes on mount", () => {
    renderHook(() => useTickerSubscription())

    expect(mockChannel.on).toHaveBeenCalledWith(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "ticker_stats" },
      expect.any(Function)
    )
    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it("updates liveCount when valid payload arrives", () => {
    const { result } = renderHook(() => useTickerSubscription())

    act(() => {
      realtimeCallback!({
        new: {
          id: "d0000000-0000-4000-8000-000000000001",
          total_count: 42,
          ninety_day_count: 5,
          seniority_breakdown: {},
          updated_at: "2026-03-12T00:00:00Z",
        },
      })
    })

    expect(result.current.liveCount).toBe(42)
  })

  it("ignores invalid payloads", () => {
    const { result } = renderHook(() => useTickerSubscription())

    act(() => {
      realtimeCallback!({
        new: { invalid: "data" },
      })
    })

    expect(result.current.liveCount).toBeNull()
  })

  it("removes channel on unmount", () => {
    const { unmount } = renderHook(() => useTickerSubscription())

    unmount()

    expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel)
  })
})
