const statusConfig: Record<string, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "border border-accent-amber text-accent-amber bg-transparent",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-accent-red/10 text-accent-red",
  },
  disproven: {
    label: "Disproven",
    className: "bg-stone-200 text-stone-600 line-through",
  },
  contradicted: {
    label: "Contradicted",
    className: "bg-stone-200 text-stone-600 line-through",
  },
  partially_resolved: {
    label: "Partially Resolved",
    className: "bg-accent-amber/10 text-accent-amber",
  },
  pending_review: {
    label: "Pending review",
    className: "border border-border-light text-text-secondary bg-transparent",
  },
  unresolvable: {
    label: "Unresolvable",
    className: "bg-stone-200 text-stone-600",
  },
  // Warnings / contemporaneous claims are not scored; they carry no
  // open/confirmed state (Prediction Tracker Review, 2026-07-22).
  not_applicable: {
    label: "Not scored",
    className: "border border-border-light text-text-secondary bg-transparent",
  },
}

interface PredictionStatusBadgeProps {
  status: string
}

export function PredictionStatusBadge({ status }: PredictionStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.open

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
