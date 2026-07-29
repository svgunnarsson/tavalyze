import { ImageResponse } from "next/og";

export const alt = "Tavalyze — Football Market Intelligence";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 25% 25%, #123b38 0%, #07111f 42%, #040a12 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 48,
            display: "flex",
            flexDirection: "column",
            padding: "64px 72px",
            width: 1030,
          }}
        >
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>
            Tav<span style={{ color: "#22c55e" }}>alyze</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 900,
              letterSpacing: "-4px",
              lineHeight: 1.02,
              marginTop: 70,
            }}
          >
            Football market intelligence,
            <br />
            made transparent.
          </div>
          <div
            style={{
              color: "#94a3b8",
              display: "flex",
              fontSize: 27,
              marginTop: 34,
            }}
          >
            Player comparisons · Market values · Club intelligence
          </div>
        </div>
      </div>
    ),
    size,
  );
}
