import { NextRequest, NextResponse } from "next/server";
import { players } from "@/data/players";
import {
  ApiFootballError,
  getApiFootballPlayerSeason,
} from "@/lib/api-football";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("player")?.trim();

  if (!slug) {
    return NextResponse.json(
      { message: "A Tavalyze player slug is required." },
      { status: 400 },
    );
  }

  const player = players.find((item) => item.id === slug);

  if (!player) {
    return NextResponse.json({ message: "Player not found." }, { status: 404 });
  }

  if (!player.apiFootballId || !player.apiSeason) {
    return NextResponse.json(
      { message: "This player is not connected to API-Football." },
      { status: 404 },
    );
  }

  try {
    const result = await getApiFootballPlayerSeason(
      player.apiFootballId,
      player.apiSeason,
    );
    const profile = result.response[0];

    if (!profile) {
      return NextResponse.json(
        { message: "No verified season statistics were returned." },
        { status: 404 },
      );
    }

    const preferred =
      profile.statistics.find(
        (entry) => entry.league.name === player.league,
      ) ??
      [...profile.statistics].sort(
        (first, second) =>
          (second.games.appearences ?? 0) - (first.games.appearences ?? 0),
      )[0];

    if (!preferred) {
      return NextResponse.json(
        { message: "No verified season statistics were returned." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        playerId: player.id,
        season: player.apiSeason,
        source: "API-Football",
        team: preferred.team.name,
        league: preferred.league.name,
        appearances: preferred.games.appearences ?? 0,
        minutes: preferred.games.minutes ?? 0,
        goals: preferred.goals.total ?? 0,
        assists: preferred.goals.assists ?? 0,
        rating: preferred.games.rating
          ? Number.parseFloat(preferred.games.rating)
          : null,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof ApiFootballError
        ? error.message
        : "Unable to load verified player statistics.";

    return NextResponse.json({ message }, { status: 502 });
  }
}
