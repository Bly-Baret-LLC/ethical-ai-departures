import Link from "next/link"

export type SortOption = "date" | "name"

interface SortControlProps {
  activeSort: SortOption
  basePath: string
  searchParams?: Record<string, string>
}

function buildHref(
  basePath: string,
  sort: SortOption,
  searchParams?: Record<string, string>
) {
  const params = new URLSearchParams(searchParams)
  // Reset to page 1 when sort changes
  params.delete("page")
  if (sort !== "date") {
    params.set("sort", sort)
  } else {
    params.delete("sort")
  }
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
]

export function SortControl({
  activeSort,
  basePath,
  searchParams,
}: SortControlProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Sort profiles">
      <span className="mr-1 text-sm text-text-secondary">Sort:</span>
      {SORT_OPTIONS.map((option) =>
        option.value === activeSort ? (
          <span
            key={option.value}
            className="rounded-md bg-surface-secondary px-3 py-1 text-sm font-medium text-text-primary"
            aria-current="true"
          >
            {option.label}
          </span>
        ) : (
          <Link
            key={option.value}
            href={buildHref(basePath, option.value, searchParams)}
            className="rounded-md px-3 py-1 text-sm text-text-secondary hover:bg-surface-secondary"
          >
            {option.label}
          </Link>
        )
      )}
    </div>
  )
}
