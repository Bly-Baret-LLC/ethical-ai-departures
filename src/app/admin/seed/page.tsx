import type { Metadata } from "next"
import { SeedForm } from "./SeedForm"

export const metadata: Metadata = {
  title: "Content Seeding · Editorial Dashboard",
}

export default function SeedPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold text-text-primary">
        Content Seeding Tool
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Bulk-import researcher profiles from a JSON file. Profiles will be validated
        against the schema before import. All records are inserted individually — if one
        fails, previously imported records remain.
      </p>
      <SeedForm />
    </main>
  )
}
