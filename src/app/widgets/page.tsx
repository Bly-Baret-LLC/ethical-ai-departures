import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Embeddable Widgets · The Warning Collective",
  description: "Embed Warning Collective widgets on your website.",
}

export default function WidgetsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewarningcollective.org"

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Embeddable Widgets
      </h1>
      <p className="mt-2 text-text-secondary">
        Embed Warning Collective data on your website. Copy the embed code below.
      </p>

      {/* Ticker Widget */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary">
          Departure Ticker
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Display the live departure count on your site.
        </p>
        <div className="mt-4 rounded-lg border border-border-light bg-surface-card p-6">
          <iframe
            src={`${siteUrl}/widgets/ticker`}
            width="280"
            height="80"
            style={{ border: "none", maxWidth: "100%" }}
            title="Warning Collective Ticker"
          />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-text-primary">Embed Code</label>
          <pre className="mt-1 overflow-x-auto rounded-md bg-surface-secondary p-3 text-xs text-text-secondary">
{`<iframe src="${siteUrl}/widgets/ticker"
  width="280" height="80"
  style="border:none"
  title="Warning Collective Ticker">
</iframe>`}
          </pre>
        </div>
      </section>

      {/* Stats Card Widget */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary">
          Statistics Cards
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Display departure statistics by company or concern category.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-text-primary">By Company</h3>
            <div className="mt-2 rounded-lg border border-border-light bg-surface-card p-6">
              <iframe
                src={`${siteUrl}/widgets/stats?type=company`}
                width="400"
                height="300"
                style={{ border: "none", maxWidth: "100%" }}
                title="Departures by Company"
              />
            </div>
            <pre className="mt-2 overflow-x-auto rounded-md bg-surface-secondary p-3 text-xs text-text-secondary">
{`<iframe src="${siteUrl}/widgets/stats?type=company"
  width="400" height="300"
  style="border:none"
  title="Departures by Company">
</iframe>`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-primary">By Concern</h3>
            <pre className="mt-2 overflow-x-auto rounded-md bg-surface-secondary p-3 text-xs text-text-secondary">
{`<iframe src="${siteUrl}/widgets/stats?type=concern"
  width="400" height="300"
  style="border:none"
  title="Departures by Concern">
</iframe>`}
            </pre>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary">Customization</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Add <code className="rounded bg-surface-secondary px-1 py-0.5 text-xs">?theme=dark</code> to
          any widget URL for dark mode. Widgets are responsive and adapt to their container.
        </p>
      </section>
    </main>
  )
}
