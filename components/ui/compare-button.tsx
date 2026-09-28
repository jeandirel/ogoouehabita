"use client";

import { useCompareIds, toggleCompare, MAX_COMPARE_ITEMS } from "@/data/local/compare-store";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

// Same visual language as FavoriteButton (components/ui/favorite-button.tsx),
// placed alongside it on every card — backed by the real useCompareIds() store.
export function CompareButton({
  compareId,
  className,
}: {
  compareId: string;
  className?: string;
}) {
  const ids = useCompareIds();
  const compared = ids.includes(compareId);
  const full = !compared && ids.length >= MAX_COMPARE_ITEMS;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleCompare(compareId);
      }}
      disabled={full}
      aria-pressed={compared}
      aria-label={compared ? "Retirer du comparateur" : "Ajouter au comparateur"}
      title={full ? `Comparateur plein (max ${MAX_COMPARE_ITEMS} biens)` : undefined}
      className={cn(
        "w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center hover:bg-surface transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed",
        compared ? "text-primary" : "text-on-surface",
        className,
      )}
    >
      <Icon name="compare_arrows" filled={compared} />
    </button>
  );
}
