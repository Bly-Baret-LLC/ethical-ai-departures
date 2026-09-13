/** Editorial overviews for each company, based on documented departures. */
const companyOverviews: Record<string, string> = {
  openai:
    "OpenAI has the largest set of evidence-linked records in this tracker. They include Jan Leike, who said safety had taken 'a backseat to shiny products' after the Superalignment team dissolved; Daniel Kokotajlo, who said he lost confidence that the company would act responsibly around AGI; and Miles Brundage, who warned that 'neither OpenAI nor any other frontier lab is ready' for AGI. The record continues into 2026 with departures tied by public statements or independent reporting to ChatGPT advertising plans and a Pentagon partnership. The Superalignment team's dissolution is documented separately as an organizational event and does not establish any other individual's motive.",

  google:
    "Google's evidence-linked record spans several distinct concerns rather than a single departure wave. The dismantling of its Ethical AI team led to the departures of Timnit Gebru, Margaret Mitchell, David Baker, Alex Hanna, and Dylan Baker; Meredith Whittaker had already left in 2019 citing retaliation for organizing the Google Walkout. In 2023, Geoffrey Hinton resigned to speak freely about existential AI risk, while Jonathan Richard Schwarz says he left DeepMind because of severe concerns about concentrated power at frontier laboratories. More recent departures by Alex Turner and René Mayrhofer were tied to Google's classified Pentagon AI agreement and the safeguards governing military and surveillance uses.",

  xai:
    "The tracker currently has one published xAI record: Devin Kim's contested wrongful-termination claim. Kim alleged that xAI fired him after he raised safety and governance concerns; xAI disputed his account. Other high-profile exits from xAI are not included merely because they happened near a company controversy or involved people with safety-related roles.",

  anthropic:
    "Anthropic, founded as a safety-focused lab, has two evidence-linked departures in this tracker. In February 2026, Head of Safeguards Research Mrinank Sharma resigned warning that 'the world is in peril' and described tension between Anthropic's safety goals and competitive pressure. In September, pre-training researcher Jacob Coxon resigned after concluding that neither Anthropic nor OpenAI was acting responsibly in the race toward self-improving AI. Coxon said Anthropic's safety work was sincere, but argued that competition would eventually force unacceptable trade-offs.",

  meta:
    "Meta's evidence-linked record centers on Frances Haugen, a product manager on the Civic Integrity team who disclosed internal documents and later testified before Congress about harms she said the company knew its products caused. The Civic Integrity team had been dissolved after the 2020 election. The tracker does not treat later changes to other oversight teams as evidence of any former employee's reason for leaving unless a source makes that connection.",

  twitter:
    "Twitter has two evidence-linked records tied to the November 2022 elimination of its ML Ethics, Transparency and Accountability team. Director Rumman Chowdhury and Senior Engineering Manager Joan Deitchman publicly described the layoffs and the end of the team's work on algorithmic fairness and transparency. The team-level change is documented separately as an organizational event.",

  "stability-ai":
    "Stability AI's most prominent safety departure was Ed Newton-Rex, Vice President of Audio, who resigned in November 2023 over the company's position that training generative AI on copyrighted works constitutes fair use. He wrote that 'companies worth billions of dollars are training generative AI models on creators' works without permission' and that he found this unacceptable. His departure highlighted growing tension across the industry over data ethics and the rights of creators whose work is used to train commercial AI systems.",
}

export function getCompanyOverview(slug: string): string | null {
  return companyOverviews[slug] ?? null
}
