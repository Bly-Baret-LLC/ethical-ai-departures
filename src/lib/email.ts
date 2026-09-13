import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function emailSender() {
  return process.env.EMAIL_FROM ?? "Ethical AI Departures <onboarding@resend.dev>"
}

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
    from: emailSender(),
    to,
    subject: `Contact: ${contact.type} from ${contact.email || "anonymous"}`,
    text: lines.join("\n"),
  })
}

export async function sendDepartureNotification(submission: DepartureSubmission) {
  const to = process.env.NOTIFICATION_EMAIL
  if (!to || !process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: emailSender(),
    to,
    subject: `New departure submission: ${submission.name} (${submission.company})`,
    text: formatPlainText(submission),
  })
}

export interface SubscriptionConfirmation {
  email: string
  token: string
}

export async function sendSubscriptionConfirmation({
  email,
  token,
}: SubscriptionConfirmation) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send confirmation emails")
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethicalaidepartures.fyi"
  )
    .trim()
    .replace(/\/$/, "")
  const confirmationUrl = `${siteUrl}/subscribe/confirm?token=${encodeURIComponent(token)}`

  const { error } = await resend.emails.send({
    from: emailSender(),
    to: email,
    subject: "Confirm your Ethical AI Departures updates",
    text: [
      "Confirm your subscription to source-verified Ethical AI departure updates:",
      "",
      confirmationUrl,
      "",
      "If you did not request this, you can ignore this email.",
      "",
      "— Ethical AI Departures",
    ].join("\n"),
    html: `
      <p>Confirm your subscription to source-verified Ethical AI departure updates.</p>
      <p><a href="${confirmationUrl}">Confirm subscription</a></p>
      <p>If you did not request this, you can ignore this email.</p>
      <p>— Ethical AI Departures</p>
    `,
  })

  if (error) {
    throw new Error(`Unable to send confirmation email: ${error.message}`)
  }
}
