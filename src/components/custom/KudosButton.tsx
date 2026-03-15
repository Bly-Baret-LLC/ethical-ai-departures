"use client"

import { useState } from "react"
import { giveKudos } from "@/lib/actions/community"
import { generateFingerprint } from "@/lib/actions/votes"

function readKudosGiven(profileId: string): boolean {
  try {
    const kudos = JSON.parse(localStorage.getItem("wc:kudos") || "{}")
    return !!kudos[profileId]
  } catch {
    return false
  }
}

export function KudosButton({
  profileId,
  initialCount,
}: {
  profileId: string
  initialCount: number
}) {
  const [count, setCount] = useState(initialCount)
  const [hasGiven, setHasGiven] = useState(() => readKudosGiven(profileId))
  const [pending, setPending] = useState(false)

  async function handleClick() {
    if (hasGiven || pending) return

    setPending(true)
    setCount((c) => c + 1)

    const fp = generateFingerprint(
      navigator.userAgent,
      navigator.language,
      `${screen.width}x${screen.height}`
    )

    const fd = new FormData()
    fd.set("profileId", profileId)
    fd.set("fingerprintHash", fp)

    const res = await giveKudos(fd)
    setPending(false)

    if (res.success) {
      setHasGiven(true)
      try {
        const kudos = JSON.parse(localStorage.getItem("wc:kudos") || "{}")
        kudos[profileId] = true
        localStorage.setItem("wc:kudos", JSON.stringify(kudos))
      } catch {
        // Best effort
      }
    } else {
      setCount((c) => c - 1)
      if (res.message.includes("already")) setHasGiven(true)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={hasGiven || pending}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        hasGiven
          ? "bg-accent-amber/10 text-accent-amber"
          : "border border-border-light text-text-secondary hover:bg-surface-secondary"
      } disabled:cursor-default`}
      aria-label={`Give kudos (${count})`}
    >
      <span aria-hidden="true">{hasGiven ? "\u2764" : "\u2661"}</span>
      {count}
    </button>
  )
}
