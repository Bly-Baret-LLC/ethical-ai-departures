"use client"

interface AnimatedCountProps {
  value: number
  className?: string
  animate?: boolean
}

export function AnimatedCount({ value, className, animate = false }: AnimatedCountProps) {
  return (
    <span className={className ?? ""} aria-live="polite">
      <span
        key={value}
        className={`inline-block tabular-nums${animate ? " digit-roll-in" : ""}`}
      >
        {value}
      </span>
    </span>
  )
}
