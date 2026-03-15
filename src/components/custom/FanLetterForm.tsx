"use client"

import { useState, useRef } from "react"
import { submitFanLetter, type CommunityActionResult } from "@/lib/actions/community"

export function FanLetterForm({ profileId }: { profileId: string }) {
  const [result, setResult] = useState<CommunityActionResult | null>(null)
  const [pending, setPending] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    const res = await submitFanLetter(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
      setCharCount(0)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="profileId" value={profileId} />
      <textarea
        name="text"
        required
        maxLength={500}
        rows={3}
        placeholder="Write a note of support..."
        onChange={(e) => setCharCount(e.target.value.length)}
        className="w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{charCount}/500</span>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent-amber px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-amber/90 disabled:opacity-50"
        >
          {pending ? "Sending..." : "Send Note"}
        </button>
      </div>
      {result && (
        <p
          className={`text-sm ${result.success ? "text-green-600" : "text-red-600"}`}
          role="status"
        >
          {result.message}
        </p>
      )}
    </form>
  )
}
