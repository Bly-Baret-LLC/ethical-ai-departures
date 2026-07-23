import { describe, it, expect } from "vitest"
import {
  forecastSummary,
  forecastSummaryLine,
  isForecast,
  isBinaryForecast,
  type RecordKind,
} from "./forecasts"

const r = (recordKind: RecordKind, status: string, underReview = false) => ({
  recordKind,
  status,
  underReview,
})

describe("forecast counting rules (Tracker Review acceptance checks)", () => {
  it("warnings, claims, and syntheses never enter a forecast denominator", () => {
    const records = [
      r("warning", "open"),
      r("contemporaneous_claim", "not_applicable"),
      r("editorial_synthesis", "not_applicable"),
    ]
    const s = forecastSummary(records)
    expect(s.openForecasts).toBe(0)
    expect(s.confirmedForecasts).toBe(0)
    expect(s.warningsAndClaims).toBe(3)
  })

  it("non-forecast kinds can never be counted confirmed, whatever their status", () => {
    // Even if bad data slipped a 'confirmed' status onto a claim, the selector
    // must refuse to count it.
    const s = forecastSummary([r("contemporaneous_claim", "confirmed")])
    expect(s.confirmedForecasts).toBe(0)
  })

  it("probabilistic forecasts never contribute to binary confirmation counts", () => {
    expect(isForecast(r("probabilistic_forecast", "open"))).toBe(true)
    expect(isBinaryForecast(r("probabilistic_forecast", "open"))).toBe(false)
    const s = forecastSummary([r("probabilistic_forecast", "confirmed")])
    expect(s.confirmedForecasts).toBe(0)
  })

  it("partial never counts as confirmed", () => {
    const s = forecastSummary([r("prediction", "partially_resolved")])
    expect(s.confirmedForecasts).toBe(0)
  })

  it("under-review records are excluded from adjudicated tallies", () => {
    const s = forecastSummary([
      r("prediction", "open", true),
      r("prediction", "open", false),
    ])
    expect(s.openForecasts).toBe(1)
    expect(s.underReview).toBe(1)
  })

  it("reconciles the reviewed live set: 3 open forecasts, 4 warnings/claims, 0 confirmed", () => {
    const reviewed = [
      r("prediction", "open"), // PRED-01 disinformation
      r("probabilistic_forecast", "open"), // PRED-02 extinction estimate
      r("prediction", "open"), // PRED-03 RLHF scaling
      r("contemporaneous_claim", "not_applicable"), // PRED-04
      r("editorial_synthesis", "not_applicable"), // PRED-05
      r("contemporaneous_claim", "not_applicable"), // PRED-06
      r("contemporaneous_claim", "not_applicable"), // PRED-07
    ]
    const s = forecastSummary(reviewed)
    expect(s.openForecasts).toBe(3)
    expect(s.warningsAndClaims).toBe(4)
    expect(s.confirmedForecasts).toBe(0)
    expect(forecastSummaryLine(reviewed)).toBe(
      "3 open forecasts · 4 warnings and contemporaneous claims"
    )
  })

  it("summary line reports records still under review", () => {
    const line = forecastSummaryLine([
      r("prediction", "open"),
      r("prediction", "open", true),
    ])
    expect(line).toContain("1 record under review")
  })
})
