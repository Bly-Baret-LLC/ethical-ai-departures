/** Editorial guides use the existing concern taxonomy, not new database tags. */
const sharedPageCopy = {
  evidenceHeading: "The departures",
  emptyEvidence: "No departures are currently listed here with an established connection to this concern.",
  recordLinkLabel: "Profile and sources →",
  allegationSummary: "These accounts allege a connection that remains disputed or unresolved. They are not included in the count above.",
  emptyAllegations: "No unresolved allegations are listed for this topic.",
  methodNote: "A person may appear on more than one topic page, so the counts cannot be added together. Team changes have their own records.",
  methodLinkLabel: "How we decide who’s included",
  relatedHeading: "Related topics",
} as const

export const concernGuides = [
  {
    slug: "safety-deprioritization",
    name: "Safety Deprioritization",
    title: "When AI safety becomes a reason to leave",
    description: "Why people leave AI companies over safety priorities, in their own words and through independent reporting. Read the accounts and their sources.",
    introduction: "In May 2024, Jan Leike explained why he had left OpenAI. He had been at odds with its leaders over the company’s priorities for some time. Safety culture and processes, he wrote, had “taken a backseat to shiny products.”",
    explanation: "His account points to a question of priorities: how much room an AI company makes for safety alongside its other ambitions. The departures below offer a view of those decisions from the people affected by them. Each profile links to the statements and reporting behind it.",
    question: "What these accounts can tell us",
    answer: "The evidence here connects a departure to a concern about safety priorities. It does not, on its own, show that a particular AI model is unsafe. Nor do we infer why someone left from a job title, a move to another company, or the timing of an exit.",
    pageCopy: {
      ...sharedPageCopy,
      introductionSourceLabel: "Leike’s statements, May 17, 2024",
      introductionSources: [
        { label: "Departure", href: "https://x.com/janleike/status/1791498174659715494" },
        { label: "Company priorities", href: "https://x.com/janleike/status/1791498178346549382" },
        { label: "Safety culture", href: "https://x.com/janleike/status/1791498184671605209" },
      ],
      evidenceSummary: "In these cases, the person’s own account or independent reporting links the departure to concerns about safety priorities. This is a collection of documented cases, not a complete count of departures across the industry.",
    },
  },
  {
    slug: "inadequate-oversight",
    name: "Inadequate Oversight",
    title: "Who holds AI companies to account?",
    description: "Departures linked to concerns about AI governance and oversight, with the people’s explanations, independent reporting, and sources for each case.",
    introduction: "When Gretchen Krueger announced her resignation from OpenAI in May 2024, she named some basic things she wanted to see improve: how decisions were made, how policies were enforced, and how people were held accountable.",
    explanation: "Oversight comes down to who can question a decision and what happens next. The accounts below concern the authority to review work, challenge leadership, and enforce policies inside AI companies. They offer a view of how those arrangements can become a reason to leave.",
    question: "What a departure can tell us",
    answer: "A disagreement about how a company is run is not proof of misconduct. Nor does a departure count tell us how safe its systems are. Company size and the amount of public reporting differ; the individual accounts tell us more than a ranking would.",
    pageCopy: {
      ...sharedPageCopy,
      introductionSourceLabel: "Krueger’s statements, May 22, 2024",
      introductionSources: [
        { label: "Resignation", href: "https://x.com/GretchenMarina/status/1793403475260551517" },
        { label: "Her concerns", href: "https://x.com/GretchenMarina/status/1793403476707565695" },
        { label: "Accountability and policy", href: "https://x.com/GretchenMarina/status/1793403478158836140" },
      ],
      evidenceSummary: "In these cases, the person’s own account or independent reporting connects the departure to concerns about oversight. The count covers this collection, not every governance dispute in the industry.",
    },
  },
  {
    slug: "lack-of-transparency",
    name: "Lack of Transparency",
    title: "AI transparency and the freedom to publish",
    description: "Accounts of leaving AI companies over transparency concerns, including publication limits and access to information, with sources and evidence labels.",
    introduction: "In October 2024, Miles Brundage announced that he was leaving OpenAI in part to gain more freedom to publish. He thought some restrictions were reasonable inside a company, but said they had become too limiting for the work he wanted to do.",
    explanation: "His explanation was not a blanket rejection of OpenAI; he also wrote positively about the work being done there. It illustrates why transparency concerns need to be read closely. A wish to publish more freely is different from an allegation that a company concealed information.",
    question: "What the sources establish",
    answer: "The label on each profile tells you how the departure is connected to the concern: through the person’s own words, independent reporting, or an unresolved allegation. Grouping an account under transparency does not establish that a company withheld information or acted improperly.",
    pageCopy: {
      ...sharedPageCopy,
      introductionSourceLabel: "Brundage’s account, October 23, 2024",
      introductionSources: [
        { label: "Why he was leaving OpenAI", href: "https://milesbrundage.substack.com/p/why-im-leaving-openai-and-what-im" },
      ],
      evidenceSummary: "In these cases, the person’s own account or independent reporting connects the departure to a concern about transparency. The count covers this collection; it is not a measure of how open a company is.",
    },
  },
] as const

export function getConcernGuide(slug: string) {
  return concernGuides.find((guide) => guide.slug === slug)
}

/** Retain the directory filters for topics without an authored guide. */
export function concernHref(slug: string, evidenceViewParam = "") {
  if (!getConcernGuide(slug)) return `/?concern=${slug}${evidenceViewParam}`
  const anchor = evidenceViewParam.includes("evidence=alleged") ? "#allegations" : ""
  return `/concerns/${slug}${anchor}`
}
