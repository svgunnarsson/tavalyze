import {
  ApiFootballError,
  isApiFootballConfigured,
  searchApiFootballPlayers,
} from "@/lib/api-football";

export async function GET(request: Request) {
  if (!isApiFootballConfigured()) {
    return Response.json(
      { message: "API-Football is not configured." },
      { status: 503 },
    );
  }

  const query = new URL(request.url).searchParams.get("search") ?? "";

  try {
    const result = await searchApiFootballPlayers(query);

    return Response.json({
      count: result.results,
      players: result.response.slice(0, 10).map(({ player }) => ({
        id: player.id,
        name: player.name,
        age: player.age,
        nationality: player.nationality,
        height: player.height,
        weight: player.weight,
        position: player.position,
        photo: player.photo,
      })),
    });
  } catch (error) {
    const message =
      error instanceof ApiFootballError
        ? error.message
        : "Unable to search API-Football players.";

    return Response.json(
      { message },
      { status: error instanceof ApiFootballError && error.status === 429 ? 429 : 400 },
    );
  }
}
