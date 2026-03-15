"use client"

import { useState } from "react"
import {
  validateSeedData,
  importSeedData,
  type SeedValidationResult,
  type SeedImportResult,
} from "@/lib/actions/seed"

export function SeedForm() {
  const [jsonInput, setJsonInput] = useState("")
  const [validation, setValidation] = useState<SeedValidationResult | null>(null)
  const [importResult, setImportResult] = useState<SeedImportResult | null>(null)
  const [pending, setPending] = useState(false)

  async function handleValidate() {
    setPending(true)
    setImportResult(null)
    const result = await validateSeedData(jsonInput)
    setValidation(result)
    setPending(false)
  }

  async function handleImport() {
    if (!validation?.valid) return
    setPending(true)
    const result = await importSeedData(jsonInput)
    setImportResult(result)
    setPending(false)
    if (result.success) {
      setJsonInput("")
      setValidation(null)
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === "string") {
        setJsonInput(text)
        setValidation(null)
        setImportResult(null)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="mt-6 space-y-4">
      <div>
        <label htmlFor="seed-file" className="block text-sm font-medium text-text-primary">
          Upload JSON File
        </label>
        <input
          id="seed-file"
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="mt-1 block w-full text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-surface-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-primary hover:file:bg-surface-secondary/80"
        />
      </div>

      <div>
        <label htmlFor="seed-json" className="block text-sm font-medium text-text-primary">
          Or paste JSON directly
        </label>
        <textarea
          id="seed-json"
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value)
            setValidation(null)
            setImportResult(null)
          }}
          rows={12}
          placeholder={`[
  {
    "name": "Jane Smith",
    "company": "OpenAI",
    "role": "Safety Lead",
    "departureDate": "2025-03-15",
    "statedReason": "Concerns about safety culture",
    "status": "published",
    "sources": [
      { "url": "https://...", "title": "Interview", "platform": "NYT" }
    ],
    "concernTags": ["safety-culture", "governance"]
  }
]`}
          className="mt-1 w-full rounded-md border border-border-light bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleValidate}
          disabled={pending || !jsonInput.trim()}
          className="rounded-md border border-border-light px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-50"
        >
          {pending && !validation ? "Validating..." : "Validate"}
        </button>

        <button
          type="button"
          onClick={handleImport}
          disabled={pending || !validation?.valid}
          className="rounded-md bg-accent-amber px-4 py-2 text-sm font-medium text-white hover:bg-accent-amber/90 disabled:opacity-50"
        >
          {pending && validation?.valid ? "Importing..." : "Import"}
        </button>
      </div>

      {validation && (
        <div
          className={`rounded-md border p-4 text-sm ${
            validation.valid
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {validation.valid ? (
            <>
              <p className="font-medium">Validation passed</p>
              <ul className="mt-2 space-y-1">
                <li>{validation.profileCount} profile{validation.profileCount !== 1 ? "s" : ""}</li>
                <li>{validation.sourceCount} source{validation.sourceCount !== 1 ? "s" : ""}</li>
                <li>{validation.tagCount} unique tag{validation.tagCount !== 1 ? "s" : ""}</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-medium">Validation failed</p>
              <ul className="mt-2 space-y-1">
                {validation.errors.map((err, i) => (
                  <li key={i}>
                    {err.row >= 0 ? `Row ${err.row}: ` : ""}
                    {err.field !== "root" ? `${err.field} — ` : ""}
                    {err.message}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {importResult && (
        <p
          className={`text-sm ${importResult.success ? "text-green-600" : "text-red-600"}`}
          role="status"
        >
          {importResult.message}
        </p>
      )}
    </div>
  )
}
