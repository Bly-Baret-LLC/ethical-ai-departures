// Canonical evidence-model selectors and labels (remediation brief 2026-07-22).
// Every public count, metric, badge, and export derives from these helpers so
// no surface can drift from the canonical definition.

export type MotiveEvidence = "direct" | "reported" | "alleged" | "contextual"
export type DepartureType =
  | "resigned"
  | "fired"
  | "laid_off"
  | "team_eliminated"
  | "unknown"

/** Public-facing evidence labels (brief §2.2). */
export const EVIDENCE_LABELS: Record<MotiveEvidence, string> = {
  direct: "Explicitly stated",
  reported: "Reported connection",
  alleged: "Alleged retaliation",
  contextual: "Context only",
}

export const DEPARTURE_TYPE_LABELS: Record<DepartureType, string> = {
  resigned: "Resigned",
  fired: "Fired",
  laid_off: "Laid off",
  team_eliminated: "Team eliminated",
  unknown: "Departure",
}

interface EvidenceFields {
  motiveEvidence: MotiveEvidence
  headlineCounted: boolean
}

/**
 * A record counts toward the primary headline only when it is flagged AND its
 * evidence is direct or reported. Contextual and alleged records never count,
 * regardless of the flag (defense in depth alongside the DB constraint).
 */
export function isHeadlineCounted(p: EvidenceFields): boolean {
  return (
    p.headlineCounted &&
    (p.motiveEvidence === "direct" || p.motiveEvidence === "reported")
  )
}

export function headlineCount(profiles: EvidenceFields[]): number {
  return profiles.filter(isHeadlineCounted).length
}

export function contextualCount(profiles: EvidenceFields[]): number {
  return profiles.filter((p) => p.motiveEvidence === "contextual").length
}

export function allegedCount(profiles: EvidenceFields[]): number {
  return profiles.filter((p) => p.motiveEvidence === "alleged").length
}

/** Neutral profile title (brief SITE-06) — valid for voluntary and involuntary exits. */
export function profileTitle(name: string, company: string, year: number): string {
  return `${name} — Departure from ${company} (${year})`
}
