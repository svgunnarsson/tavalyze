"use client";

import Link from "next/link";
import PlayerPortrait from "@/components/PlayerPortrait";
import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/hooks/useFavorites";
import { players } from "@/data/players";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { favoriteIds, syncing, toggleFavorite } = useFavorites();
  const favoritePlayers = favoriteIds
    .map((id) => players.find((player) => player.id === id))
    .filter((player) => player !== undefined);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
          Your shortlist
        </p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Favorite Players</h1>
        <p className="mt-3 max-w-2xl text-gray-400">
          {user
            ? `Your watchlist is saved to your Tavalyze account${syncing ? " and syncing now" : ""}.`
            : "Favorites are saved on this device. Log in to sync them everywhere."}
        </p>
        {!user && (
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500 hover:text-black"
          >
            Log in to sync favorites
          </Link>
        )}

        {favoritePlayers.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoritePlayers.map((player) => (
              <article
                key={player.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <Link href={`/players/${player.id}`} className="group block">
                  <div className="relative h-52 overflow-hidden rounded-2xl bg-black/20">
                    <PlayerPortrait
                      player={player}
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-contain p-3 transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h2 className="mt-5 text-xl font-bold transition group-hover:text-green-400">
                    {player.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    {player.position} · {player.club}
                  </p>
                  <p className="mt-5 text-3xl font-bold">€{player.marketValue}M</p>
                </Link>

                <button
                  type="button"
                  onClick={() => void toggleFavorite(player.id)}
                  disabled={syncing}
                  className="mt-5 w-full rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:border-red-400/40 hover:text-red-300"
                >
                  {syncing ? "Syncing…" : "Remove from favorites"}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
            <div className="text-5xl text-green-500" aria-hidden="true">
              ♡
            </div>
            <h2 className="mt-5 text-2xl font-bold">No favorites yet</h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-400">
              Open a player profile and select “Add to favorites” to create your
              shortlist.
            </p>
            <Link
              href="/players"
              className="mt-7 inline-flex rounded-xl bg-green-500 px-5 py-3 font-semibold text-black transition hover:bg-green-400"
            >
              Explore players
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
