import { ImageResponse } from "next/og";

import { POSITIONING, SITE_NAME } from "@/lib/site";

export const alt = "RegainFlow — AI transformation partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated rather than shipped as a file, so the card can never disagree with
 * the positioning in `lib/site.ts`. No custom font is loaded — `next/og` would
 * need the font binary at build time, and the fallback carries the brand
 * adequately at this size.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050912",
          padding: "72px 80px",
          color: "#f2f5fa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 2, background: "#2f6bff" }} />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#8b96aa",
            }}
          >
            {POSITIONING}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: -3 }}>
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.25,
              color: "#8b96aa",
              maxWidth: 900,
            }}
          >
            Turn AI ambition into systems your business can run.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #253149",
            paddingTop: 28,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6e9bff",
          }}
        >
          <div style={{ display: "flex" }}>Discover · Implement · Scale</div>
          <div style={{ display: "flex", color: "#8b96aa" }}>
            regainflow.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
