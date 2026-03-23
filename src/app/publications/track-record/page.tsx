import { redirect } from "next/navigation"

export default function TrackRecordRedirect() {
  redirect("/publications?tab=predictions")
}
