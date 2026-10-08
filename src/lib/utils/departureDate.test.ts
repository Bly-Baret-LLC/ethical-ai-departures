import { describe, expect, it } from "vitest"
import { departureDateIso, formatDepartureDate, isDepartureInWindow } from "./departureDate"

describe("departure date precision", () => {
  it("omits anchor months and days from dates and labels", () => {
    expect(departureDateIso("2026-01-01", "year")).toBe("2026")
    expect(departureDateIso("2026-09-01", "month")).toBe("2026-09")
    expect(departureDateIso("2026-09-24", "day")).toBe("2026-09-24")
    expect(formatDepartureDate("2026-01-01", "year")).toBe("2026")
    expect(formatDepartureDate("2026-09-01", "month")).toBe("Sep 2026")
    expect(formatDepartureDate("2026-09-24", "day")).toBe("Sep 24, 2026")
  })

  it("excludes uncertain periods that overlap the start of a recent window", () => {
    expect(isDepartureInWindow("2026-10-08", "year", "2026-07-10", "2026-10-08")).toBe(false)
    expect(isDepartureInWindow("2026-07-30", "month", "2026-07-10", "2026-10-08")).toBe(false)
    expect(isDepartureInWindow("2026-08-01", "month", "2026-07-10", "2026-10-08")).toBe(true)
    expect(isDepartureInWindow("2026-10-01", "month", "2026-07-10", "2026-10-08")).toBe(true)
  })

  it("includes the exact cutoff and excludes future dates and periods", () => {
    expect(isDepartureInWindow("2026-07-10", "day", "2026-07-10", "2026-10-08")).toBe(true)
    expect(isDepartureInWindow("2026-07-09", "day", "2026-07-10", "2026-10-08")).toBe(false)
    expect(isDepartureInWindow("2026-10-09", "day", "2026-07-10", "2026-10-08")).toBe(false)
    expect(isDepartureInWindow("2026-11-01", "month", "2026-07-10", "2026-10-08")).toBe(false)
    expect(isDepartureInWindow("2027-01-01", "year", "2026-07-10", "2026-10-08")).toBe(false)
  })
})
