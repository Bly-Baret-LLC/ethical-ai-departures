/** Convert a single snake_case string to camelCase */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

/** Convert all keys of an object from snake_case to camelCase (shallow) */
export function snakeToCamelObject<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [snakeToCamel(key), value])
  )
}
