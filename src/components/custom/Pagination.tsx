import Link from "next/link"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

function buildHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string>
) {
  const params = new URLSearchParams(searchParams)
  if (page > 1) {
    params.set("page", String(page))
  } else {
    params.delete("page")
  }
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link
          href={buildHref(basePath, currentPage - 1, searchParams)}
          className="rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary"
          aria-label="Previous page"
        >
          Prev
        </Link>
      ) : (
        <span className="rounded-md px-3 py-2 text-sm text-text-secondary/40" aria-disabled="true">
          Prev
        </span>
      )}

      {pages.map((page) => (
        page === currentPage ? (
          <span
            key={page}
            aria-current="page"
            className="rounded-md bg-accent-amber px-3 py-2 text-sm font-medium text-surface-primary"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(basePath, page, searchParams)}
            className="rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary"
          >
            {page}
          </Link>
        )
      ))}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(basePath, currentPage + 1, searchParams)}
          className="rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface-secondary"
          aria-label="Next page"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-md px-3 py-2 text-sm text-text-secondary/40" aria-disabled="true">
          Next
        </span>
      )}
    </nav>
  )
}
