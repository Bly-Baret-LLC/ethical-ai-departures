"use client"

import { useState, useRef } from "react"
import { submitSignal, type SignalActionResult } from "@/lib/actions/signals"

const CONCERN_OPTIONS = [
  "Safety culture",
  "Governance gaps",
  "Rushed deployment",
  "Alignment concerns",
  "Existential risk",
  "Transparency",
  "Worker conditions",
  "Militarization",
  "Privacy violations",
  "Environmental impact",
]

export function SignalForm() {
  const [result, setResult] = useState<SignalActionResult | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    const res = await submitSignal(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-6 space-y-4">
      <div>
        <p className="text-sm font-medium text-text-primary">
          What concerns you? *
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          Select all that apply.
        </p>
        <div className="mt-2 space-y-2">
          {CONCERN_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="concernCategories"
                value={option}
                className="rounded border-border-light text-accent-amber focus:ring-accent-amber"
              />
              <span className="text-text-primary">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="signal-company" className="block text-sm font-medium text-text-primary">
          Company (optional)
        </label>
        <input
          id="signal-company"
          name="company"
          placeholder="Your company (optional)"
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="signal-text" className="block text-sm font-medium text-text-primary">
          Additional context (optional)
        </label>
        <textarea
          id="signal-text"
          name="freeText"
          maxLength={500}
          rows={3}
          placeholder="Anything you'd like to add..."
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      {result && (
        <p
          className={`text-sm ${result.success ? "text-green-600" : "text-red-600"}`}
          role="status"
        >
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90 disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit Signal"}
      </button>
    </form>
  )
}
