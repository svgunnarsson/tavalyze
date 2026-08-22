"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "tavalyze-favorite-players";
const CHANGE_EVENT = "tavalyze-favorites-changed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parseIds(value: string) {
  try {
    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function storeIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useFavorites() {
  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const favoriteIds = useMemo(() => parseIds(storedValue), [storedValue]);
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!user || !supabase) return;

    let active = true;

    async function syncFavorites() {
      const { data, error } = await supabase!
        .from("favorite_players")
        .select("player_id")
        .eq("user_id", user!.id);

      if (!active) return;
      if (error) {
        setSyncing(false);
        return;
      }

      const remoteIds = (data ?? []).map((row) => row.player_id as string);
      const localIds = parseIds(getSnapshot());
      const mergedIds = Array.from(new Set([...remoteIds, ...localIds]));
      const missingRemoteIds = localIds.filter((id) => !remoteIds.includes(id));

      if (missingRemoteIds.length > 0) {
        await supabase!.from("favorite_players").upsert(
          missingRemoteIds.map((playerId) => ({
            user_id: user!.id,
            player_id: playerId,
          })),
          { onConflict: "user_id,player_id" },
        );
      }

      if (active) {
        storeIds(mergedIds);
        setSyncing(false);
      }
    }

    void syncFavorites();
    return () => {
      active = false;
    };
  }, [supabase, user]);

  const toggleFavorite = useCallback(
    async (playerId: string) => {
      const isFavorite = favoriteIds.includes(playerId);
      const nextIds = isFavorite
        ? favoriteIds.filter((id) => id !== playerId)
        : [...favoriteIds, playerId];
      storeIds(nextIds);

      if (!user || !supabase) return;
      setSyncing(true);

      if (isFavorite) {
        await supabase
          .from("favorite_players")
          .delete()
          .eq("user_id", user.id)
          .eq("player_id", playerId);
      } else {
        await supabase.from("favorite_players").upsert(
          { user_id: user.id, player_id: playerId },
          { onConflict: "user_id,player_id" },
        );
      }

      setSyncing(false);
    },
    [favoriteIds, supabase, user],
  );

  return { favoriteIds, syncing, toggleFavorite };
}

export function useFavoritePlayerIds() {
  return useFavorites().favoriteIds;
}
