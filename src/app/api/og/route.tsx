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
            backgroundColor: "#1a1a2e",
            padding: "60px 80px",
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
                backgroundColor: "#e2a03f",
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
                  color: "#ffffff",
                  lineHeight: 1.1,
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontSize: "24px",
                  color: "#a0a0b8",
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
                borderLeft: "4px solid #e2a03f",
                paddingLeft: "20px",
                fontSize: "28px",
                fontStyle: "italic",
                color: "#c0c0d0",
                lineHeight: 1.4,
                maxWidth: "900px",
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
              color: "#e2a03f",
              fontWeight: 600,
            }}
          >
            The Warning Collective
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
          backgroundColor: "#1a1a2e",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "120px",
            fontWeight: 700,
            color: "#e2a03f",
            lineHeight: 1,
          }}
        >
          {count || "—"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "32px",
            color: "#a0a0b8",
            marginTop: "16px",
          }}
        >
          safety-motivated departures tracked
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "28px",
            fontWeight: 600,
            color: "#ffffff",
            marginTop: "40px",
          }}
        >
          The Warning Collective
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "18px",
            color: "#707088",
            marginTop: "12px",
          }}
        >
          Public accountability for AI safety
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
