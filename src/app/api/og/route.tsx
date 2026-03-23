import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get("type") ?? "home"
  const name = searchParams.get("name") ?? ""
  const company = searchParams.get("company") ?? ""
  const quote = searchParams.get("quote") ?? ""
  const count = searchParams.get("count") ?? ""

  if (type === "profile") {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            backgroundColor: "#f0ebe0",
            padding: "60px 80px",
            borderTop: "8px solid #8b1a1a",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#b45309",
                fontSize: "32px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "#1c1917",
                  lineHeight: 1.1,
                  fontFamily: "Georgia, serif",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: "24px",
                  color: "#78716c",
                  marginTop: "8px",
                }}
              >
                Left {company}
              </span>
            </div>
          </div>

          {quote && (
            <div
              style={{
                display: "flex",
                marginTop: "40px",
                borderLeft: "4px solid #b45309",
                paddingLeft: "20px",
                fontSize: "28px",
                fontStyle: "italic",
                color: "#78716c",
                lineHeight: 1.4,
                maxWidth: "900px",
                fontFamily: "Georgia, serif",
              }}
            >
              &ldquo;{quote.slice(0, 120)}
              {quote.length > 120 ? "..." : ""}&rdquo;
            </div>
          )}

          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: "40px",
              left: "80px",
              fontSize: "20px",
              color: "#8b1a1a",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Ethical AI Departures
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // Default: homepage OG image
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#f0ebe0",
          padding: "60px",
          borderTop: "8px solid #8b1a1a",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 900,
            color: "#1c1917",
            lineHeight: 1.1,
            fontFamily: "Georgia, serif",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Ethical AI Departures
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#78716c",
            marginTop: "24px",
          }}
        >
          Who left. Why they left. What they predicted. Whether they were right.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "16px",
            color: "#b45309",
            marginTop: "32px",
          }}
        >
          ethicalaidepartures.fyi
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
