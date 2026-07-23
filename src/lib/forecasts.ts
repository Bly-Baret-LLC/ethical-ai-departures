// Canonical forecast/warning selectors (Prediction Tracker Review, 2026-07-22).
// Forecast counting rules: only prediction and probabilistic_forecast records
// can enter a forecast total; warnings, contemporaneous claims, and editorial
// syntheses never appear in a confirmation denominator; probabilistic
// forecasts never contribute to a binary confirmation percentage; partial is
// never counted as confirmed; and no percentage is reported when no forecast
// has reached a valid resolution point.

export type RecordKind =
  | "prediction"
  | "probabilistic_forecast"
  | "warning"
  | "contemporaneous_claim"
  | "editorial_synthesis"

export const RECORD_KIND_LABELS: Record<RecordKind, string> = {
  prediction: "Forecast",
  probabilistic_forecast: "Probabilistic forecast",
  warning: "Warning",
  contemporaneous_claim: "Contemporaneous claim",
  editorial_synthesis: "Editorial synthesis",
}

interface ForecastFields {
  recordKind: RecordKind
  status: string
  underReview: boolean
}

export function isForecast(p: ForecastFields): boolean {
  return (
    p.recordKind === "prediction" || p.recordKind === "probabilistic_forecast"
  )
}

export function isWarningOrClaim(p: ForecastFields): boolean {
  return !isForecast(p)
}

/** Binary-scoreable forecasts only (probabilistic forecasts are excluded). */
export function isBinaryForecast(p: ForecastFields): boolean {
  return p.recordKind === "prediction"
}

export interface ForecastSummary {
  openForecasts: number
  confirmedForecasts: number
  contradictedForecasts: number
  warningsAndClaims: number
  underReview: number
}

export function forecastSummary(records: ForecastFields[]): ForecastSummary {
  const reviewed = records.filter((p) => !p.underReview)
  return {
    openForecasts: reviewed.filter(
      (p) => isForecast(p) && p.status === "open"
    ).length,
    confirmedForecasts: reviewed.filter(
      (p) => isBinaryForecast(p) && p.status === "confirmed"
    ).length,
    contradictedForecasts: reviewed.filter(
      (p) =>
        isBinaryForecast(p) &&
        (p.status === "contradicted" || p.status === "disproven")
    ).length,
    warningsAndClaims: reviewed.filter(isWarningOrClaim).length,
    underReview: records.filter((p) => p.underReview).length,
  }
}

/** Public summary line, e.g. "3 open forecasts · 4 warnings and contemporaneous claims". */
export function forecastSummaryLine(records: ForecastFields[]): string {
  const s = forecastSummary(records)
  const parts = [
    `${s.openForecasts} open forecast${s.openForecasts === 1 ? "" : "s"}`,
    `${s.warningsAndClaims} warning${s.warningsAndClaims === 1 ? "" : "s"} and contemporaneous claims`,
  ]
  if (s.underReview > 0) {
    parts.push(`${s.underReview} record${s.underReview === 1 ? "" : "s"} under review`)
  }
  return parts.join(" · ")
}
