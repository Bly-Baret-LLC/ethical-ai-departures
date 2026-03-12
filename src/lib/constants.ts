/** ISR revalidation interval for the ticker stats (seconds) */
export const TICKER_REVALIDATE_SECONDS = 60

/** ISR revalidation interval for the profile list (seconds) */
export const PROFILE_LIST_REVALIDATE_SECONDS = 300

/** Maximum number of Latest Activity items on desktop */
export const MAX_LATEST_ACTIVITY = 5

/** localStorage key prefix for all Warning Collective session data */
export const STORAGE_PREFIX = "wc:"

/** localStorage keys */
export const STORAGE_KEYS = {
  TICKER_EXPLAINER_DISMISSED: `${STORAGE_PREFIX}ticker-explainer-dismissed`,
  LAST_COUNT: `${STORAGE_PREFIX}last-count`,
  HAS_VISITED: `${STORAGE_PREFIX}has-visited`,
} as const
