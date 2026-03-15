import type { Metadata } from "next"
import { ProfileEditorForm } from "./ProfileEditorForm"

export const metadata: Metadata = {
  title: "New Profile · Editorial Dashboard",
}

export default function NewProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold text-text-primary">
        Create New Profile
      </h1>
      <ProfileEditorForm />
    </main>
  )
}
