"use client"

import { useState, useRef } from "react"
import { createPrediction, type PredictionActionResult } from "@/lib/actions/predictions"

interface Profile {
  id: string
  name: string
}

export function PredictionEditorForm({ profiles }: { profiles: Profile[] }) {
  const [result, setResult] = useState<PredictionActionResult | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    const res = await createPrediction(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="pred-profile" className="block text-sm font-medium text-text-primary">
          Source Researcher *
        </label>
        <select
          id="pred-profile"
          name="profileId"
          required
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        >
          <option value="">Select a researcher...</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pred-title" className="block text-sm font-medium text-text-primary">
          Title *
        </label>
        <input
          id="pred-title"
          name="title"
          required
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="pred-description" className="block text-sm font-medium text-text-primary">
          Description
        </label>
        <textarea
          id="pred-description"
          name="description"
          rows={2}
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="pred-quote" className="block text-sm font-medium text-text-primary">
          Source Quote *
        </label>
        <textarea
          id="pred-quote"
          name="sourceQuote"
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
        <p className="mt-1 text-xs text-text-secondary">
          The exact quote or statement from which the prediction is extracted.
        </p>
      </div>

      <div>
        <label htmlFor="pred-criteria" className="block text-sm font-medium text-text-primary">
          Resolution Criteria *
        </label>
        <textarea
          id="pred-criteria"
          name="resolutionCriteria"
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
        <p className="mt-1 text-xs text-text-secondary">
          Must be falsifiable: describe specific, observable conditions that would confirm or disprove this prediction. Use neutral framing without editorial bias.
        </p>
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
        {pending ? "Saving..." : "Create Prediction"}
      </button>
    </form>
  )
}
