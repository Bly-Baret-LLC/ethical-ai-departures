/**
 * Shared TypeScript types for the Warning Collective.
 * All types use camelCase (transformed from snake_case at Supabase boundary).
 */

/** Server Action response format — all Server Actions must return this shape */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

/** Re-export domain types from Zod schemas (camelCase, transformed) */
export type {
  Profile,
  ProfileRow,
  ProfileSource,
  ProfileSourceRow,
  ConcernTag,
  ConcernTagRow,
  TickerStats,
  TickerStatsRow,
} from "@/lib/schemas/profile"
