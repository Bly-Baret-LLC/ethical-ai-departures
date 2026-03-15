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
})

afterEach(() => {
  cleanup()
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
})
