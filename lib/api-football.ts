import "server-only";

const API_BASE_URL = "https://v3.football.api-sports.io";

type ApiFootballEnvelope<T> = {
  get: string;
  parameters: Record<string, string> | Array<never>;
  errors: Record<string, string> | Array<never>;
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
};

export type ApiFootballStatus = {
  account: {
    firstname: string;
    lastname: string;
    email: string;
  };
  subscription: {
    plan: string;
    end: string;
    active: boolean;
  };
  requests: {
    current: number;
    limit_day: number;
  };
};

export type ApiFootballPlayerProfile = {
  player: {
    id: number;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    birth: {
      date: string | null;
      place: string | null;
      country: string | null;
    };
    nationality: string | null;
    height: string | null;
    weight: string | null;
    number: number | null;
    position: string | null;
    photo: string;
  };
};

export type ApiFootballPlayerSeason = {
  player: ApiFootballPlayerProfile["player"];
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
    };
    league: {
      id: number;
      name: string;
      country: string | null;
      logo: string;
      flag: string | null;
      season: number;
    };
    games: {
      appearences: number | null;
      lineups: number | null;
      minutes: number | null;
      position: string | null;
      rating: string | null;
    };
    goals: {
      total: number | null;
      assists: number | null;
    };
  }>;
};

export class ApiFootballError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiFootballError";
  }
}

export function isApiFootballConfigured() {
  return Boolean(process.env.API_FOOTBALL_KEY);
}

async function apiFootballRequest<T>(
  endpoint: string,
  parameters: Record<string, string | number> = {},
  revalidate = 3600,
) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new ApiFootballError(
      "API-Football is not configured. Add API_FOOTBALL_KEY to .env.local.",
    );
  }

  const url = new URL(endpoint, API_BASE_URL);
  Object.entries(parameters).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey,
    },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new ApiFootballError(
      `API-Football request failed with status ${response.status}.`,
      response.status,
    );
  }

  const payload = (await response.json()) as ApiFootballEnvelope<T>;
  const apiErrors = Array.isArray(payload.errors)
    ? []
    : Object.values(payload.errors);

  if (apiErrors.length > 0) {
    throw new ApiFootballError(apiErrors.join(" "));
  }

  return payload;
}

export async function getApiFootballStatus() {
  return apiFootballRequest<ApiFootballStatus>("/status", {}, 0);
}

export async function searchApiFootballPlayers(search: string) {
  const cleanSearch = search.trim();

  if (cleanSearch.length < 3 || cleanSearch.length > 50) {
    throw new ApiFootballError("Player search must contain 3–50 characters.");
  }

  return apiFootballRequest<ApiFootballPlayerProfile[]>(
    "/players/profiles",
    { search: cleanSearch },
    86_400,
  );
}

export async function getApiFootballPlayerSeason(
  playerId: number,
  season: number,
) {
  return apiFootballRequest<ApiFootballPlayerSeason[]>(
    "/players",
    { id: playerId, season },
    86_400,
  );
}
