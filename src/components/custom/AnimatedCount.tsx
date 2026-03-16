"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCountProps {
  value: number
  className?: string
  animate?: boolean
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

export function AnimatedCount({ value, className, animate = false }: AnimatedCountProps) {
  const [display, setDisplay] = useState(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1800
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)
      setDisplay(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    setDisplay(0)
    requestAnimationFrame(tick)
  }, [value])

  return (
    <span
      className={`${className ?? ""} inline-block tabular-nums${animate ? " digit-roll-in" : ""}`}
      aria-live="polite"
    >
      {display}
    </span>
  )
}
