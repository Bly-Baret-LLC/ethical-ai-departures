// Editorial updates are separate from original statements and adjudications.
// Match slug + title because local and production record UUIDs differ. A title
// change deliberately requires review of the associated update.
export interface ForecastUpdate {
  profileSlug: string
  title: string
  reviewedOn: string
  text: string
  sources: { label: string; url: string }[]
}

const mathSources = [
  { label: "October 6 release", url: "https://openai.com/index/sharing-ai-progress-in-mathematics/" },
  { label: "Results and verification status", url: "https://github.com/openai/math" },
]

export const forecastUpdates: ForecastUpdate[] = [
  {
    profileSlug: "joe-benton",
    title: "AI agents smarter than any human could emerge within the next couple of years",
    reviewedOn: "2026-10-26",
    text: "On October 6, OpenAI released hundreds of AI-generated mathematical research results, with verification ongoing. These advances are relevant to Benton’s warning about rapidly improving capabilities. They do not establish agents with broadly superhuman intelligence or the loss-of-control risks he described.",
    sources: mathSources,
  },
  {
    profileSlug: "bilal-chughtai",
    title: "Frontier AI companies could build superintelligent systems within the next few years",
    reviewedOn: "2026-10-26",
    text: "OpenAI’s October 6 mathematics release adds to the capability advances Chughtai discussed in September. Verification of the results is ongoing. Progress in mathematical research is relevant to his warning, but does not establish systems that exceed human capabilities across every domain.",
    sources: mathSources,
  },
  {
    profileSlug: "ilya-sutskever",
    title: "Current human-feedback alignment methods will not scale to superintelligence",
    reviewedOn: "2026-10-26",
    text: "In January 2026, Jan Leike, co-author of the original statement, described progress in aligning current models while maintaining that superhuman alignment remains unsolved. His assessment points to both progress and remaining limits; it does not settle whether human-feedback methods can scale to superintelligence.",
    sources: [{ label: "Leike’s January 2026 assessment", url: "https://aligned.substack.com/p/alignment-is-not-solved-but-increasingly-looks-solvable" }],
  },
  {
    profileSlug: "geoffrey-hinton",
    title: "AI systems will generate persuasive disinformation at scale",
    reviewedOn: "2026-10-26",
    text: "A December 2025 Nature study found that AI conversations shifted participants’ candidate preferences in experiments in three countries; some model claims were inaccurate. This supports concern about AI persuasion. It does not establish a mass disinformation campaign with measured effects, as this record’s criteria require.",
    sources: [{ label: "Nature study", url: "https://www.nature.com/articles/s41586-025-09771-9" }],
  },
  {
    profileSlug: "daniel-kokotajlo",
    title: "AGI could plausibly arrive by 2027",
    reviewedOn: "2026-10-26",
    text: "Kokotajlo and co-authors updated their timeline model in August 2026, using coding productivity and revenue alongside task-duration measures. Their forecasts assume development proceeds as fast as technically feasible. This later work adds context; the original record’s attribution and 2027 deadline remain under review.",
    sources: [{ label: "August 2026 timelines update", url: "https://blog.aifutures.org/p/q25-2026-timelines-update-uplift" }],
  },
]

export function getForecastUpdate(profileSlug: string, title: string) {
  return forecastUpdates.find((update) => update.profileSlug === profileSlug && update.title === title)
}
