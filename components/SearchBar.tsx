"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { players } from "@/data/players";

type SearchBarProps = {
  compact?: boolean;
  className?: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchBar({
  compact = false,
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const searchTerm = normalize(query);

    if (!searchTerm) {
      return [];
    }

    return players
      .filter((player) =>
        normalize(
          `${player.name} ${player.club} ${player.nationality} ${player.position}`,
        ).includes(searchTerm),
      )
      .sort((a, b) => {
        const aStartsWith = normalize(a.name).startsWith(searchTerm);
        const bStartsWith = normalize(b.name).startsWith(searchTerm);

        if (aStartsWith !== bStartsWith) {
          return aStartsWith ? -1 : 1;
        }

        return b.marketValue - a.marketValue;
      })
      .slice(0, 5);
  }, [query]);

  function openPlayer(playerId: string) {
    setIsOpen(false);
    setQuery("");
    router.push(`/players/${playerId}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (results.length > 0) {
      openPlayer(results[Math.min(activeIndex, results.length - 1)].id);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current === 0 ? results.length - 1 : current - 1,
      );
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className={`flex border border-white/10 bg-white/5 p-2 transition focus-within:border-green-500/50 focus-within:bg-white/[0.07] ${
          compact ? "rounded-xl" : "rounded-2xl"
        }`}
      >
        <label htmlFor={compact ? "navbar-player-search" : "player-search"} className="sr-only">
          Search players
        </label>
        <input
          id={compact ? "navbar-player-search" : "player-search"}
          type="search"
          role="combobox"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? "Search players..." : "Search Haaland, Palmer, Saka..."}
          aria-autocomplete="list"
          aria-expanded={isOpen && query.length > 0}
          aria-controls="player-search-results"
          className={`min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-gray-500 ${
            compact ? "px-3 text-sm" : "px-4"
          }`}
        />

        <button
          type="submit"
          disabled={results.length === 0}
          className={`shrink-0 bg-green-500 font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50 ${
            compact ? "rounded-lg px-3 py-2 text-sm" : "rounded-xl px-6 py-3"
          }`}
        >
          Search
        </button>
      </form>

      {isOpen && query.trim() && (
        <div
          id="player-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-[60] overflow-hidden rounded-2xl border border-white/10 bg-[#0c1726] p-2 shadow-2xl shadow-black/40"
        >
          {results.length > 0 ? (
            results.map((player, index) => (
              <button
                key={player.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openPlayer(player.id)}
                className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                  index === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-black/20">
                  <Image
                    src={player.image}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-contain p-1"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-white">
                    {player.name}
                  </span>
                  <span className="block truncate text-xs text-gray-400">
                    {player.position} · {player.club}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-green-400">
                  €{player.marketValue}M
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-5 text-center text-sm text-gray-400">
              No players found for “{query.trim()}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
