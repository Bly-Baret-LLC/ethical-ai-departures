import { describe, it, expect } from "vitest"
import { formatRelativeDate } from "./formatDate"

const NOW = new Date("2026-03-12T12:00:00Z")

describe("formatRelativeDate", () => {
  it('returns "Today" for same day', () => {
    expect(formatRelativeDate("2026-03-12", NOW)).toBe("Today")
  })

  it('returns "Yesterday" for one day ago', () => {
    expect(formatRelativeDate("2026-03-11", NOW)).toBe("Yesterday")
  })

  it('returns "X days ago" for 2-6 days', () => {
    expect(formatRelativeDate("2026-03-10", NOW)).toBe("2 days ago")
    expect(formatRelativeDate("2026-03-07", NOW)).toBe("5 days ago")
    expect(formatRelativeDate("2026-03-06", NOW)).toBe("6 days ago")
  })

  it('returns "X weeks ago" for 7-30 days', () => {
    expect(formatRelativeDate("2026-03-05", NOW)).toBe("1 week ago")
    expect(formatRelativeDate("2026-02-26", NOW)).toBe("2 weeks ago")
    expect(formatRelativeDate("2026-02-19", NOW)).toBe("3 weeks ago")
    expect(formatRelativeDate("2026-02-12", NOW)).toBe("4 weeks ago")
  })

  it("returns absolute date for >30 days", () => {
    expect(formatRelativeDate("2026-01-15", NOW)).toBe("Jan 15, 2026")
    expect(formatRelativeDate("2025-06-30", NOW)).toBe("Jun 30, 2025")
  })

  it("handles future dates as Today", () => {
    expect(formatRelativeDate("2026-03-15", NOW)).toBe("Today")
  })
})
