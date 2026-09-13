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

  useEffect(() => {
    const el = displayRef.current
    if (!el) { onComplete?.(); return }

    const renderedValue = Number.parseInt(el.textContent ?? "", 10)
    if (!animate || !Number.isFinite(renderedValue) || renderedValue === value) {
      el.textContent = String(value)
      onComplete?.()
      return
    }

    const duration = 2200
    const start = performance.now()
    let frameId = 0

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      el!.textContent = String(
        Math.round(renderedValue + (value - renderedValue) * eased)
      )

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        onComplete?.()
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [value, animate, onComplete])

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
