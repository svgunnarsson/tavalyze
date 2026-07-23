"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type LivePlayer = {
  id: number;
  name: string;
  age: number | null;
  nationality: string | null;
  height: string | null;
  weight: string | null;
  position: string | null;
  photo: string;
};

type SearchResponse = {
  count?: number;
  players?: LivePlayer[];
  message?: string;
};

export default function ApiFootballPlayerSearch() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();

    if (search.length < 3) {
      setMessage("Enter at least 3 characters.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setPlayers([]);

    try {
      const response = await fetch(
        `/api/football/players?search=${encodeURIComponent(search)}`,
      );
      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Player search failed.");
      }

      const results = data.players ?? [];
      setPlayers(results);
      setMessage(
        results.length === 0
          ? `No API-Football profiles found for “${search}”.`
          : `${results.length} live profile${results.length === 1 ? "" : "s"} found.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Player search failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: Erling Haaland"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-5 py-3 text-white outline-none placeholder:text-gray-500 focus:border-sky-400/60"
        />
        <button
          type="submit"
          disabled={isLoading || query.trim().length < 3}
          className="rounded-xl bg-sky-400 px-6 py-3 font-semibold text-[#07111f] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Searching…" : "Search live data"}
        </button>
      </form>

      <p className="mt-3 text-sm text-gray-500">
        One submitted search may use one of the 100 daily API requests.
      </p>

      {message && (
        <p aria-live="polite" className="mt-5 text-sm text-gray-300">
          {message}
        </p>
      )}

      {players.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {players.map((player) => (
            <article
              key={player.id}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                <Image
                  src={player.photo}
                  alt={player.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold">{player.name}</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {[player.position, player.nationality].filter(Boolean).join(" · ") || "Profile data unavailable"}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {[player.age ? `Age ${player.age}` : null, player.height, player.weight]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
