"use client";

import { useMemo, useSyncExternalStore } from "react";

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

export function useFavoritePlayerIds() {
  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => {
    try {
      const parsedValue: unknown = JSON.parse(storedValue);
      return Array.isArray(parsedValue)
        ? parsedValue.filter((value): value is string => typeof value === "string")
        : [];
    } catch {
      return [];
    }
  }, [storedValue]);
}

export function toggleFavoritePlayer(playerId: string) {
  const currentValue = getSnapshot();
  let currentIds: string[] = [];

  try {
    const parsedValue: unknown = JSON.parse(currentValue);
    currentIds = Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    currentIds = [];
  }

  const nextIds = currentIds.includes(playerId)
    ? currentIds.filter((id) => id !== playerId)
    : [...currentIds, playerId];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
