import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { PredictionEditorForm } from "./PredictionEditorForm"

export const metadata: Metadata = {
  title: "New Prediction · Editorial Dashboard",
}

async function getProfiles() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, name")
    .order("name")

  return data ?? []
}

export default async function NewPredictionPage() {
  const profiles = await getProfiles()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold text-text-primary">
        Create New Prediction
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Extract a falsifiable prediction from a researcher&apos;s public statements.
      </p>
      <PredictionEditorForm profiles={profiles} />
    </main>
  )
}
