"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import type { ProfileWithTags } from "@/lib/schemas/profile"

const columnHelper = createColumnHelper<ProfileWithTags>()

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  if (!direction) return null
  return (
    <span className="ml-1" aria-hidden="true">
      {direction === "asc" ? "↑" : "↓"}
    </span>
  )
}

interface ProfileTableProps {
  profiles: ProfileWithTags[]
}

export function ProfileTable({ profiles }: ProfileTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-text-primary">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("company", {
        header: "Company",
      }),
      columnHelper.accessor("role", {
        header: "Role",
      }),
      columnHelper.accessor("departureDate", {
        header: "Departure",
        cell: (info) => {
          const date = info.getValue()
          return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })
        },
      }),
      columnHelper.accessor("concernTags", {
        header: "Concerns",
        cell: (info) => {
          const tags = info.getValue()
          if (tags.length === 0) return <span className="text-text-secondary">—</span>
          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-accent-amber/10 px-2 py-0.5 text-xs text-accent-amber"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )
        },
        enableSorting: false,
      }),
    ],
    []
  )

  const table = useReactTable({
    data: profiles,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-border-light">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border-light bg-surface-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary ${
                    header.column.getCanSort() ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <SortIndicator direction={header.column.getIsSorted()} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border-light">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer bg-surface-card transition-colors hover:bg-surface-secondary"
              onClick={() => router.push(`/profiles/${row.original.slug}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  router.push(`/profiles/${row.original.slug}`)
                }
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-text-secondary">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
