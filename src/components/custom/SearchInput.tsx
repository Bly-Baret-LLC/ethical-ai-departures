"use client"

import { useEffect, useRef, useState } from "react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  debounceMs?: number
}

export function SearchInput({
  value,
  onChange,
  debounceMs = 200,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Sync from external value changes (e.g., URL navigation)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setLocalValue(next)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onChange(next)
    }, debounceMs)
  }

  function handleClear() {
    setLocalValue("")
    if (timerRef.current) clearTimeout(timerRef.current)
    onChange("")
  }

  return (
    <div className="relative">
      <input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder="Search profiles..."
        aria-label="Search profiles"
        className="w-full rounded-md border border-border-light bg-surface-card px-3 py-2 pr-8 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}
