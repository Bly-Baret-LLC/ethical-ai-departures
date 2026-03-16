"use client"

import { useEffect, useRef } from "react"

interface AnimatedCountProps {
  value: number
  className?: string
  animate?: boolean
  onComplete?: () => void
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function AnimatedCount({ value, className, animate = false, onComplete }: AnimatedCountProps) {
  const displayRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const el = displayRef.current
    if (!el) { onComplete?.(); return }

    const duration = 2200
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      el!.textContent = String(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        onComplete?.()
      }
    }

    el.textContent = "0"
    requestAnimationFrame(tick)
  }, [value, onComplete])

  return (
    <span
      className="inline-grid"
      style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr", contain: "layout style" }}
    >
      <span
        className={`${className ?? ""} tabular-nums col-start-1 row-start-1 invisible${animate ? " digit-roll-in" : ""}`}
        aria-hidden="true"
      >
        {value}
      </span>
      <span
        ref={displayRef}
        className={`${className ?? ""} tabular-nums col-start-1 row-start-1 text-right${animate ? " digit-roll-in" : ""}`}
        aria-live="polite"
      >
        {value}
      </span>
    </span>
  )
}
