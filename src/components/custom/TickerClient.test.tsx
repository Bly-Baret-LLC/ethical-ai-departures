import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, act, cleanup } from "@testing-library/react"
import { TickerClient } from "./TickerClient"
import { STORAGE_KEYS } from "@/lib/constants"

// Mock useTickerSubscription
const mockLiveCount = { current: null as number | null }

vi.mock("@/hooks/useTickerSubscription", () => ({
  useTickerSubscription: () => ({
    liveCount: mockLiveCount.current,
  }),
}))

// Mock AnimatedCount to render count directly for testing
vi.mock("./AnimatedCount", () => ({
  AnimatedCount: ({ value, className }: { value: number; className?: string }) => (
    <span className={className} aria-live="polite">{value}</span>
  ),
}))

// Mock localStorage for consistent behavior across Node versions
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

const defaultProps = {
  evidenceLinkedCount: 6,
  allegedCount: 1,
}

beforeEach(() => {
  mockLocalStorage.clear()
  mockLiveCount.current = null
  vi.clearAllMocks()
  vi.stubGlobal("localStorage", mockLocalStorage)
})

afterEach(() => {
  cleanup()
})

describe("TickerClient", () => {
  it("renders the ticker section with count", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("6")).toBeInTheDocument()
    expect(
      screen.getByText(
        /Researchers, engineers, and executives who left OpenAI/
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Every entry is backed by the person's own statement or independent reporting/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/1 disputed case is listed separately/)
    ).toBeInTheDocument()
    expect(screen.queryByText(/September 2026 update/)).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /What changed/ })).not.toBeInTheDocument()
  })

  it("updates stored count after render", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} evidenceLinkedCount={42} />)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.LAST_COUNT,
      "42"
    )
  })

  it("sets has-visited flag", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.HAS_VISITED,
      "true"
    )
  })

  it("renders with zero count without errors", async () => {
    await act(async () => {
      render(
        <TickerClient evidenceLinkedCount={0} allegedCount={0} />
      )
    })

    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("falls back to the evidence-linked count when the live count is invalid", async () => {
    mockLiveCount.current = Number.NaN
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("6")).toBeInTheDocument()
  })

  it("uses live count when available", async () => {
    mockLiveCount.current = 10

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("10")).toBeInTheDocument()
  })

  it("stores live count in localStorage", async () => {
    mockLiveCount.current = 15

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.LAST_COUNT,
      "15"
    )
  })
})
