"use client"

import { useState } from "react"
import { signIn, type AuthResult } from "@/lib/actions/auth"

interface LoginFormProps {
  redirect?: string
}

export function LoginForm({ redirect }: LoginFormProps) {
  const [result, setResult] = useState<AuthResult | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    if (redirect) {
      formData.set("redirect", redirect)
    }
    const res = await signIn(formData)
    // signIn redirects on success, so we only get here on error
    setResult(res)
    setPending(false)
  }

  return (
    <form action={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-text-primary">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      {result && !result.success && (
        <p className="text-sm text-red-600" role="alert">
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90 disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
