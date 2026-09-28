import { createIdSetStore } from "@/lib/local-store/id-set-store";

// Storage key kept identical to the pre-existing favorites-provider so
// favorites saved before this refactor keep working. Only ever imported
// from Client Components (favorites-provider.tsx) — see data/local/favorite-id.ts
// for the plain id helpers that Server Components (property/land cards) use.
export const favoritesIdSetStore = createIdSetStore("favorites");
