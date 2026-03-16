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

  // Right-align the number in a grid cell sized to the final value.
  // The invisible placeholder sets the cell width; the visible number
  // shares the same grid cell so baseline and size are identical.
  return (
    <span
      className="inline-grid"
      style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }}
    >
      <span
        className={`${className ?? ""} tabular-nums col-start-1 row-start-1 invisible${animate ? " digit-roll-in" : ""}`}
        aria-hidden="true"
      >
        {value}
      </span>
      <span
        className={`${className ?? ""} tabular-nums col-start-1 row-start-1 text-right${animate ? " digit-roll-in" : ""}`}
        aria-live="polite"
      >
        {display}
      </span>
    </span>
  )
}
