import { createClient } from "@/lib/supabase/server"
import { getPredictions } from "@/lib/queries/predictions"
import { SpotlightCarousel, type SpotlightSlide } from "./SpotlightCarousel"
import { forecastSummary, isForecast, isWarningOrClaim } from "@/lib/forecasts"

export async function PredictionSpotlight() {
  let predictions
  try {
    predictions = await getPredictions()
  } catch {
    return null
  }

  if (!predictions.length) return null

  // Tracker Review (2026-07-22): no accuracy score is shown. The spotlight
  // rotates through adjudicated records — open forecasts first, then
  // warnings/claims — with under-review records excluded from slides.
  const adjudicated = predictions.filter((p) => !p.underReview)
  const summary = forecastSummary(predictions)
  const spotlightRecords = [
    ...adjudicated.filter((p) => isForecast(p) && p.status === "open"),
    ...adjudicated.filter((p) => isWarningOrClaim(p)),
  ]

  if (!spotlightRecords.length) return null

  // Fetch linked publications for each confirmed prediction
  const supabase = await createClient()
  const slides: SpotlightSlide[] = await Promise.all(
    spotlightRecords.map(async (pred) => {
      const { data: links } = await supabase
        .from("publication_predictions")
        .select("publications(title, url)")
        .eq("prediction_id", pred.id)

      const linkedPublications = (links ?? [])
        .map((l) => l.publications as unknown as { title: string; url: string | null })
        .filter(Boolean)

      return {
        id: pred.id,
        title: pred.title,
        sourceQuote: pred.sourceQuote,
        status: pred.status,
        recordKind: pred.recordKind,
        underReview: pred.underReview,
        profileName: pred.profileName,
        profileSlug: pred.profileSlug,
        resolutionEvidenceUrl: pred.resolutionEvidenceUrl,
        resolutionDate: pred.resolutionDate,
        predictedDate: pred.predictedDate,
        linkedPublications,
      }
    })
  )

  return (
    <section
      aria-label="Prediction spotlight"
      className="mx-auto max-w-6xl px-6 pt-8"
    >
      <SpotlightCarousel
        slides={slides}
        openForecasts={summary.openForecasts}
        warningsAndClaims={summary.warningsAndClaims}
        underReview={summary.underReview}
      />
    </section>
  )
}
