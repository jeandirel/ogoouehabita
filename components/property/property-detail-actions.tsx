"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useFavorites } from "@/components/providers/favorites-provider";
import { toFavoriteId } from "@/data/local/favorite-id";
import type { Property } from "@/lib/types";

export function PropertyDetailActions({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteId = toFavoriteId("property", property.slug);
  const favorite = isFavorite(favoriteId);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: property.location,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the native share sheet — not an error.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // Clipboard API unavailable — nothing else honest to fall back to.
    }
  };

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => toggleFavorite(favoriteId)}
        aria-pressed={favorite}
        className="flex items-center gap-2 rounded-xl border border-outline-variant/70 bg-surface px-3 py-2.5 font-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
      >
        <Icon name="favorite" filled={favorite} className={favorite ? "text-laterite" : undefined} />
        {favorite ? "Sauvegardé" : "Sauvegarder"}
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 rounded-xl border border-outline-variant/70 bg-surface px-3 py-2.5 font-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
      >
        <Icon name="share" />
        Partager
      </button>
      {linkCopied && (
        <span className="absolute top-full right-0 mt-2 bg-primary text-on-primary text-label-sm px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap">
          Lien copié
        </span>
      )}
    </div>
  );
}
