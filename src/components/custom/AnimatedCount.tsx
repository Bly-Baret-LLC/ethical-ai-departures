"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCountProps {
  value: number
  className?: string
  animate?: boolean
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function AnimatedCount({ value, className, animate = false }: AnimatedCountProps) {
  const [display, setDisplay] = useState(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const duration = 2200
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      setDisplay(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    setDisplay(0)
    requestAnimationFrame(tick)
  }, [value])

  return (
    <span className="relative inline-block tabular-nums">
      {/* Invisible final value holds the width constant */}
      <span className="invisible" aria-hidden="true">
        <span
          className={`${className ?? ""} inline-block tabular-nums${animate ? " digit-roll-in" : ""}`}
        >
          {value}
        </span>
      </span>
      {/* Visible animated value overlaid on top */}
      <span
        className={`${className ?? ""} absolute left-0 top-0 inline-block tabular-nums${animate ? " digit-roll-in" : ""}`}
        aria-live="polite"
      >
        {display}
      </span>
    </span>
  )
}
