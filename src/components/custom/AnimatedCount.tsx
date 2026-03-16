"use client"

interface AnimatedCountProps {
  value: number
  className?: string
  animate?: boolean
}

export function AnimatedCount({ value, className, animate = false }: AnimatedCountProps) {
  return (
    <span
      key={value}
      className={`${className ?? ""} inline-block tabular-nums${animate ? " digit-roll-in" : ""}`}
      aria-live="polite"
    >
      {value}
    </span>
  )
}
