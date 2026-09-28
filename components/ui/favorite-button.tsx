"use client";

import { useFavorites } from "@/components/providers/favorites-provider";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

// Shared heart-toggle affordance — same visual language everywhere a
// favorite can be saved (search results, property/land cards, villa
// detail header), all backed by the one real useFavorites() store.
export function FavoriteButton({
  favoriteId,
  className,
}: {
  favoriteId: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(favoriteId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(favoriteId);
      }}
      aria-pressed={favorite}
      aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={cn(
        "w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-surface transition-all shadow-md",
        className,
      )}
    >
      <Icon name="favorite" filled={favorite} className={favorite ? "text-laterite" : "text-on-surface"} />
    </button>
  );
}
