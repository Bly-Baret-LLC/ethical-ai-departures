"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { OgPreviewData } from "@/app/api/og-preview/route"

interface SourceTooltipProps {
  url: string
  children: React.ReactNode
}

const previewCache = new Map<string, OgPreviewData>()
const HOVER_DELAY = 300
const DISMISS_DELAY = 200

export function SourceTooltip({ url, children }: SourceTooltipProps) {
  const [visible, setVisible] = useState(false)
  const [preview, setPreview] = useState<OgPreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState<"bottom" | "top">("bottom")
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const fetchPreview = useCallback(async () => {
    if (previewCache.has(url)) {
      setPreview(previewCache.get(url)!)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`)
      if (res.ok) {
        const data: OgPreviewData = await res.json()
        previewCache.set(url, data)
        setPreview(data)
      }
    } catch {
      // Fetch failed — tooltip just won't show enriched data
    } finally {
      setLoading(false)
    }
  }, [url])

  const show = useCallback(() => {
    if (dismissTimeout.current) {
      clearTimeout(dismissTimeout.current)
      dismissTimeout.current = null
    }
    hoverTimeout.current = setTimeout(() => {
      setVisible(true)
      fetchPreview()

      // Compute position
      if (linkRef.current) {
        const rect = linkRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        setPosition(spaceBelow < 200 ? "top" : "bottom")
      }
    }, HOVER_DELAY)
  }, [fetchPreview])

  const hide = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
    dismissTimeout.current = setTimeout(() => {
      setVisible(false)
    }, DISMISS_DELAY)
  }, [])

  const cancelDismiss = useCallback(() => {
    if (dismissTimeout.current) {
      clearTimeout(dismissTimeout.current)
      dismissTimeout.current = null
    }
  }, [])

  // Keyboard: Escape dismisses
  useEffect(() => {
    if (!visible) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [visible])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      if (dismissTimeout.current) clearTimeout(dismissTimeout.current)
    }
  }, [])

  const hasContent = preview && (preview.title || preview.description)

  return (
    <span className="relative inline">
      <a
        ref={linkRef}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={visible ? `tooltip-${url}` : undefined}
      >
        {children}
      </a>

      {visible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${url}`}
          role="tooltip"
          onMouseEnter={cancelDismiss}
          onMouseLeave={hide}
          className={`absolute left-0 z-50 w-72 rounded-lg border border-border-light bg-bg-primary p-3 shadow-lg ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          } hidden lg:block`}
        >
          {loading && (
            <p className="text-xs text-text-secondary">Loading preview...</p>
          )}

          {!loading && hasContent && (
            <>
              {preview.image && (
                /* eslint-disable-next-line @next/next/no-img-element -- external OG images from arbitrary domains */
                <img
                  src={preview.image}
                  alt=""
                  className="mb-2 h-24 w-full rounded object-cover"
                />
              )}
              {preview.title && (
                <p className="text-sm font-semibold text-text-primary line-clamp-2">
                  {preview.title}
                </p>
              )}
              {preview.description && (
                <p className="mt-1 text-xs text-text-secondary line-clamp-3">
                  {preview.description}
                </p>
              )}
              <p className="mt-1 text-xs text-text-secondary">{preview.domain}</p>
            </>
          )}

          {!loading && !hasContent && preview && (
            <>
              <p className="text-sm font-medium text-text-primary">{preview.domain}</p>
              <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">
                {preview.path}
              </p>
            </>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-xs text-accent-info hover:underline"
          >
            Open in new tab ↗
          </a>
        </div>
      )}
    </span>
  )
}
