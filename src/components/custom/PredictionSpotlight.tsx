import { createClient } from "@/lib/supabase/server"
import { getPredictions } from "@/lib/queries/predictions"
import { SpotlightCarousel, type SpotlightSlide } from "./SpotlightCarousel"

export async function PredictionSpotlight() {
  let predictions
  try {
    predictions = await getPredictions()
  } catch {
    return null
  }

  if (!predictions.length) return null

  const confirmed = predictions.filter((p) => p.status === "confirmed")
  const total = predictions.length

  if (!confirmed.length) return null

  // Fetch linked publications for each confirmed prediction
  const supabase = await createClient()
  const slides: SpotlightSlide[] = await Promise.all(
    confirmed.map(async (pred) => {
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
        total={total}
      />
    </section>
  )
}
