import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act, cleanup } from "@testing-library/react"
import { NewBadge } from "./NewBadge"
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
})

afterEach(() => {
  cleanup()
})

describe("NewBadge", () => {
  it("shows New badge when profile is newer than last visit", async () => {
    store[STORAGE_KEYS.LAST_VISIT_DATE] = "2026-03-01T00:00:00Z"

    await act(async () => {
      render(<NewBadge createdAt="2026-03-10T00:00:00Z" />)
    })

    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("does not show badge when profile is older than last visit", async () => {
    store[STORAGE_KEYS.LAST_VISIT_DATE] = "2026-03-10T00:00:00Z"

    await act(async () => {
      render(<NewBadge createdAt="2026-03-01T00:00:00Z" />)
    })

    expect(screen.queryByText("New")).not.toBeInTheDocument()
  })

  it("does not show badge on first visit (no stored date)", async () => {
    await act(async () => {
      render(<NewBadge createdAt="2026-03-10T00:00:00Z" />)
    })

    expect(screen.queryByText("New")).not.toBeInTheDocument()
  })
})
