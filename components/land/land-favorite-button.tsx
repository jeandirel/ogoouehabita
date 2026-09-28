"use client";

import { Icon } from "@/components/ui/icon";
import { useFavorites } from "@/components/providers/favorites-provider";
import { toFavoriteId } from "@/data/local/favorite-id";
import type { Land } from "@/lib/types";

export function LandFavoriteButton({ land }: { land: Land }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteId = toFavoriteId("land", land.slug);
  const favorite = isFavorite(favoriteId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(favoriteId)}
      aria-pressed={favorite}
      className="border border-outline-variant text-on-surface py-3 rounded-xl font-label-md text-center hover:bg-surface transition-all flex items-center justify-center gap-2"
    >
      <Icon name="favorite" filled={favorite} className={favorite ? "text-laterite" : undefined} />
      {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
}
