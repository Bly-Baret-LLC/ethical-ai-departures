"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { submitContactRequest, type ContactResult } from "@/lib/actions/contact"

interface ContactButtonProps {
  label?: string
  dialogTitle?: string
  subtitle?: string
  contactType?: string
}

export function ContactButton({
  label = "Get in Touch",
  dialogTitle = "Get in Touch",
  subtitle = "Questions, tips, or want to collaborate? Drop us a line.",
  contactType = "general",
}: ContactButtonProps) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<ContactResult | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setResult(null)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  useEffect(() => {
    if (!open || !dialogRef.current) return
    const dialog = dialogRef.current
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
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
    formData.set("type", contactType)
    const res = await submitContactRequest(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
      setTimeout(close, 2500)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90 focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2"
      >
        {label}
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
            aria-label={dialogTitle}
            className="w-full max-w-lg rounded-lg border border-border-light bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                {dialogTitle}
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
              {subtitle}
            </p>

            <form ref={formRef} action={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="contact-btn-email" className="block text-sm font-medium text-text-primary">
                  Email
                </label>
                <input
                  id="contact-btn-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
                />
              </div>

              <div>
                <label htmlFor="contact-btn-message" className="block text-sm font-medium text-text-primary">
                  Message
                </label>
                <textarea
                  id="contact-btn-message"
                  name="message"
                  rows={4}
                  placeholder="What's on your mind?"
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
                  {pending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
