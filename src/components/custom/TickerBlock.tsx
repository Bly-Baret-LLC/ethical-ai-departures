import { TickerClient } from "./TickerClient"

interface TickerBlockProps {
  evidenceLinkedCount: number
  allegedCount: number
}

export function TickerBlock({
  evidenceLinkedCount,
  allegedCount,
}: TickerBlockProps) {
  return (
    <TickerClient
      evidenceLinkedCount={evidenceLinkedCount}
      allegedCount={allegedCount}
    />
  )
}
