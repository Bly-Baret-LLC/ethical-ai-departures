// Global augmentation for the Plausible analytics script, which attaches a
// `plausible` function to `window` at runtime (see src/app/layout.tsx).
type PlausibleFn = (
  eventName: string,
  options?: {
    props?: Record<string, unknown>
  }
) => void

declare global {
  interface Window {
    plausible?: PlausibleFn
  }
}

export {}
