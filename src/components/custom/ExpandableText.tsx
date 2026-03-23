"use client"

import { useRef, useState, useEffect } from "react"

interface ExpandableTextProps {
  text: string
  clampLines?: number
  className?: string
}

export function ExpandableText({ text, clampLines = 4, className = "" }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight)
    }
  }, [text, clampLines])

  return (
    <div className={className}>
      <p
        ref={textRef}
        className="text-sm leading-relaxed text-text-secondary"
        style={
          expanded
            ? undefined
            : {
                display: "-webkit-box",
                WebkitLineClamp: clampLines,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }
        }
      >
        {text}
      </p>
      {(isClamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-accent-amber hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  )
}
