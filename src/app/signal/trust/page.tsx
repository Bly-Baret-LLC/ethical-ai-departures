import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Trust Documentation · Anonymous Signal · Ethical AI Departures",
}

export default function TrustPage() {
  return (
    <main className="prose prose-slate mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/signal"
        className="text-sm text-text-secondary no-underline hover:text-accent-amber"
      >
        &larr; Back to Signal
      </Link>

      <h1 className="mt-6 font-serif">Trust Documentation</h1>

      <h2>Technical Architecture</h2>
      <p>
        The anonymous signal feature is designed with privacy as the primary constraint.
        The <code>anonymous_signals</code> database table stores only four fields:
      </p>
      <ul>
        <li><strong>concern_categories</strong> &mdash; The concern types you selected (required)</li>
        <li><strong>company_optional</strong> &mdash; Your company, if you chose to share it</li>
        <li><strong>free_text_optional</strong> &mdash; Any additional context (max 500 characters)</li>
        <li><strong>created_at</strong> &mdash; When the signal was submitted</li>
      </ul>

      <h2>What Is NOT Stored</h2>
      <ul>
        <li>No IP address logging on the signal endpoint</li>
        <li>No cookies set during or after submission</li>
        <li>No browser fingerprinting (unlike prediction voting, which uses fingerprints for dedup)</li>
        <li>No analytics or tracking pixels on the signal page</li>
        <li>No server-side session tracking</li>
      </ul>

      <h2>Data Handling</h2>
      <ul>
        <li>Signals are stored in a Supabase PostgreSQL database with Row-Level Security</li>
        <li>Only aggregate counts are displayed publicly &mdash; individual signals are never shown</li>
        <li>Category breakdowns only appear when 10+ signals exist for a category to prevent de-anonymization</li>
        <li>Database access is limited to the service role (server-side only)</li>
      </ul>

      <h2>Access Controls</h2>
      <ul>
        <li>The editorial team can view aggregate counts but not individual signals</li>
        <li>The database service role key is stored in environment variables, never exposed to the client</li>
        <li>No API endpoint returns individual signal records</li>
      </ul>

      <h2>Deletion Policy</h2>
      <p>
        Signals are retained indefinitely for aggregate counting. Since no PII is collected,
        there is no personal data to delete. If the feature is discontinued, all signal data
        will be permanently deleted.
      </p>

      <h2>Open Source</h2>
      <p>
        The anonymous signal submission component (form, server action, and database schema)
        is part of the open-source Ethical AI Departures codebase. You can inspect the full
        implementation to verify our privacy claims.
      </p>

      <h2>Third-Party Audit</h2>
      <p>
        We are committed to completing a third-party privacy audit within 90 days of launch.
        Audit results will be published publicly on this page.
      </p>
    </main>
  )
}
