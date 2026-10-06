import { createRecordStore } from "@/lib/local-store/record-store";
import { getDeviceOwnerId } from "@/lib/local-store/session";
import type { LocalRecordBase } from "@/lib/types";

/**
 * Enregistrement d'une recherche sauvegardée (côté utilisateur, localStorage).
 *
 * Structure pensée pour une évolution backend : les champs id / createdAt /
 * ownerId sont déjà présents et correspondent aux colonnes qu'une table
 * Supabase ferait demain (saved_searches). Pour l'instant, tout reste local
 * et anonyme (device-owner), sans migration DB.
 */
export interface SavedSearch extends LocalRecordBase {
  title: string;
  transactionType: "vente" | "location";
  filters: Record<string, unknown>;
  notificationsEnabled?: boolean;
}

const savedSearchesStore = createRecordStore<SavedSearch>("saved-searches");

export function useSavedSearches(): SavedSearch[] {
  return savedSearchesStore.useAll();
}

export function getSavedSearches(): SavedSearch[] {
  return savedSearchesStore.getAll();
}

export function insertSavedSearch(title: string, transactionType: "vente" | "location", filters: Record<string, unknown>): SavedSearch {
  return savedSearchesStore.insert({
    title,
    transactionType,
    filters,
    notificationsEnabled: false,
    ownerId: getDeviceOwnerId(),
  });
}

export function removeSavedSearch(id: string): void {
  savedSearchesStore.remove(id);
}