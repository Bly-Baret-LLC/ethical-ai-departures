"use client"

// Small shoe-print SVG — left and right alternating
function FootprintSVG({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="16"
      height="28"
      viewBox="0 0 16 28"
      fill="currentColor"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Sole */}
      <ellipse cx="8" cy="18" rx="5.5" ry="9" />
      {/* Toes */}
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="10" cy="4" r="2.2" />
      <circle cx="13" cy="7.5" r="1.8" />
    </svg>
  )
}

export function Footsteps({ active }: { active: boolean }) {
  if (!active) return null

  const steps = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${3 + i * 9.5}%`,
    delay: i * 0.22,
    isLeft: i % 2 === 0,
  }))

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {steps.map((step) => (
        <span
          key={step.id}
          className="absolute text-[#1c1917] opacity-0 footstep-walk"
          style={{
            left: step.left,
            bottom: step.isLeft ? "10px" : "18px",
            animationDelay: `${step.delay}s`,
            transform: `rotate(${step.isLeft ? -15 : 15}deg)`,
          }}
        >
          <FootprintSVG flip={!step.isLeft} />
        </span>
      ))}
    </div>
  )
}
