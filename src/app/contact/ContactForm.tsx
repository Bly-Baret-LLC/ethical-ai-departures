"use client"

import { useState, useRef } from "react"
import { submitContactRequest, type ContactResult } from "@/lib/actions/contact"

const requestTypes = [
  { value: "correction", label: "Correction Request" },
  { value: "takedown", label: "Takedown Request" },
  { value: "press", label: "Press Inquiry" },
  { value: "general", label: "General Question" },
]

export function ContactForm() {
  const [result, setResult] = useState<ContactResult | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    const res = await submitContactRequest(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="contact-type" className="block text-sm font-medium text-text-primary">
          Request Type
        </label>
        <select
          id="contact-type"
          name="type"
          required
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        >
          {requestTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-text-primary">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Describe your request..."
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90 disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit Request"}
      </button>

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
