"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useCompareIds, clearCompare, MAX_COMPARE_ITEMS } from "@/data/local/compare-store";

// Floating bar mounted once in SiteShell — real state, not a fabricated
// counter: every id in it was added via a real CompareButton toggle.
export function CompareTray() {
  const ids = useCompareIds();
  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-space-md bg-surface shadow-2xl rounded-2xl px-5 py-3 border border-outline-variant/30">
      <div className="flex items-center gap-2 text-body-sm text-on-surface">
        <Icon name="compare_arrows" className="text-primary" />
        <span className="font-bold">
          {ids.length} bien{ids.length > 1 ? "s" : ""}
        </span>
        <span className="text-on-surface-variant hidden sm:inline">
          à comparer (max {MAX_COMPARE_ITEMS})
        </span>
      </div>
      <Link
        href="/comparer"
        className="bg-primary text-on-primary px-4 py-2 rounded-xl text-label-md font-bold hover:bg-forest-deep transition-all"
      >
        Comparer
      </Link>
      <button
        type="button"
        onClick={() => clearCompare()}
        aria-label="Vider le comparateur"
        className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <Icon name="close" />
      </button>
    </div>
  );
}
