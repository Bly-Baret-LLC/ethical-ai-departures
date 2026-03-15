import type { Metadata } from "next"
import { LoginForm } from "./LoginForm"

export const metadata: Metadata = {
  title: "Editor Login · The Warning Collective",
}

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-semibold text-text-primary text-center">
          Editor Login
        </h1>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Access is restricted to authorized editors.
        </p>
        <LoginForm redirect={redirect} />
      </div>
    </main>
  )
}
