/** Safely read from localStorage (returns null on error or in SSR) */
export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Safely write to localStorage (no-op on error or in SSR) */
export function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Graceful degradation: private browsing or storage full
  }
}

/** Noop subscribe for useSyncExternalStore one-time reads */
export const subscribeNoop = () => () => {}
