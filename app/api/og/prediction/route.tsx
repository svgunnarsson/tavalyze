import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { players } from "@/data/players";
import { getPrediction, predictions } from "@/data/predictions";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const requestedId = request.nextUrl.searchParams.get("id");
  const prediction =
    (requestedId ? getPrediction(requestedId) : undefined) ?? predictions[0];
  const player = players.find((item) => item.id === prediction.playerId)!;
  const changePercent = Math.round(
    ((prediction.predictedValue - prediction.currentValue) /
      prediction.currentValue) *
      100,
  );

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at 15% 20%, #0e7490 0%, #07111f 38%, #050d18 72%, #14532d 125%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "48px 58px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 800 }}>
            Tav<span style={{ color: "#4ade80" }}>alyze</span>
          </div>
          <div
            style={{
              background: "rgba(56,189,248,.12)",
              border: "1px solid rgba(125,211,252,.35)",
              borderRadius: 999,
              color: "#bae6fd",
              display: "flex",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: 2,
              padding: "12px 20px",
            }}
          >
            DATED FORECAST
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "#94a3b8", display: "flex", fontSize: 21 }}>
            {player.club} · {player.position}
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 900, letterSpacing: -2, marginTop: 10 }}>
            {player.name}
          </div>

          <div style={{ alignItems: "flex-end", display: "flex", gap: 30, marginTop: 54 }}>
            <ValueBlock label="CURRENT ESTIMATE" value={prediction.currentValue} />
            <div style={{ color: "#475569", display: "flex", fontSize: 54, paddingBottom: 9 }}>→</div>
            <ValueBlock label="6-MONTH FORECAST" value={prediction.predictedValue} accent />
            <div
              style={{
                background: "rgba(74,222,128,.12)",
                borderRadius: 16,
                color: "#86efac",
                display: "flex",
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 9,
                padding: "11px 15px",
              }}
            >
              {changePercent >= 0 ? "+" : ""}{changePercent}%
            </div>
          </div>
        </div>

        <div style={{ alignItems: "center", color: "#94a3b8", display: "flex", fontSize: 18, justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>Published 24 Aug 2026 · Review 24 Feb 2027</div>
          <div style={{ display: "flex" }}>{prediction.confidence}% model confidence · tavalyze.com</div>
        </div>
      </div>
    ),
    { height: 630, width: 1200 },
  );
}

function ValueBlock({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ color: accent ? "#86efac" : "#94a3b8", display: "flex", fontSize: 17, fontWeight: 700, letterSpacing: 2 }}>
        {label}
      </div>
      <div style={{ color: accent ? "#4ade80" : "white", display: "flex", fontSize: 66, fontWeight: 900, marginTop: 4 }}>
        €{value}M
      </div>
    </div>
  );
}
