import { ExpandableText } from "./ExpandableText"

interface ForecastSourceProps {
  text: string | null
  verbatim?: boolean | null
  url?: string | null
  compact?: boolean
}

/** Do not style paraphrases or unverified wording as direct quotations. */
export function ForecastSource({ text, verbatim, url, compact = false }: ForecastSourceProps) {
  if (!text && !url) return null
  const Body = verbatim === true ? "blockquote" : "div"
  return (
    <div className={`${compact ? "mt-3" : "mt-6"} border-l-2 border-accent-amber/30 pl-4`}>
      {text && (
        <Body>
          {compact ? (
            <ExpandableText text={text} clampLines={3} className={`text-sm text-text-secondary${verbatim === true ? " italic" : ""}`} />
          ) : (
            <p className={`text-text-secondary${verbatim === true ? " italic" : ""}`}>{text}</p>
          )}
        </Body>
      )}
      <p className="mt-1 text-xs text-text-secondary">
        {text && (verbatim === false ? "Paraphrase — not a verbatim quotation." : verbatim === true ? "Verbatim excerpt." : "Quotation status unverified.")}
        {url && <a href={url} target="_blank" rel="noopener noreferrer" className="ml-1 text-accent-info underline hover:text-accent-info/80">Source</a>}
      </p>
    </div>
  )
}
