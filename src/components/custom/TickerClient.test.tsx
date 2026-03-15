import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react"
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
  totalCount: 6,
  ninetyDayCount: 2,
  seniorityText: "including 1 Safety Lead",
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
      screen.getByText("AI researchers have left major companies over safety concerns")
    ).toBeInTheDocument()
  })

  it("renders 90-day count", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("2 in the last 90 days")).toBeInTheDocument()
  })

  it("renders seniority text", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("including 1 Safety Lead")).toBeInTheDocument()
  })

  it("shows explainer on first visit", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(
      screen.getByText(/this count tracks verified safety-motivated/i)
    ).toBeInTheDocument()
  })

  it("hides explainer when dismissed", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    const dismissBtn = screen.getByText(/got it, don't show again/i)
    fireEvent.click(dismissBtn)

    expect(
      screen.queryByText(/this count tracks verified safety-motivated/i)
    ).not.toBeInTheDocument()
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.TICKER_EXPLAINER_DISMISSED,
      "true"
    )
  })

  it("hides explainer if previously dismissed", async () => {
    store[STORAGE_KEYS.TICKER_EXPLAINER_DISMISSED] = "true"

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(
      screen.queryByText(/this count tracks verified safety-motivated/i)
    ).not.toBeInTheDocument()
  })

  it("shows delta badge when count increased", async () => {
    store[STORAGE_KEYS.LAST_COUNT] = "3"

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("+3 since your last visit")).toBeInTheDocument()
  })

  it("has aria-label on delta badge", async () => {
    store[STORAGE_KEYS.LAST_COUNT] = "4"

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    const badge = screen.getByLabelText(
      "+2 new departures since your last visit"
    )
    expect(badge).toBeInTheDocument()
  })

  it("does not show delta badge when count is same", async () => {
    store[STORAGE_KEYS.LAST_COUNT] = "6"

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(
      screen.queryByText(/since your last visit/i)
    ).not.toBeInTheDocument()
  })

  it("does not show delta badge on first visit", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(
      screen.queryByText(/since your last visit/i)
    ).not.toBeInTheDocument()
  })

  it("updates stored count after render", async () => {
    await act(async () => {
      render(<TickerClient {...defaultProps} totalCount={42} />)
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
        <TickerClient totalCount={0} ninetyDayCount={0} seniorityText="" />
      )
    })

    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("uses live count when available", async () => {
    mockLiveCount.current = 10

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("10")).toBeInTheDocument()
  })

  it("updates delta badge with live count", async () => {
    store[STORAGE_KEYS.LAST_COUNT] = "5"
    mockLiveCount.current = 10

    await act(async () => {
      render(<TickerClient {...defaultProps} />)
    })

    expect(screen.getByText("+5 since your last visit")).toBeInTheDocument()
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
