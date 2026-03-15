"use client"

import { useMemo } from "react"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import {
  useProfileFilters,
  extractFilterOptions,
  filterProfiles,
} from "@/hooks/useProfileFilters"
import { ProfileCard } from "./ProfileCard"
import { ProfileTable } from "./ProfileTable"
import { FilterPanel } from "./FilterPanel"
import { SearchInput } from "./SearchInput"
import { ExportButtons } from "./ExportButtons"

interface ProfileBrowserProps {
  profiles: ProfileWithTags[]
}

export function ProfileBrowser({ profiles }: ProfileBrowserProps) {
  const { filters, toggleFilter, setSort, setView, setSearch, clearAll, hasActiveFilters } =
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
      <div className="mb-4">
        <SearchInput value={filters.q} onChange={setSearch} />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
      <FilterPanel
        companies={companies}
        years={years}
        concerns={concerns}
        filters={filters}
        onToggleFilter={toggleFilter}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="min-w-0 flex-1">
        {/* Controls: count, export, view toggle, sort */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-text-secondary">
            {hasActiveFilters || hasSearch
              ? `Showing ${filtered.length} of ${profiles.length} profiles`
              : `${profiles.length} profile${profiles.length !== 1 ? "s" : ""}`}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <ExportButtons profiles={filtered} filters={filters} />
            {/* View toggle — hidden on mobile */}
            <div className="hidden items-center gap-1 md:flex" role="group" aria-label="View mode">
              {(["card", "table"] as const).map((mode) =>
                mode === filters.view ? (
                  <span
                    key={mode}
                    className="rounded-md bg-surface-secondary px-3 py-1 text-sm font-medium text-text-primary"
                    aria-current="true"
                  >
                    {mode === "card" ? "Cards" : "Table"}
                  </span>
                ) : (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setView(mode)}
                    className="rounded-md px-3 py-1 text-sm text-text-secondary hover:bg-surface-secondary"
                  >
                    {mode === "card" ? "Cards" : "Table"}
                  </button>
                )
              )}
            </div>

            {/* Sort control — only shown in card view */}
            {filters.view === "card" && (
              <div className="flex items-center gap-1" role="group" aria-label="Sort profiles">
                <span className="mr-1 text-sm text-text-secondary">Sort:</span>
                {(["date", "name"] as const).map((option) =>
                  option === filters.sort ? (
                    <span
                      key={option}
                      className="rounded-md bg-surface-secondary px-3 py-1 text-sm font-medium text-text-primary"
                      aria-current="true"
                    >
                      {option === "date" ? "Date" : "Name"}
                    </span>
                  ) : (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSort(option)}
                      className="rounded-md px-3 py-1 text-sm text-text-secondary hover:bg-surface-secondary"
                    >
                      {option === "date" ? "Date" : "Name"}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content: empty state, card grid, or table */}
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
        ) : filters.view === "table" ? (
          <ProfileTable profiles={filtered} />
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
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
