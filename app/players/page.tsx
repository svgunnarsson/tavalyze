"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PlayerPortrait from "@/components/PlayerPortrait";
import { players } from "@/data/players";

type SortOption = "market-high" | "market-low" | "name" | "age-young";
type DataFilter = "all" | "connected" | "sourced" | "demo";

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("All");
  const [selectedClub, setSelectedClub] = useState("All");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("market-high");
  const [dataFilter, setDataFilter] = useState<DataFilter>("all");

  const connectedPlayerCount = players.filter(
    (player) => player.apiFootballId,
  ).length;

  const clubs = useMemo(
    () => ["All", ...Array.from(new Set(players.map((player) => player.club))).sort()],
    []
  );

  const leagues = useMemo(
    () => [
      "All",
      ...Array.from(new Set(players.map((player) => player.league))).sort(),
    ],
    [],
  );

  const positions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(players.map((player) => player.position))).sort(),
    ],
    []
  );

  const filteredPlayers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    const result = players.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchText) ||
        player.club.toLowerCase().includes(searchText) ||
        player.nationality.toLowerCase().includes(searchText) ||
        player.position.toLowerCase().includes(searchText);

      const matchesClub =
        selectedClub === "All" || player.club === selectedClub;

      const matchesLeague =
        selectedLeague === "All" || player.league === selectedLeague;

      const matchesPosition =
        selectedPosition === "All" || player.position === selectedPosition;

      const matchesData =
        dataFilter === "all" ||
        (dataFilter === "connected" && Boolean(player.apiFootballId)) ||
        (dataFilter === "sourced" &&
          !player.apiFootballId &&
          (player.dataStatus?.club === "sourced" ||
            player.dataStatus?.club === "verified" ||
            player.dataStatus?.marketValue === "sourced")) ||
        (dataFilter === "demo" &&
          !player.apiFootballId &&
          !player.dataStatus?.club &&
          !player.dataStatus?.marketValue);

      return (
        matchesSearch &&
        matchesLeague &&
        matchesClub &&
        matchesPosition &&
        matchesData
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "market-high") {
        return b.marketValue - a.marketValue;
      }

      if (sortBy === "market-low") {
        return a.marketValue - b.marketValue;
      }

      if (sortBy === "age-young") {
        return a.age - b.age;
      }

      return a.name.localeCompare(b.name);
    });
  }, [
    search,
    selectedLeague,
    selectedClub,
    selectedPosition,
    sortBy,
    dataFilter,
  ]);

  function clearFilters() {
    setSearch("");
    setSelectedLeague("All");
    setSelectedClub("All");
    setSelectedPosition("All");
    setSortBy("market-high");
    setDataFilter("all");
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
              Five-league intelligence
            </p>

            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
              Player Database
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Search, filter and sort all {players.length} players included in
              Tavalyze V1.
            </p>
            <p className="mt-3 text-sm text-sky-300">
              {connectedPlayerCount} profiles connected to API-Football
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Showing {filteredPlayers.length} of {players.length}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search player, club or country..."
              className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-green-500/50"
            />

            <select
              value={selectedLeague}
              onChange={(event) => {
                setSelectedLeague(event.target.value);
                setSelectedClub("All");
              }}
              className="rounded-2xl border border-white/10 bg-[#111c2d] px-5 py-4 text-white outline-none focus:border-green-500/50"
            >
              {leagues.map((league) => (
                <option key={league} value={league}>
                  {league === "All" ? "All leagues" : league}
                </option>
              ))}
            </select>

            <select
              value={selectedClub}
              onChange={(event) => setSelectedClub(event.target.value)}
              className="rounded-2xl border border-white/10 bg-[#111c2d] px-5 py-4 text-white outline-none focus:border-green-500/50"
            >
              {clubs
                .filter(
                  (club) =>
                    club === "All" ||
                    selectedLeague === "All" ||
                    players.some(
                      (player) =>
                        player.club === club &&
                        player.league === selectedLeague,
                    ),
                )
                .map((club) => (
                <option key={club} value={club}>
                  {club === "All" ? "All clubs" : club}
                </option>
                ))}
            </select>

            <select
              value={selectedPosition}
              onChange={(event) => setSelectedPosition(event.target.value)}
              className="rounded-2xl border border-white/10 bg-[#111c2d] px-5 py-4 text-white outline-none focus:border-green-500/50"
            >
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position === "All" ? "All positions" : position}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="rounded-2xl border border-white/10 bg-[#111c2d] px-5 py-4 text-white outline-none focus:border-green-500/50"
            >
              <option value="market-high">Highest market value</option>
              <option value="market-low">Lowest market value</option>
              <option value="age-young">Youngest first</option>
              <option value="name">Name A–Z</option>
            </select>

            <select
              value={dataFilter}
              onChange={(event) =>
                setDataFilter(event.target.value as DataFilter)
              }
              className="rounded-2xl border border-white/10 bg-[#111c2d] px-5 py-4 text-white outline-none focus:border-sky-400/50"
            >
              <option value="all">All data sources</option>
              <option value="connected">API connected</option>
              <option value="sourced">Sourced snapshot</option>
              <option value="demo">Prototype only</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl px-4 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Clear filters
            </button>
          </div>
        </div>

        {filteredPlayers.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {filteredPlayers.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10"
              >
                <div className="relative h-44 overflow-hidden rounded-2xl bg-black/20">
                  <PlayerPortrait
                    player={player}
                    sizes="(max-width: 640px) 100vw, 260px"
                    className="object-contain p-3 transition duration-300 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${
                      player.apiFootballId
                        ? "border-sky-400/30 bg-sky-400/15 text-sky-200"
                        : player.dataStatus?.marketValue === "sourced"
                          ? "border-green-400/30 bg-green-400/15 text-green-200"
                          : "border-amber-400/30 bg-amber-400/15 text-amber-200"
                    }`}
                  >
                    {player.apiFootballId
                      ? "API connected"
                      : player.dataStatus?.marketValue === "sourced"
                        ? "Sourced snapshot"
                        : "Prototype data"}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-bold">{player.name}</h2>

                <p className="mt-1 text-sm text-gray-400">
                  {player.position} · {player.club}
                </p>

                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Market Value</p>
                    <p className="mt-1 text-2xl font-bold">
                      €{player.marketValue}M
                    </p>
                  </div>

                  <span className="text-sm text-gray-500 transition group-hover:text-green-400">
                    View →
                  </span>
                </div>

                <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-sm text-gray-500">
                  <span>Age {player.age}</span>
                  <span>{player.nationality}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
            <h2 className="text-2xl font-bold">No players found</h2>

            <p className="mt-2 text-gray-400">
              Try another search or clear your filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-green-500 px-5 py-3 font-semibold text-black transition hover:bg-green-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
