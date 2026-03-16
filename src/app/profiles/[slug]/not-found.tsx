import Link from "next/link"

export default function ProfileNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Profile Not Found
      </h1>
      <p className="mt-4 text-text-secondary">
        The profile you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-accent-amber hover:underline"
      >
        ← Browse all profiles
      </Link>
    </main>
  )
}
