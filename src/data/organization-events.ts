export interface OrganizationEventSource {
  title: string
  publisher: string
  url: string
  publishedDate: string
}

export interface OrganizationEvent {
  slug: string
  company: string
  companySlug: string
  title: string
  eventDate: string
  summary: string
  outcome: string
  peopleNote: string
  sources: OrganizationEventSource[]
}

export const organizationEvents: OrganizationEvent[] = [
  {
    slug: "openai-superalignment-team-dissolved",
    company: "OpenAI",
    companySlug: "openai",
    title: "Superalignment team dissolved",
    eventDate: "2024-05-17",
    summary:
      "OpenAI dissolved the Superalignment team less than a year after announcing it as a dedicated effort to control AI systems smarter than humans.",
    outcome:
      "OpenAI said the work would be integrated into other research efforts. The dissolution followed the departures of co-leads Ilya Sutskever and Jan Leike.",
    peopleNote:
      "Team membership or departure timing does not establish why any other individual left. Only people with person-level evidence appear in the departure tally.",
    sources: [
      {
        title: "OpenAI dissolves team focused on long-term AI safety risks",
        publisher: "CNBC",
        url: "https://www.cnbc.com/2024/05/17/openai-superalignment-sutskever-leike.html",
        publishedDate: "2024-05-17",
      },
      {
        title: "OpenAI's Long-Term AI Risk Team Has Disbanded",
        publisher: "WIRED",
        url: "https://www.wired.com/story/openai-superalignment-team-disbanded/",
        publishedDate: "2024-05-17",
      },
    ],
  },
  {
    slug: "microsoft-ethics-and-society-team-eliminated",
    company: "Microsoft",
    companySlug: "microsoft",
    title: "Ethics and Society team eliminated",
    eventDate: "2023-03",
    summary:
      "Microsoft eliminated its Ethics and Society team, which helped product teams put responsible AI principles into practice. Platformer reported that the remaining team members were told of the decision on March 6, 2023.",
    outcome:
      "Microsoft retained its Office of Responsible AI and said it had expanded responsibility for AI across its product teams and that office.",
    peopleNote:
      "Most members had already transferred within Microsoft during an earlier reorganization. The elimination was a team-level decision.",
    sources: [
      {
        title: "Microsoft just laid off one of its responsible AI teams",
        publisher: "Platformer",
        url: "https://www.platformer.news/microsoft-just-laid-off-one-of-its/",
        publishedDate: "2023-03-13",
      },
    ],
  },
  {
    slug: "twitter-meta-team-eliminated",
    company: "Twitter",
    companySlug: "twitter",
    title: "ML Ethics, Transparency and Accountability team eliminated",
    eventDate: "2022-11-04",
    summary:
      "Twitter eliminated its ML Ethics, Transparency and Accountability team during companywide layoffs after Elon Musk acquired the company.",
    outcome:
      "Former senior manager Joan Deitchman said the entire team had been fired. Former team member Kristian Lum said the entire team except one person was let go.",
    peopleNote:
      "Rumman Chowdhury and Joan Deitchman have separate evidence-linked records based on their public accounts of the layoffs and the team's work.",
    sources: [
      {
        title: "Elon Musk Has Fired Twitter's 'Ethical AI' Team",
        publisher: "WIRED",
        url: "https://www.wired.com/story/twitter-ethical-ai-team/",
        publishedDate: "2022-11-04",
      },
      {
        title: "Introducing our Responsible Machine Learning Initiative",
        publisher: "Twitter",
        url: "https://blog.x.com/en_us/topics/company/2021/introducing-responsible-machine-learning-initiative",
        publishedDate: "2021-04-14",
      },
    ],
  },
  {
    slug: "meta-responsible-innovation-team-disbanded",
    company: "Meta",
    companySlug: "meta",
    title: "Responsible Innovation team disbanded",
    eventDate: "2022-09-08",
    summary:
      "Meta disbanded its standalone Responsible Innovation team, which had advised product teams on potential societal and ethical harms.",
    outcome:
      "Meta said most of the roughly 20 team members would move into product groups so the work could be distributed across the company.",
    peopleNote:
      "Former director Zvika Krieger had already left for personal reasons. The later reorganization is not evidence that his departure was an ethical protest.",
    sources: [
      {
        title: "Meta disbands Responsible Innovation team",
        publisher: "The Register",
        url: "https://www.theregister.com/2022/09/09/meta_disbands_responsible_innovation_team/",
        publishedDate: "2022-09-09",
      },
      {
        title:
          "Meta dissolves team responsible for discovering potential harms to society",
        publisher: "Engadget",
        url: "https://www.engadget.com/meta-responsible-innovation-team-disbanded-194852979.html",
        publishedDate: "2022-09-08",
      },
    ],
  },
]

export function getOrganizationEventsByCompanySlug(
  companySlug: string
): OrganizationEvent[] {
  return organizationEvents.filter((event) => event.companySlug === companySlug)
}

export function countOrganizationEventsByCompanySlug(companySlug: string): number {
  return getOrganizationEventsByCompanySlug(companySlug).length
}
