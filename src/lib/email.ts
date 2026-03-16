import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface DepartureSubmission {
  name: string
  company: string
  role: string
  departureDate: string
  statedReason?: string
  sourceUrl?: string
}

function formatPlainText(submission: DepartureSubmission): string {
  const lines = [
    `New departure submission received:`,
    ``,
    `Name: ${submission.name}`,
    `Company: ${submission.company}`,
    `Role: ${submission.role}`,
    `Departure Date: ${submission.departureDate}`,
  ]
  if (submission.statedReason) {
    lines.push(`Stated Reason: ${submission.statedReason}`)
  }
  if (submission.sourceUrl) {
    lines.push(`Source URL: ${submission.sourceUrl}`)
  }
  lines.push(``, `— Ethical AI Departures`)
  return lines.join("\n")
}

export interface ContactMessage {
  email: string
  message: string
  type: string
}

export async function sendContactNotification(contact: ContactMessage) {
  const to = process.env.NOTIFICATION_EMAIL
  if (!to || !process.env.RESEND_API_KEY) return

  const lines = [
    `New contact message received:`,
    ``,
    `Type: ${contact.type}`,
    `Email: ${contact.email}`,
    ``,
    `Message:`,
    contact.message,
    ``,
    `— Ethical AI Departures`,
  ]

  await resend.emails.send({
    from: "Ethical AI Departures <onboarding@resend.dev>",
    to,
    subject: `Contact: ${contact.type} from ${contact.email || "anonymous"}`,
    text: lines.join("\n"),
  })
}

export async function sendDepartureNotification(submission: DepartureSubmission) {
  const to = process.env.NOTIFICATION_EMAIL
  if (!to || !process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: "Ethical AI Departures <onboarding@resend.dev>",
    to,
    subject: `New departure submission: ${submission.name} (${submission.company})`,
    text: formatPlainText(submission),
  })
}
