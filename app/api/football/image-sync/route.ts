import { players } from "@/data/players";
import {
  ApiFootballError,
  getApiFootballSquad,
  searchApiFootballTeams,
} from "@/lib/api-football";

export const dynamic = "force-dynamic";

const teamSearchNames: Record<string, string> = {
  "Newcastle United": "Newcastle",
  "Nottingham Forest": "Nottingham Forest",
  "Manchester United": "Manchester United",
  "Manchester City": "Manchester City",
  "Atlético de Madrid": "Atletico Madrid",
  "Bayern Munich": "Bayern Munich",
  "RB Leipzig": "RB Leipzig",
  "Borussia Dortmund": "Borussia Dortmund",
  "SC Freiburg": "SC Freiburg",
  "Eintracht Frankfurt": "Eintracht Frankfurt",
  "1. FC Köln": "FC Koln",
  "VfB Stuttgart": "VfB Stuttgart",
  "Inter Milan": "Inter",
  "AC Milan": "AC Milan",
  "AS Roma": "AS Roma",
  "Paris Saint-Germain": "Paris Saint Germain",
};

const teamAliases: Record<string, string[]> = {
  "Atletico Madrid": ["Atletico Madrid", "Atletico Madrid W"],
  "Bayern Munich": ["Bayern Munich", "Bayern München"],
  "FC Koln": ["FC Koln", "FC Köln"],
  Inter: ["Inter", "Inter Milan"],
  "Paris Saint Germain": ["Paris Saint Germain", "Paris Saint-Germain"],
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function chooseTeam(searchName: string, names: Array<{ id: number; name: string }>) {
  const accepted = (teamAliases[searchName] ?? [searchName]).map(normalize);
  return (
    names.find((team) => accepted.includes(normalize(team.name))) ??
    names.find((team) =>
      accepted.some((alias) => normalize(team.name).includes(alias)),
    )
  );
}

function playerMatchScore(tavalyzeName: string, apiName: string) {
  const expected = normalize(tavalyzeName);
  const candidate = normalize(apiName);

  if (expected === candidate) return 100;

  const expectedParts = expected.split(" ");
  const candidateParts = candidate.split(" ");
  const expectedLast = expectedParts.at(-1);
  const candidateLast = candidateParts.at(-1);

  if (!expectedLast || expectedLast !== candidateLast) return 0;

  if (expectedParts.length === 1) return 80;

  const expectedInitial = expectedParts[0]?.[0];
  const candidateInitial = candidateParts[0]?.[0];
  return expectedInitial && expectedInitial === candidateInitial ? 70 : 40;
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!process.env.TAVALYZE_SYNC_TOKEN || token !== process.env.TAVALYZE_SYNC_TOKEN) {
    return new Response("Not found", { status: 404 });
  }

  const missingPlayers = players.filter((player) => !player.image);
  const clubs = [...new Set(missingPlayers.map((player) => player.club))];
  const matches: Array<{
    id: string;
    name: string;
    club: string;
    apiFootballId: number;
    apiName: string;
    image: string;
    score: number;
  }> = [];
  const unmatched: Array<{
    id: string;
    name: string;
    club: string;
    candidates?: string[];
    reason: string;
  }> = [];

  try {
    for (const club of clubs) {
      try {
        const searchName = teamSearchNames[club] ?? club;
        const teamResult = await searchApiFootballTeams(searchName);
        const team = chooseTeam(
          searchName,
          teamResult.response.map(({ team }) => ({ id: team.id, name: team.name })),
        );

        if (!team) {
          missingPlayers
            .filter((player) => player.club === club)
            .forEach((player) =>
              unmatched.push({
                id: player.id,
                name: player.name,
                club,
                reason: "Team not found",
              }),
            );
          continue;
        }

        const squadResult = await getApiFootballSquad(team.id);
        const squad = squadResult.response[0]?.players ?? [];

        for (const player of missingPlayers.filter((item) => item.club === club)) {
          const ranked = squad
            .map((candidate) => ({
              candidate,
              score: playerMatchScore(player.name, candidate.name),
            }))
            .filter((item) => item.score > 0)
            .sort((first, second) => second.score - first.score);
          const best = ranked[0];
          const ambiguous = best && ranked[1]?.score === best.score;

          if (!best || best.score < 70 || ambiguous) {
            unmatched.push({
              id: player.id,
              name: player.name,
              club,
              candidates: ranked.slice(0, 5).map(({ candidate }) => candidate.name),
              reason: ambiguous ? "Ambiguous player match" : "Player not found",
            });
            continue;
          }

          matches.push({
            id: player.id,
            name: player.name,
            club,
            apiFootballId: best.candidate.id,
            apiName: best.candidate.name,
            image: best.candidate.photo,
            score: best.score,
          });
        }
      } catch (error) {
        const reason =
          error instanceof ApiFootballError
            ? error.message
            : "Unable to load this club squad";

        missingPlayers
          .filter((player) => player.club === club)
          .forEach((player) =>
            unmatched.push({
              id: player.id,
              name: player.name,
              club,
              reason,
            }),
          );

        if (error instanceof ApiFootballError && error.status === 429) break;
      }
    }

    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Tavalyze image sync</title><pre>${escapeHtml(
        JSON.stringify({ matches, unmatched }, null, 2),
      )}</pre>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  } catch (error) {
    const message =
      error instanceof ApiFootballError
        ? error.message
        : "Unable to build the image catalogue.";
    return new Response(message, { status: 502 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
import { players } from "@/data/players";
import {
  ApiFootballError,
  getApiFootballSquad,
  searchApiFootballTeams,
} from "@/lib/api-football";

export const dynamic = "force-dynamic";

const teamSearchNames: Record<string, string> = {
  "Newcastle United": "Newcastle",
  "Nottingham Forest": "Nottingham Forest",
  "Manchester United": "Manchester United",
  "Manchester City": "Manchester City",
  "Atlético de Madrid": "Atletico Madrid",
  "Bayern Munich": "Bayern Munich",
  "RB Leipzig": "RB Leipzig",
  "Borussia Dortmund": "Borussia Dortmund",
  "SC Freiburg": "SC Freiburg",
  "Eintracht Frankfurt": "Eintracht Frankfurt",
  "1. FC Köln": "FC Koln",
  "VfB Stuttgart": "VfB Stuttgart",
  "Inter Milan": "Inter",
  "AC Milan": "AC Milan",
  "AS Roma": "AS Roma",
  "Paris Saint-Germain": "Paris Saint Germain",
};

const teamAliases: Record<string, string[]> = {
  "Atletico Madrid": ["Atletico Madrid", "Atletico Madrid W"],
  "Bayern Munich": ["Bayern Munich", "Bayern München"],
  "FC Koln": ["FC Koln", "FC Köln"],
  Inter: ["Inter", "Inter Milan"],
  "Paris Saint Germain": ["Paris Saint Germain", "Paris Saint-Germain"],
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function chooseTeam(searchName: string, names: Array<{ id: number; name: string }>) {
  const accepted = (teamAliases[searchName] ?? [searchName]).map(normalize);
  return (
    names.find((team) => accepted.includes(normalize(team.name))) ??
    names.find((team) =>
      accepted.some((alias) => normalize(team.name).includes(alias)),
    )
  );
}

function playerMatchScore(tavalyzeName: string, apiName: string) {
  const expected = normalize(tavalyzeName);
  const candidate = normalize(apiName);

  if (expected === candidate) return 100;

  const expectedParts = expected.split(" ");
  const candidateParts = candidate.split(" ");
  const expectedLast = expectedParts.at(-1);
  const candidateLast = candidateParts.at(-1);

  if (!expectedLast || expectedLast !== candidateLast) return 0;

  if (expectedParts.length === 1) return 80;

  const expectedInitial = expectedParts[0]?.[0];
  const candidateInitial = candidateParts[0]?.[0];
  return expectedInitial && expectedInitial === candidateInitial ? 70 : 40;
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!process.env.TAVALYZE_SYNC_TOKEN || token !== process.env.TAVALYZE_SYNC_TOKEN) {
    return new Response("Not found", { status: 404 });
  }

  const missingPlayers = players.filter((player) => !player.image);
  const clubs = [...new Set(missingPlayers.map((player) => player.club))];
  const matches: Array<{
    id: string;
    name: string;
    club: string;
    apiFootballId: number;
    apiName: string;
    image: string;
    score: number;
  }> = [];
  const unmatched: Array<{
    id: string;
    name: string;
    club: string;
    candidates?: string[];
    reason: string;
  }> = [];

  try {
    for (const club of clubs) {
      const searchName = teamSearchNames[club] ?? club;
      const teamResult = await searchApiFootballTeams(searchName);
      const team = chooseTeam(
        searchName,
        teamResult.response.map(({ team }) => ({ id: team.id, name: team.name })),
      );

      if (!team) {
        missingPlayers
          .filter((player) => player.club === club)
          .forEach((player) =>
            unmatched.push({
              id: player.id,
              name: player.name,
              club,
              reason: "Team not found",
            }),
          );
        continue;
      }

      const squadResult = await getApiFootballSquad(team.id);
      const squad = squadResult.response[0]?.players ?? [];

      for (const player of missingPlayers.filter((item) => item.club === club)) {
        const ranked = squad
          .map((candidate) => ({
            candidate,
            score: playerMatchScore(player.name, candidate.name),
          }))
          .filter((item) => item.score > 0)
          .sort((first, second) => second.score - first.score);
        const best = ranked[0];
        const ambiguous = best && ranked[1]?.score === best.score;

        if (!best || best.score < 70 || ambiguous) {
          unmatched.push({
            id: player.id,
            name: player.name,
            club,
            candidates: ranked.slice(0, 5).map(({ candidate }) => candidate.name),
            reason: ambiguous ? "Ambiguous player match" : "Player not found",
          });
          continue;
        }

        matches.push({
          id: player.id,
          name: player.name,
          club,
          apiFootballId: best.candidate.id,
          apiName: best.candidate.name,
          image: best.candidate.photo,
          score: best.score,
        });
      }
    }

    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Tavalyze image sync</title><pre>${escapeHtml(
        JSON.stringify({ matches, unmatched }, null, 2),
      )}</pre>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  } catch (error) {
    const message =
      error instanceof ApiFootballError
        ? error.message
        : "Unable to build the image catalogue.";
    return new Response(message, { status: 502 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
