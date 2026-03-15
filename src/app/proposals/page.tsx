import type { Metadata } from "next"
import Link from "next/link"
import { getProposals, type Proposal } from "@/lib/queries/proposals"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Policy Proposals · The Warning Collective",
  description:
    "Specific policy proposals from departing AI researchers, tagged by type and applicability.",
}

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; country?: string; sort?: string }>
}) {
  const params = await searchParams
  let proposals: Proposal[] = []

  try {
    proposals = await getProposals({
      type: params.type,
      country: params.country,
      sort: params.sort,
    })
  } catch {
    // Graceful fallback
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Policy Proposals
      </h1>
      <p className="mt-2 text-text-secondary">
        Specific policy recommendations from departing AI researchers.
      </p>

      {/* Sort controls */}
      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink href="/proposals" label="Newest" active={!params.sort} />
        <FilterLink
          href="/proposals?sort=votes"
          label="Most Voted"
          active={params.sort === "votes"}
        />
      </div>

      {proposals.length === 0 ? (
        <div className="mt-10 rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
          <p className="text-text-secondary">
            No proposals yet. Policy recommendations will appear here as researcher
            statements are analyzed.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {proposals.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-border-light bg-surface-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.inLegislation && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        In legislation
                      </span>
                    )}
                    <h2 className="font-medium text-text-primary">{p.title}</h2>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.typeTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/proposals?type=${tag}`}
                        className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs text-text-secondary hover:bg-surface-secondary/80"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center">
                  <span className="text-lg font-bold text-accent-amber">
                    {p.voteCount}
                  </span>
                  <span className="text-xs text-text-secondary">votes</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        active
          ? "bg-accent-amber text-white"
          : "bg-surface-secondary text-text-secondary hover:bg-surface-secondary/80"
      }`}
    >
      {label}
    </Link>
  )
}
