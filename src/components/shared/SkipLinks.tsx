export function SkipLinks() {
  return (
    <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-inverse focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-inverse"
      >
        Skip to main content
      </a>
      <a
        href="#profiles"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-14 focus:z-50 focus:rounded-md focus:bg-surface-inverse focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-inverse"
      >
        Skip to profiles
      </a>
    </nav>
  )
}
