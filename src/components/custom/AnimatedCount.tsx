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
  const targetDigits = String(value).length

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

  // Pad with invisible zeros so width never changes during count-up
  const displayStr = String(display)
  const padCount = targetDigits - displayStr.length

  return (
    <span
      className={`${className ?? ""} inline-block tabular-nums${animate ? " digit-roll-in" : ""}`}
      aria-live="polite"
    >
      {padCount > 0 && (
        <span className="invisible" aria-hidden="true">
          {"0".repeat(padCount)}
        </span>
      )}
      {display}
    </span>
  )
}
