"use client";

import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteButton({
  playerId,
  playerName,
}: {
  playerId: string;
  playerName: string;
}) {
  const { favoriteIds, syncing, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(playerId);

  return (
    <button
      type="button"
      onClick={() => void toggleFavorite(playerId)}
      disabled={syncing}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove ${playerName} from favorites`
          : `Add ${playerName} to favorites`
      }
      className={`mt-5 inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
        isFavorite
          ? "border-green-500/40 bg-green-500/15 text-green-400"
          : "border-white/10 bg-white/5 text-gray-300 hover:border-green-500/40 hover:text-white"
      }`}
    >
      <span aria-hidden="true" className="text-xl">
        {isFavorite ? "♥" : "♡"}
      </span>
      {syncing ? "Syncing…" : isFavorite ? "Saved to favorites" : "Add to favorites"}
    </button>
  );
}
