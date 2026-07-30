"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PlayerPortrait from "@/components/PlayerPortrait";
import { players } from "@/data/players";

export default function MarketValueTable() {
  const [league, setLeague] = useState("All");
  const leagues = useMemo(
    () => [
      "All",
      ...Array.from(new Set(players.map((player) => player.league))).sort(),
    ],
    [],
  );

  const rankedPlayers = useMemo(
    () =>
      players
        .filter((player) => league === "All" || player.league === league)
        .sort(
          (a, b) =>
            b.marketValue - a.marketValue || a.name.localeCompare(b.name),
        ),
    [league],
  );

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {leagues.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLeague(item)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              item === league
                ? "border-green-400/40 bg-green-400/15 text-green-300"
                : "border-white/10 bg-white/[0.035] text-slate-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {item === "All" ? "All leagues" : item}
          </button>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
        <div className="hidden grid-cols-[70px_1fr_180px_140px_150px] border-b border-white/10 px-6 py-4 text-sm text-slate-500 md:grid">
          <span>Rank</span>
          <span>Player</span>
          <span>League</span>
          <span>Club</span>
          <span className="text-right">Estimated value</span>
        </div>

        {rankedPlayers.map((player, index) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="group grid gap-4 border-b border-white/10 px-5 py-5 transition last:border-b-0 hover:bg-white/5 md:grid-cols-[70px_1fr_180px_140px_150px] md:items-center md:px-6"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                index === 0
                  ? "bg-yellow-400 text-black"
                  : index === 1
                    ? "bg-slate-300 text-black"
                    : index === 2
                      ? "bg-amber-700 text-white"
                      : "bg-black/20 text-slate-400"
              }`}
            >
              {index + 1}
            </span>

            <div className="flex min-w-0 items-center gap-4">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-black/20">
                <PlayerPortrait
                  player={player}
                  sizes="64px"
                  className="object-contain p-1"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-bold transition group-hover:text-green-300">
                  {player.name}
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  {player.position} · Age {player.age}
                </span>
              </span>
            </div>

            <span className="text-sm font-semibold text-sky-300">
              {player.league}
            </span>
            <span className="text-sm text-slate-400">{player.club}</span>

            <span className="md:text-right">
              <span className="block text-xs text-slate-500 md:hidden">
                Estimated value
              </span>
              <span className="text-2xl font-black">
                €{player.marketValue}M
              </span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing {rankedPlayers.length} players · values are estimates, not
        confirmed transfer fees.
      </p>
    </>
  );
}
