"use client"

import type { FilterOption, FilterState } from "@/hooks/useProfileFilters"
import type { ProfileWithTags } from "@/lib/schemas/profile"
import { ExportButtons } from "./ExportButtons"

interface FilterSectionProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}

function FilterSection({ title, options, selected, onToggle }: FilterSectionProps) {
  if (options.length === 0) return null

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {title}
      </h3>
      <ul className="mt-2 space-y-1">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onToggle(option.value)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-accent-amber/10 font-medium text-accent-amber"
                    : "text-text-secondary hover:bg-surface-secondary"
                }`}
                aria-pressed={isSelected}
              >
                <span className="truncate">{option.label}</span>
                <span className="ml-2 shrink-0 text-xs tabular-nums">
                  {option.count}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface FilterPanelProps {
  companies: FilterOption[]
  years: FilterOption[]
  concerns: FilterOption[]
  filters: FilterState
  onToggleFilter: (key: "company" | "year" | "concern", value: string) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  profiles: ProfileWithTags[]
  mobileOpen?: boolean
}

export function FilterPanel({
  companies,
  years,
  concerns,
  filters,
  onToggleFilter,
  onClearAll,
  hasActiveFilters,
  profiles,
  mobileOpen = false,
}: FilterPanelProps) {

  const panelContent = (
    <div className="space-y-6">
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-accent-amber hover:underline"
        >
          Clear all filters
        </button>
      )}
      <FilterSection
        title="Company"
        options={companies}
        selected={filters.company}
        onToggle={(v) => onToggleFilter("company", v)}
      />
      <FilterSection
        title="Year"
        options={years}
        selected={filters.year}
        onToggle={(v) => onToggleFilter("year", v)}
      />
      <FilterSection
        title="Concern"
        options={concerns}
        selected={filters.concern}
        onToggle={(v) => onToggleFilter("concern", v)}
      />
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Export
        </h3>
        <div className="mt-2">
          <ExportButtons profiles={profiles} filters={filters} />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Controlled by the button beside the evidence-category pills. */}
      {mobileOpen && (
          <aside
            id="filter-panel"
            className="rounded-lg border border-border-light bg-surface-card p-4 lg:hidden"
            aria-label="Filters"
          >
            {panelContent}
          </aside>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden w-60 shrink-0 lg:block"
        aria-label="Filters"
      >
        {panelContent}
      </aside>
    </>
  )
}
