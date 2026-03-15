"use client"

import { useState, useCallback } from "react"

interface ShareButtonsProps {
  url: string
  twitterText: string
  linkedInText?: string
}

export function ShareButtons({ url, twitterText, linkedInText }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available — fall back silently
    }
  }, [url])

  const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(url)}`
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Share">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
        aria-label={`Share on X (Twitter)${linkedInText ? "" : ""}`}
      >
        Share on X
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
        aria-label="Share on LinkedIn"
      >
        Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-md border border-border-light px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary"
        aria-label="Copy link to clipboard"
      >
        {copied ? "Link copied!" : "Copy URL"}
      </button>
    </div>
  )
}
