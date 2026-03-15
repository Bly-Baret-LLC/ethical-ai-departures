"use client"

import { useState, useRef } from "react"
import { createProfile, type ProfileActionResult } from "@/lib/actions/profiles"

export function ProfileEditorForm() {
  const [result, setResult] = useState<ProfileActionResult | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    const res = await createProfile(formData)
    setResult(res)
    setPending(false)
    if (res.success) {
      formRef.current?.reset()
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-text-primary">
          Name *
        </label>
        <input
          id="profile-name"
          name="name"
          required
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="profile-company" className="block text-sm font-medium text-text-primary">
            Company *
          </label>
          <input
            id="profile-company"
            name="company"
            required
            className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
          />
        </div>
        <div>
          <label htmlFor="profile-role" className="block text-sm font-medium text-text-primary">
            Role *
          </label>
          <input
            id="profile-role"
            name="role"
            required
            className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
          />
        </div>
      </div>

      <div>
        <label htmlFor="profile-departure" className="block text-sm font-medium text-text-primary">
          Departure Date *
        </label>
        <input
          id="profile-departure"
          name="departureDate"
          type="date"
          required
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="profile-reason" className="block text-sm font-medium text-text-primary">
          Stated Reason
        </label>
        <textarea
          id="profile-reason"
          name="statedReason"
          rows={3}
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="profile-photo" className="block text-sm font-medium text-text-primary">
          Photo URL
        </label>
        <input
          id="profile-photo"
          name="photoUrl"
          type="url"
          placeholder="https://..."
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="profile-status" className="block text-sm font-medium text-text-primary">
          Status
        </label>
        <select
          id="profile-status"
          name="status"
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
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
        {pending ? "Saving..." : "Create Profile"}
      </button>
    </form>
  )
}
