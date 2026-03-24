import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { VisitTracker } from "./VisitTracker"
import { STORAGE_KEYS } from "@/lib/constants"

const store: Record<string, string> = {}
const mockLocalStorage = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key]
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach((key) => delete store[key])
  }),
  get length() {
    return Object.keys(store).length
  },
  key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
}

beforeEach(() => {
  mockLocalStorage.clear()
  vi.clearAllMocks()
  vi.stubGlobal("localStorage", mockLocalStorage)
  vi.stubGlobal("plausible", vi.fn())
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-03-24T12:00:00.000Z"))
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: "visible",
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("VisitTracker", () => {
  it("writes current date to localStorage on mount", () => {
    render(<VisitTracker />)

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.LAST_VISIT_DATE,
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
    )
  })

  it("renders nothing", () => {
    const { container } = render(<VisitTracker />)
    expect(container.innerHTML).toBe("")
  })

  it("reports active engagement when the tab becomes hidden", () => {
    render(<VisitTracker />)

    vi.advanceTimersByTime(22_000)
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    })
    document.dispatchEvent(new Event("visibilitychange"))

    expect(window.plausible).toHaveBeenCalledWith("Engagement Session", {
      props: {
        active_bucket: "10_to_29s",
        active_seconds: 22,
      },
    })
  })

  it("does not emit duplicate engagement events when pagehide fires after hiding", () => {
    render(<VisitTracker />)

    vi.advanceTimersByTime(8_000)
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    })
    document.dispatchEvent(new Event("visibilitychange"))
    window.dispatchEvent(new Event("pagehide"))

    expect(window.plausible).toHaveBeenCalledTimes(1)
  })
})
