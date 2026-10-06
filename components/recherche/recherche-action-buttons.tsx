"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useSavedSearches, insertSavedSearch } from "@/data/local/saved-searches-store";
import type { PropertySort } from "@/components/search/sort-select";

export interface RechercheActionButtonsProps {
  transactionType: "vente" | "location";
  activeFilters: Record<string, string | string[]>;
  /** URL to navigate to when clearing filters. */
  clearUrl?: string;
  onSort?: (sort: PropertySort) => void;
  currentSort: string;
  showMap: boolean;
}

function buildSavedSearchTitle(transactionType: string, activeFilters: Record<string, string | string[]>): string {
  const chips: string[] = [];
  if (activeFilters.ville) chips.push(String(activeFilters.ville));
  if (activeFilters.quartier) chips.push(String(activeFilters.quartier));
  if (activeFilters.province) chips.push(String(activeFilters.province));
  if (activeFilters.type && Array.isArray(activeFilters.type)) {
    chips.push((activeFilters.type as string[]).join(" "));
  }
  if (activeFilters.budgetMax) {
    const parts = String(activeFilters.budgetMax).split(" ");
    chips.push(`≤ ${parts[parts.length - 1]}`);
  }
  const label = chips.length ? chips.join(" ") : "";
  const trans = transactionType === "vente" ? "achat" : "location";
  return label ? `Annonce ${trans} ${label}` : `Recherche ${trans}`;
}

function InlineToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-on-primary shadow-sm">
      <Icon name="check_circle" className="text-[20px]" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto rounded-full p-1 hover:bg-primary-fixed"
        aria-label="Fermer la notification"
      >
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
}


export function RechercheActionButtons({
  transactionType,
  activeFilters,
  onSort,
  currentSort,
  showMap,
}: RechercheActionButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const savedSearches = useSavedSearches();

  const [savedFormOpen, setSavedFormOpen] = useState(false);
  const [alertFormOpen, setAlertFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [savedTitle, setSavedTitle] = useState("");

  const savedCount = savedSearches.length;

  const handleSaveSearch = () => {
    if (savedFormOpen) {
      const title = savedTitle.trim() || buildSavedSearchTitle(transactionType, activeFilters);
      insertSavedSearch(title, transactionType, activeFilters);
      setSavedFormOpen(false);
      setToast(`Recherche sauvegardée : « ${title} »`);
      setSavedTitle("");
      setTimeout(() => setToast(null), 4000);
      return;
    }
    setSavedFormOpen(true);
    setSavedTitle(buildSavedSearchTitle(transactionType, activeFilters));
  };

  const handleCreateAlert = () => {
    if (alertFormOpen) {
      setAlertFormOpen(false);
      setToast("Alerte enregistrée localement — aucune notification n&apos;a été envoyée.");
      setTimeout(() => setToast(null), 4000);
      return;
    }
    setAlertFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-2">
      {toast && <InlineToast message={toast} onClose={() => setToast(null)} />}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSaveSearch}
          className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3.5 py-2 text-label-md font-medium text-on-surface hover:bg-surface-container transition-all"
          aria-pressed={savedFormOpen}
          aria-expanded={savedFormOpen}
        >
          <Icon name="bookmark_add" className={savedFormOpen ? "text-primary" : "text-secondary"} />
          <span>Sauvegarder la recherche{savedCount > 0 ? ` (${savedCount})` : ""}</span>
        </button>
        <button
          type="button"
          onClick={handleCreateAlert}
          className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-label-md font-bold text-on-primary shadow-sm transition-all hover:bg-forest-deep"
          aria-expanded={alertFormOpen}
        >
          <Icon name="notifications_active" />
          <span>Créer une alerte</span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          const next = new URLSearchParams(searchParams.toString());
          for (const key of next.keys()) {
            if (key !== "vue" && key !== "sort") next.delete(key);
          }
          router.push(next.toString() ? `/recherche?${next.toString()}` : "/recherche");
        }}
        className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface px-3.5 py-2 text-label-md font-medium text-on-surface hover:bg-surface-container transition-all"
      >
        <Icon name="filter_alt" className="text-secondary" />
        <span>Effacer les filtres</span>
      </button>


      {savedFormOpen && (
        <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={savedTitle}
              onChange={(e) => setSavedTitle(e.target.value)}
              placeholder="Ex: Villa à Akanda"
              className="flex-1 rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-label-md text-on-surface outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleSaveSearch}
              className="rounded-lg bg-primary px-3.5 py-1.5 text-label-sm font-bold text-on-primary transition-all hover:bg-forest-deep"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setSavedFormOpen(false);
                setToast(null);
              }}
              className="rounded-lg px-3.5 py-1.5 text-label-sm font-medium text-on-surface hover:bg-surface-container"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {alertFormOpen && (
        <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
          <p className="text-body-sm text-on-surface-variant mb-2">
            Enregistrement local uniquement. Aucune notification (email, push, WhatsApp) n&apos;a été configurée dans cette
            version — aucun message ne sera envoyé.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Adresse email (non utilisée, uniquement pour l&apos;enregistrement local)"
              className="flex-1 rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-label-md text-on-surface outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleCreateAlert}
              className="rounded-lg bg-primary px-3.5 py-1.5 text-label-sm font-bold text-on-primary transition-all hover:bg-forest-deep"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setAlertFormOpen(false);
                setToast(null);
              }}
              className="rounded-lg px-3.5 py-1.5 text-label-sm font-medium text-on-surface hover:bg-surface-container"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
