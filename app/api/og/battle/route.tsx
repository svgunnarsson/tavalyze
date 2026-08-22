import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { players } from "@/data/players";

export const runtime = "edge";

function resolvePlayer(id: string | null, fallbackIndex: number) {
  return players.find((player) => player.id === id) ?? players[fallbackIndex];
}

export async function GET(request: NextRequest) {
  const first = resolvePlayer(request.nextUrl.searchParams.get("first"), 0);
  const second = resolvePlayer(request.nextUrl.searchParams.get("second"), 1);

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at 18% 25%, #0e7490 0%, #07111f 34%, #050d18 66%, #14532d 120%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "48px 58px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 32, fontWeight: 800 }}>
            Tav<span style={{ color: "#4ade80" }}>alyze</span>
          </div>
          <div
            style={{
              background: "rgba(34,211,238,.12)",
              border: "1px solid rgba(103,232,249,.35)",
              borderRadius: 999,
              color: "#a5f3fc",
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              padding: "12px 20px",
            }}
          >
            BATTLE LAB
          </div>
        </div>

        <div
          style={{
            alignItems: "stretch",
            display: "flex",
            flex: 1,
            gap: 22,
            marginTop: 40,
          }}
        >
          <PlayerPanel
            accent="#67e8f9"
            align="left"
            club={first.club}
            name={first.name}
            value={first.marketValue}
          />
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              width: 118,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "linear-gradient(135deg, #67e8f9, #4ade80)",
                borderRadius: 999,
                color: "#04101b",
                display: "flex",
                fontSize: 36,
                fontStyle: "italic",
                fontWeight: 900,
                height: 92,
                justifyContent: "center",
                width: 92,
              }}
            >
              VS
            </div>
          </div>
          <PlayerPanel
            accent="#4ade80"
            align="right"
            club={second.club}
            name={second.name}
            value={second.marketValue}
          />
        </div>

        <div
          style={{
            color: "#94a3b8",
            display: "flex",
            fontSize: 19,
            justifyContent: "center",
            marginTop: 28,
          }}
        >
          Market value · Age profile · Verified stats · Tavalyze Index
        </div>
      </div>
    ),
    { height: 630, width: 1200 },
  );
}

function PlayerPanel({
  accent,
  align,
  club,
  name,
  value,
}: {
  accent: string;
  align: "left" | "right";
  club: string;
  name: string;
  value: number;
}) {
  return (
    <div
      style={{
        alignItems: align === "left" ? "flex-start" : "flex-end",
        background: "rgba(15,23,42,.72)",
        border: `1px solid ${accent}55`,
        borderRadius: 34,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        padding: "38px 40px",
        textAlign: align,
      }}
    >
      <div
        style={{
          color: accent,
          display: "flex",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {club}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: name.length > 16 ? 48 : 58,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1.02,
          marginTop: 18,
        }}
      >
        {name}
      </div>
      <div
        style={{
          color: "#cbd5e1",
          display: "flex",
          fontSize: 23,
          marginTop: 28,
        }}
      >
        Estimated value&nbsp;
        <span style={{ color: "white", fontWeight: 800 }}>€{value}M</span>
      </div>
    </div>
  );
}
