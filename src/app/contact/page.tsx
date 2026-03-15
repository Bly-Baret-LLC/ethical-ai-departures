import type { Metadata } from "next"
import { ContactForm } from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact · The Warning Collective",
  description:
    "Submit corrections, takedown requests, press inquiries, or general questions.",
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-text-primary">
        Contact Us
      </h1>
      <p className="mt-2 text-text-secondary">
        For corrections, takedown requests, press inquiries, or general
        questions. We aim to respond within 5 business days.
      </p>

      {/* Funding Transparency */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Funding & Independence
        </h2>
        <p className="mt-3 text-text-secondary leading-relaxed">
          The Warning Collective is independently funded and operates without
          financial support from any AI company tracked on this platform. We
          have no financial conflicts of interest. Our commitment is to
          accuracy and public accountability.
        </p>
      </section>

      {/* Contact Form */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Submit a Request
        </h2>
        <ContactForm />
      </section>

      {/* Direct Contact */}
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          Direct Contact
        </h2>
        <ul className="mt-3 space-y-2 text-text-secondary">
          <li>
            Press inquiries:{" "}
            <a
              href="mailto:press@thewarningcollective.org"
              className="text-accent-info underline"
            >
              press@thewarningcollective.org
            </a>
          </li>
          <li>
            General inquiries:{" "}
            <a
              href="mailto:hello@thewarningcollective.org"
              className="text-accent-info underline"
            >
              hello@thewarningcollective.org
            </a>
          </li>
        </ul>
      </section>
    </main>
  )
}
