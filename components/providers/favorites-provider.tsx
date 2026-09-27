"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "ogooue-habitat:favorites";
const EMPTY: string[] = [];

let cached: string[] | null = null;

function readFavorites(): string[] {
  if (typeof window === "undefined") return EMPTY;
  if (cached) return cached;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    cached = stored ? JSON.parse(stored) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached!;
}

function writeFavorites(ids: string[]) {
  cached = ids;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("ogooue-habitat:favorites-change"));
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  const handleExternalChange = () => {
    cached = null;
    callback();
  };
  window.addEventListener("storage", handleExternalChange);
  window.addEventListener("ogooue-habitat:favorites-change", callback);
  return () => {
    window.removeEventListener("storage", handleExternalChange);
    window.removeEventListener("ogooue-habitat:favorites-change", callback);
  };
}

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favoriteIds = useSyncExternalStore(subscribe, readFavorites, getServerSnapshot);

  const toggleFavorite = useCallback((id: string) => {
    const current = readFavorites();
    const next = current.includes(id)
      ? current.filter((existing) => existing !== id)
      : [...current, id];
    writeFavorites(next);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({ favoriteIds, isFavorite, toggleFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
