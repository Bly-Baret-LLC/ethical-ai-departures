import type { Metadata } from "next"
import Link from "next/link"
import { getCompanies } from "@/lib/queries/companies"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Companies · The Warning Collective",
  description: "Browse AI companies with tracked safety-motivated departures.",
}

export default async function CompaniesPage() {
  let companies
  try {
    companies = await getCompanies()
  } catch (error) {
    console.error("Failed to load companies:", error)
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          Companies
        </h1>
        <p className="mt-4 text-text-secondary">
          Unable to load companies. Please try again later.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Companies
      </h1>
      <p className="mt-2 text-text-secondary">
        AI companies with tracked safety-motivated departures, sorted by count.
      </p>

      <ul className="mt-8 space-y-3">
        {companies.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/companies/${c.slug}`}
              className="flex items-center justify-between rounded-lg border border-border-light bg-surface-card px-5 py-4 hover:border-accent-amber/50"
            >
              <span className="text-lg font-medium text-text-primary">
                {c.company}
              </span>
              <span className="text-sm text-text-secondary">
                {c.count} departure{c.count !== 1 ? "s" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {companies.length === 0 && (
        <p className="mt-8 text-text-secondary">No companies tracked yet.</p>
      )}
    </main>
  )
}
