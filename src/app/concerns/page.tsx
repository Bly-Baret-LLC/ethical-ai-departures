import type { Metadata } from "next"
import Link from "next/link"
import { concernGuides } from "@/data/concern-guides"

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi").trim()

export const metadata: Metadata = {
  title: "AI Safety, Governance & Transparency Concerns",
  description: "Guides to the concerns linked to documented AI departures: safety priorities, governance, and transparency. Explore the sources and evidence labels.",
  alternates: { canonical: `${siteUrl}/concerns` },
  openGraph: { url: `${siteUrl}/concerns` },
}

export default function ConcernsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-accent-red">Explore the record</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-text-primary sm:text-4xl">
        Concerns behind AI departures
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-text-secondary">
        Start with a question about safety, governance, or transparency. These
        guides explain the topic and connect you to individual departure records
        and their sources.
      </p>
      <div className="mt-10 grid gap-5">
        {concernGuides.map((guide) => (
          <article key={guide.slug} className="rounded-lg border border-border-light bg-surface-card p-6">
            <h2 className="font-serif text-xl font-semibold text-text-primary">
              <Link href={`/concerns/${guide.slug}`} className="hover:text-accent-amber underline-offset-4 hover:underline">
                {guide.title}
              </Link>
            </h2>
            <p className="mt-3 leading-relaxed text-text-secondary">{guide.introduction}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm leading-relaxed text-text-secondary">
        A concern tag organizes records; it does not establish a person&apos;s motive.
        Each guide separates evidence-linked departures from unresolved allegations.
        One person can appear under more than one concern.
      </p>
      <nav aria-label="Further research" className="mt-6 flex flex-wrap gap-5 text-sm text-accent-amber">
        <Link href="/themes" className="underline underline-offset-2">All concern categories</Link>
        <Link href="/companies" className="underline underline-offset-2">Browse by company</Link>
        <Link href="/about" className="underline underline-offset-2">Inclusion criteria</Link>
      </nav>
    </main>
  )
}
