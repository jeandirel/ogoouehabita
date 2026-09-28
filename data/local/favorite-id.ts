// Pure id helpers with no React/browser dependency, so they can be
// imported from Server Components (property/land cards) without pulling
// the useSyncExternalStore-based store into the server bundle. Keep the
// reactive store itself (data/local/favorites-store.ts) separate.
export type FavoriteKind = "property" | "land";

export function toFavoriteId(kind: FavoriteKind, slug: string): string {
  return `${kind}:${slug}`;
}

export function parseFavoriteId(id: string): { kind: FavoriteKind; slug: string } | null {
  const separatorIndex = id.indexOf(":");
  if (separatorIndex === -1) return null;
  const kind = id.slice(0, separatorIndex);
  const slug = id.slice(separatorIndex + 1);
  if (kind !== "property" && kind !== "land") return null;
  return { kind, slug };
}
