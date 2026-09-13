"use client"

import { useMemo } from "react"
import Link from "next/link"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import {
  useProfileFilters,
  extractFilterOptions,
  filterProfiles,
  matchesEvidenceView,
  type EvidenceView,
} from "@/hooks/useProfileFilters"
import { ProfileCard } from "./ProfileCard"
import { FilterPanel } from "./FilterPanel"
import { SearchInput } from "./SearchInput"

interface ProfileBrowserProps {
  profiles: ProfileWithTags[]
}

export function ProfileBrowser({ profiles }: ProfileBrowserProps) {
  const {
    filters,
    toggleFilter,
    setSearch,
    setEvidence,
    clearAll,
    hasActiveFilters,
  } = useProfileFilters()

  const evidenceCounts = useMemo(
    () => ({
      evidence: profiles.filter((profile) =>
        matchesEvidenceView(profile, "evidence")
      ).length,
      alleged: profiles.filter((profile) =>
        matchesEvidenceView(profile, "alleged")
      ).length,
    }),
    [profiles]
  )

  const evidenceViewProfiles = useMemo(
    () => profiles.filter((profile) => matchesEvidenceView(profile, filters.evidence)),
    [profiles, filters.evidence]
  )

  const { companies, years, concerns } = useMemo(
    () => extractFilterOptions(evidenceViewProfiles),
    [evidenceViewProfiles]
  )

  const filtered = useMemo(
    () => filterProfiles(profiles, filters),
    [profiles, filters]
  )

  const hasSearch = filters.q.length > 0

  const evidenceViews: Array<{
    value: EvidenceView
    label: string
    countLabel: string
    description: string
  }> = [
    {
      value: "evidence",
      label: "Evidence-linked",
      countLabel: "evidence-linked",
      description:
        "The person explicitly connected the departure to a concern, or credible independent reporting established the connection.",
    },
    {
      value: "alleged",
      label: "Unresolved allegations",
      countLabel: "unresolved-allegation",
      description:
        "The person or a legal complaint alleges retaliation or a related motive, but the claim is disputed or unresolved.",
    },
  ]

  const selectedEvidenceView =
    evidenceViews.find((view) => view.value === filters.evidence) ?? evidenceViews[0]

  return (
    <div className="mt-6">
      <section aria-labelledby="record-view-heading" className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="record-view-heading"
              className="font-serif text-2xl font-semibold text-text-primary"
            >
              Browse the record
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-text-secondary">
              {selectedEvidenceView.description}
            </p>
          </div>
          <Link
            href="/editorial-standards#evidence-categories"
            className="shrink-0 text-sm text-accent-info hover:underline"
          >
            How we classify records →
          </Link>
        </div>

        <div
          className="mt-4 flex flex-wrap gap-2"
          aria-label="Choose an evidence category"
        >
          {evidenceViews.map((view) => {
            const selected = filters.evidence === view.value
            return (
              <button
                key={view.value}
                type="button"
                onClick={() => setEvidence(view.value)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selected
                    ? "border-text-primary bg-text-primary text-surface-primary"
                    : "border-border-light bg-surface-card text-text-secondary hover:border-accent-amber/50 hover:text-text-primary"
                }`}
              >
                {view.label} ({evidenceCounts[view.value]})
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex flex-col gap-6 lg:flex-row">
      <FilterPanel
        companies={companies}
        years={years}
        concerns={concerns}
        filters={filters}
        onToggleFilter={toggleFilter}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
        profiles={filtered}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <SearchInput value={filters.q} onChange={setSearch} />
        </div>
        {/* Controls: count */}
        <div className="mb-4">
          <p className="text-sm text-text-secondary">
            {hasActiveFilters || hasSearch
              ? `Showing ${filtered.length} of ${evidenceViewProfiles.length} records in this category`
              : `${evidenceViewProfiles.length} ${selectedEvidenceView.countLabel} record${evidenceViewProfiles.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.concern.map((slug) => {
              const label = concerns.find((c) => c.value === slug)?.label ?? slug
              return (
                <button
                  key={`concern-${slug}`}
                  type="button"
                  onClick={() => toggleFilter("concern", slug)}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-amber/10 px-3 py-1 text-sm font-medium text-accent-amber hover:bg-accent-amber/20"
                >
                  {label}
                  <span aria-hidden="true">&times;</span>
                </button>
              )
            })}
            {filters.company.map((val) => {
              const label = companies.find((c) => c.value === val)?.label ?? val
              return (
                <button
                  key={`company-${val}`}
                  type="button"
                  onClick={() => toggleFilter("company", val)}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-amber/10 px-3 py-1 text-sm font-medium text-accent-amber hover:bg-accent-amber/20"
                >
                  {label}
                  <span aria-hidden="true">&times;</span>
                </button>
              )
            })}
            {filters.year.map((val) => (
              <button
                key={`year-${val}`}
                type="button"
                onClick={() => toggleFilter("year", val)}
                className="inline-flex items-center gap-1 rounded-full bg-accent-amber/10 px-3 py-1 text-sm font-medium text-accent-amber hover:bg-accent-amber/20"
              >
                {val}
                <span aria-hidden="true">&times;</span>
              </button>
            ))}
          </div>
        )}

        {/* Content: empty state or card grid */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border-light bg-surface-card px-6 py-12 text-center">
            <p className="text-text-secondary">
              {hasSearch
                ? "No profiles match your search"
                : "No profiles match these filters"}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 text-sm text-accent-amber hover:underline"
            >
              {hasSearch ? "Clear search" : "Clear all filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.map((profile) => (
              <ProfileCard
                key={profile.slug}
                slug={profile.slug}
                name={profile.name}
                role={profile.role}
                company={profile.company}
                departureDate={profile.departureDate}
                photoUrl={profile.photoUrl}
                statedReason={profile.statedReason}
                createdAt={profile.createdAt}
                concernTags={profile.concernTags}
                motiveEvidence={profile.motiveEvidence}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
