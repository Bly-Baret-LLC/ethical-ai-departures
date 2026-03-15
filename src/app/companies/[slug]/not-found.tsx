import Link from "next/link"

export default function CompanyNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Company Not Found
      </h1>
      <p className="mt-4 text-text-secondary">
        No departures have been tracked for this company.
      </p>
      <Link
        href="/companies"
        className="mt-6 inline-block text-sm text-accent-amber hover:underline"
      >
        ← Browse all companies
      </Link>
    </main>
  )
}
