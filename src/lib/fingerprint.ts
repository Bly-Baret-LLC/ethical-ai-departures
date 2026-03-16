export function generateFingerprint(userAgent: string, language: string, screenRes: string): string {
  // Simple hash for dedup — not cryptographic
  const input = `${userAgent}|${language}|${screenRes}`
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return Math.abs(hash).toString(36)
}
