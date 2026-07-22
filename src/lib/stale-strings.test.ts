import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

/**
 * Remediation brief QA §8.1: verified-stale strings must not reappear in any
 * user-facing source file. Test files are excluded (they may reference the
 * forbidden strings in assertions like this one).
 */
const FORBIDDEN = [
  "59 researchers and executives",
  "9 of 11",
  "coordinated senior leadership exodus",
  "point to the original reporting",
  "Why They Quit",
  "Why They Left",
  "walked away from major companies",
]

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      sourceFiles(full, acc)
    } else if (
      /\.(ts|tsx)$/.test(entry) &&
      !/\.test\.(ts|tsx)$/.test(entry)
    ) {
      acc.push(full)
    }
  }
  return acc
}

describe("stale strings are absent from source (QA §8.1)", () => {
  const files = sourceFiles(join(process.cwd(), "src"))

  it.each(FORBIDDEN)("no source file contains %j", (needle) => {
    const offenders = files.filter((f) =>
      readFileSync(f, "utf8").includes(needle)
    )
    expect(offenders).toEqual([])
  })
})
