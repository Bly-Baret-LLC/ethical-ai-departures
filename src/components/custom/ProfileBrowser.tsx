"use client"

import { useMemo } from "react"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import {
  useProfileFilters,
  extractFilterOptions,
  filterProfiles,
} from "@/hooks/useProfileFilters"
import { ProfileCard } from "./ProfileCard"
import { FilterPanel } from "./FilterPanel"
import { SearchInput } from "./SearchInput"

interface ProfileBrowserProps {
  profiles: ProfileWithTags[]
}

export function ProfileBrowser({ profiles }: ProfileBrowserProps) {
  const { filters, toggleFilter, setSearch, clearAll, hasActiveFilters } =
    useProfileFilters()

  const { companies, years, concerns } = useMemo(
    () => extractFilterOptions(profiles),
    [profiles]
  )

  const filtered = useMemo(
    () => filterProfiles(profiles, filters),
    [profiles, filters]
  )

  const hasSearch = filters.q.length > 0

  return (
    <div className="mt-6">
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
              ? `Showing ${filtered.length} of ${profiles.length} profiles`
              : `${profiles.length} profile${profiles.length !== 1 ? "s" : ""}`}
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
