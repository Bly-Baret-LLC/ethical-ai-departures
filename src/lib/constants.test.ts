import { describe, it, expect } from "vitest"
import {
  TICKER_REVALIDATE_SECONDS,
  PROFILE_LIST_REVALIDATE_SECONDS,
  MAX_LATEST_ACTIVITY,
  STORAGE_PREFIX,
  STORAGE_KEYS,
} from "./constants"

describe("constants", () => {
  it("defines ticker revalidation at 60 seconds", () => {
    expect(TICKER_REVALIDATE_SECONDS).toBe(60)
  })

  it("defines profile list revalidation at 300 seconds", () => {
    expect(PROFILE_LIST_REVALIDATE_SECONDS).toBe(300)
  })

  it("defines max latest activity items", () => {
    expect(MAX_LATEST_ACTIVITY).toBe(5)
  })

  it("uses wc: prefix for all storage keys", () => {
    expect(STORAGE_PREFIX).toBe("wc:")
    Object.values(STORAGE_KEYS).forEach((key) => {
      expect(key).toMatch(/^wc:/)
    })
  })
})
