"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { createProfile, type ProfileActionResult } from "@/lib/actions/profiles"

export function SubmitDepartureButton() {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<ProfileActionResult | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setResult(null)
  }, [])

  // Escape key closes modal
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  // Focus trap
  useEffect(() => {
    if (!open || !dialogRef.current) return
    const dialog = dialogRef.current
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'input, textarea, button, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length) focusable[0].focus()

    function onTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onTab)
    return () => document.removeEventListener("keydown", onTab)
  }, [open])

  async function handleSubmit(formData: FormData) {
    setPending(true)
    formData.set("status", "draft")
    const res = await createProfile(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
      setTimeout(close, 2000)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-b from-[#c41e1e] via-[#d42b2b] to-[#a51c1c] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
      >
        Submit a Departure
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
          role="presentation"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Submit a departure"
            className="w-full max-w-lg rounded-lg border border-border-light bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Submit a Departure
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded p-1 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-amber"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="mt-1 text-sm text-text-secondary">
              Know someone who left over safety concerns? Let us know.
            </p>

            <form ref={formRef} action={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="submit-name" className="block text-sm font-medium text-text-primary">
                  Name *
                </label>
                <input
                  id="submit-name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="submit-company" className="block text-sm font-medium text-text-primary">
                    Company *
                  </label>
                  <input
                    id="submit-company"
                    name="company"
                    required
                    className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  />
                </div>
                <div>
                  <label htmlFor="submit-role" className="block text-sm font-medium text-text-primary">
                    Role *
                  </label>
                  <input
                    id="submit-role"
                    name="role"
                    required
                    className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="submit-departure" className="block text-sm font-medium text-text-primary">
                  Departure Date *
                </label>
                <input
                  id="submit-departure"
                  name="departureDate"
                  type="date"
                  required
                  className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>

              <div>
                <label htmlFor="submit-reason" className="block text-sm font-medium text-text-primary">
                  Stated Reason
                </label>
                <textarea
                  id="submit-reason"
                  name="statedReason"
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>

              <div>
                <label htmlFor="submit-source" className="block text-sm font-medium text-text-primary">
                  Source Link
                </label>
                <input
                  id="submit-source"
                  name="sourceUrl"
                  type="url"
                  placeholder="Article, tweet, LinkedIn post, etc."
                  className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>

              {result && (
                <p
                  className={`text-sm ${result.success ? "text-green-600" : "text-red-600"}`}
                  role="status"
                >
                  {result.success
                    ? "Thank you \u2014 we\u2019ll review this submission."
                    : result.message}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-md border border-border-light px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-amber"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2"
                >
                  {pending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
