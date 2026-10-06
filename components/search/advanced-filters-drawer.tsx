"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogOverlay, DialogContent } from "@radix-ui/react-dialog";
import { Icon } from "@/components/ui/icon";
import { GABON_PROVINCE_NAMES, GABON_VILLES } from "@/data/gabon-geography";

export interface AdvancedFilters {
  ville?: string;
  province?: string;
  quartier?: string;
  types: string[];
  budgetMin?: number;
  budgetMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  chambresMin?: number;
  sallesDeBainMin?: number;
  piecesMin?: number;
  neuf?: boolean;
  meuble?: boolean;
  amenities: string[];
  titreFoncier?: boolean;
  shield?: boolean;
  particulier?: boolean;
  transactionType?: "vente" | "location";
  q?: string;
}

const DEFAULT_FILTERS: AdvancedFilters = {
  types: [],
  amenities: [],
};

const PROVINCES = GABON_PROVINCE_NAMES;
const VILLE_OPTIONS = GABON_VILLES.map((v) => ({ value: v.name, province: v.province }));

const AMENITIES_LABELS: { label: string; icon: string }[] = [
  { label: "Parking", icon: "local_parking" },
  { label: "Garage", icon: "garage" },
  { label: "Jardin", icon: "yard" },
  { label: "Piscine", icon: "pool" },
  { label: "Terrasse", icon: "outdoor_grill" },
  { label: "Balcon", icon: "balcony" },
  { label: "Climatisation", icon: "ac_unit" },
  { label: "Groupe électrogène", icon: "bolt" },
  { label: "Réserve d'eau", icon: "water_drop" },
  { label: "Forage", icon: "water" },
  { label: "Gardiennage", icon: "security" },
  { label: "Fibre optique", icon: "wifi" },
  { label: "Accès goudronné", icon: "streetview" },
  { label: "Bord de mer", icon: "waves" },
];

const PROPERTY_TYPE_LABELS: { value: string; label: string; icon: string }[] = [
  { value: "Maison", label: "Maison", icon: "home" },
  { value: "Villa", label: "Villa", icon: "villa" },
  { value: "Appartement", label: "Appartement", icon: "apartment" },
  { value: "Terrain", label: "Terrain", icon: "terrain" },
  { value: "Immeuble", label: "Immeuble", icon: "business" },
  { value: "Commerce", label: "Commerce", icon: "store" },
  { value: "Bureau", label: "Bureau", icon: "office" },
  { value: "Studio", label: "Studio", icon: "king_bed" },
];

function toInt(value: string): number | undefined {
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

interface AdvancedFiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  initialFilters: AdvancedFilters;
  transactionType?: "vente" | "location";
}

export function AdvancedFiltersDrawer({ open, onClose, initialFilters, transactionType }: AdvancedFiltersDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<AdvancedFilters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const villeOptions = useMemo(
    () =>
      filters.province
        ? VILLE_OPTIONS.filter((v) => v.province === filters.province)
        : VILLE_OPTIONS,
    [filters.province],
  );

  const quartierOptions = useMemo(() => {
    const ville = GABON_VILLES.find((v) => v.name === filters.ville);
    return ville ? ville.quartiers : [];
  }, [filters.ville]);

  const setField = <K extends keyof AdvancedFilters>(key: K, value: AdvancedFilters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (searchParams.get("q")) params.set("q", searchParams.get("q")!);
    if (transactionType) params.set("type", transactionType);
    if (filters.ville) params.set("ville", filters.ville);
    if (filters.province) params.set("province", filters.province);
    if (filters.quartier) params.set("quartier", filters.quartier);
    filters.types.forEach((t) => params.append("type", t));
    if (filters.budgetMin) params.set("budgetMin", filters.budgetMin.toString());
    if (filters.budgetMax) params.set("budgetMax", filters.budgetMax.toString());
    if (filters.surfaceMin) params.set("surfaceMin", filters.surfaceMin.toString());
    if (filters.surfaceMax) params.set("surfaceMax", filters.surfaceMax.toString());
    if (filters.chambresMin) params.set("chambresMin", filters.chambresMin.toString());
    if (filters.sallesDeBainMin) params.set("sallesDeBainMin", filters.sallesDeBainMin.toString());
    if (filters.piecesMin) params.set("piecesMin", filters.piecesMin.toString());
    if (filters.neuf) params.set("neuf", "1");
    if (filters.meuble) params.set("meuble", "1");
    filters.amenities.forEach((a) => params.append("amenity", a));
    if (filters.titreFoncier) params.set("titreFoncier", "1");
    if (filters.shield) params.set("shield", "1");
    if (filters.particulier) params.set("particulier", "1");
    const qs = params.toString();
    onClose();
    router.push(`${qs ? "/recherche?" : "/recherche"}${qs}${qs ? "&" : ""}filtres=1`);
  }, [filters, onClose, router, searchParams, transactionType]);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, transactionType, q: searchParams.get("q") ?? undefined });
  }, [transactionType, searchParams]);

  const activeCount =
    (filters.ville ? 1 : 0) +
    (filters.province ? 1 : 0) +
    (filters.quartier ? 1 : 0) +
    filters.types.length +
    (filters.budgetMin ? 1 : 0) +
    (filters.budgetMax ? 1 : 0) +
    (filters.surfaceMin ? 1 : 0) +
    (filters.surfaceMax ? 1 : 0) +
    (filters.chambresMin ? 1 : 0) +
    (filters.sallesDeBainMin ? 1 : 0) +
    (filters.piecesMin ? 1 : 0) +
    (filters.neuf ? 1 : 0) +
    (filters.meuble ? 1 : 0) +
    filters.amenities.length +
    (filters.titreFoncier ? 1 : 0) +
    (filters.shield ? 1 : 0) +
    (filters.particulier ? 1 : 0);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <h3 className="text-label-md font-bold text-on-surface">{title}</h3>
      {children}
    </div>
  );

  const CheckboxGroup = ({
    items,
    selected,
    onSelect,
  }: {
    items: { value: string; label: string; icon?: string }[];
    selected: string[];
    onSelect: (value: string) => void;
  }) => (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onSelect(item.value)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
            selected.includes(item.value)
              ? "border-primary bg-primary-fixed text-primary"
              : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
          }`}
          aria-pressed={selected.includes(item.value)}
        >
          {item.icon && (
            <Icon name={item.icon} className={selected.includes(item.value) ? "text-primary" : "text-secondary"} />
          )}
          <span className="flex-1 text-left">{item.label}</span>
          {selected.includes(item.value) && <Icon name="check" className="text-primary" />}
        </button>
      ))}
    </div>
  );

  const NumberInput = ({
    label,
    value,
    onChange,
    placeholder,
    suffix,
  }: {
    label: string;
    value?: number;
    onChange: (v: number | undefined) => void;
    placeholder?: string;
    suffix?: string;
  }) => (
    <div className="flex items-center gap-2">
      <label className="text-label-sm text-on-surface-variant">{label}</label>
      <input
        type="number"
        min="0"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(toInt(e.target.value))}
        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
      />
      {suffix && <span className="text-label-sm text-on-surface-variant">{suffix}</span>}
    </div>
  );
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogOverlay className="fixed inset-0 z-50 bg-anthracite/60 backdrop-blur-sm" />
      <DialogContent className="fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-w-[90vw] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border sm:border-outline-variant sm:bg-surface sm:shadow-2xl">
          <div className="flex h-full flex-col sm:h-[90vh] sm:max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/60 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <Icon name="tune" className="text-secondary" />
                <h2 className="text-headline-sm font-bold text-on-surface">Filtres avancés</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-on-surface hover:bg-surface-container transition-colors"
                aria-label="Fermer les filtres"
              >
                <Icon name="close" />
              </button>
            </div>

            {/* Scrollable filter body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <div className="space-y-6">
                {/* Localisation */}
                <Section title="Localisation">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm text-on-surface-variant">Province</label>
                      <select
                        value={filters.province ?? ""}
                        onChange={(e) => setField("province", e.target.value || undefined)}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      >
                        <option value="">Toutes les provinces</option>
                        {PROVINCES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm text-on-surface-variant">Ville</label>
                      <select
                        value={filters.ville ?? ""}
                        onChange={(e) => setField("ville", e.target.value || undefined)}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      >
                        <option value="">Toutes les villes</option>
                        {villeOptions.map((v) => (
                          <option key={v.value} value={v.value}>{v.value}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm text-on-surface-variant">Quartier</label>
                      <select
                        value={filters.quartier ?? ""}
                        onChange={(e) => setField("quartier", e.target.value || undefined)}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                        disabled={!filters.ville}
                      >
                        <option value="">Tous les quartiers</option>
                        {quartierOptions.map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Section>
                {/* Type de bien */}
                <Section title="Type de bien">
                  <CheckboxGroup
                    items={PROPERTY_TYPE_LABELS}
                    selected={filters.types}
                    onSelect={(v) =>
                      setField("types", filters.types.includes(v) ? filters.types.filter((t) => t !== v) : [...filters.types, v])
                    }
                  />
                </Section>

                {/* Budget */}
                <Section title="Budget (FCFA)">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-label-sm text-on-surface-variant">Minimum</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={filters.budgetMin ?? ""}
                        onChange={(e) => setField("budgetMin", toInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-label-sm text-on-surface-variant">Maximum</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Illimité"
                        value={filters.budgetMax ?? ""}
                        onChange={(e) => setField("budgetMax", toInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </Section>

                {/* Surface & terrain */}
                <Section title="Surface & terrain (m²)">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-label-sm text-on-surface-variant">Surface min</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={filters.surfaceMin ?? ""}
                        onChange={(e) => setField("surfaceMin", toInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-label-sm text-on-surface-variant">Surface max</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Illimité"
                        value={filters.surfaceMax ?? ""}
                        onChange={(e) => setField("surfaceMax", toInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </Section>
                {/* Pièces */}
                <Section title="Pièces">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm text-on-surface-variant">Chambres min</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={filters.chambresMin ?? ""}
                        onChange={(e) => setField("chambresMin", toInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm text-on-surface-variant">SDB min</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={filters.sallesDeBainMin ?? ""}
                        onChange={(e) => setField("sallesDeBainMin", toInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-label-sm text-on-surface-variant">Pièces min</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="2"
                        value={filters.piecesMin ?? ""}
                        onChange={(e) => setField("piecesMin", toInt(e.target.value))}
                        className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <span className="block text-label-sm text-on-surface-variant">
                    “Pièces” ≈ nombre de chambres (les annonces seedées ne comportent pas de décompte pièces).
                  </span>
                </Section>

                {/* État & ameublement */}
                <Section title="État & ameublement">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setField("neuf", !filters.neuf)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          filters.neuf
                            ? "border-primary bg-primary-fixed text-primary"
                            : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
                        }`}
                        aria-pressed={!!filters.neuf}
                      >
                        Neuf
                      </button>
                      <button
                        type="button"
                        onClick={() => setField("neuf", false)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          !filters.neuf
                            ? "border-primary bg-primary-fixed text-primary"
                            : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
                        }`}
                        aria-pressed={!filters.neuf}
                      >
                        Tous (ancien inclus)
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setField("meuble", !filters.meuble)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          filters.meuble
                            ? "border-primary bg-primary-fixed text-primary"
                            : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
                        }`}
                        aria-pressed={!!filters.meuble}
                      >
                        Meublé
                      </button>
                      <button
                        type="button"
                        onClick={() => setField("meuble", false)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          !filters.meuble
                            ? "border-primary bg-primary-fixed text-primary"
                            : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
                        }`}
                        aria-pressed={!filters.meuble}
                      >
                        Tous (non-meublé inclus)
                      </button>

                    </div>
                    <span className="block text-label-sm text-on-surface-variant">
                      “Neuf” filtre les annonces dont le titre ou la description mentionne “neuf”.
                    </span>
                  </div>
                </Section>

                {/* Équipements */}
                <Section title="Équipements">
                  <CheckboxGroup
                    items={AMENITIES_LABELS.map((a) => ({ value: a.label, label: a.label, icon: a.icon }))}
                    selected={filters.amenities}
                    onSelect={(label) =>
                      setField("amenities", filters.amenities.includes(label) ? filters.amenities.filter((t) => t !== label) : [...filters.amenities, label])
                    }
                  />
                </Section>

                {/* Titres & confiance */}
                <Section title="Titres & confiance">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setField("shield", !filters.shield)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 transition-all ${
                        filters.shield
                          ? "border-primary bg-primary-fixed text-primary"
                          : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
                      }`}
                      aria-pressed={!!filters.shield}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="verified" className={filters.shield ? "text-primary" : "text-secondary"} />
                        <span className="text-label-md font-medium">Bien vérifié Ogooué Shield (score 100%)</span>
                      </div>
                      <Icon name={filters.shield ? "check" : "check_box_outline_blank"} className="text-primary" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setField("titreFoncier", !filters.titreFoncier)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 transition-all ${
                        filters.titreFoncier
                          ? "border-primary bg-primary-fixed text-primary"
                          : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
                      }`}
                      aria-pressed={!!filters.titreFoncier}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="gavel" className={filters.titreFoncier ? "text-primary" : "text-secondary"} />
                        <span className="text-label-md font-medium">Titre foncier certifié</span>
                      </div>
                      <Icon name={filters.titreFoncier ? "check" : "check_box_outline_blank"} className="text-primary" />
                    </button>
                  </div>
                </Section>
                      <button
                        type="button"
                        onClick={() => setField("meuble", false)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          !filters.meuble
                            ? "border-primary bg-primary-fixed text-primary"
                            : "border-outline-variant bg-surface text-on-surface hover:border-secondary"
                        }`}
                        aria-pressed={!filters.meuble}
                      >
                        Tous (non-meublé inclus)
                      </button>
                {/* Vendeur */}
                <Section title="Vendeur">
                  <CheckboxGroup
                    items={[
                      { value: "particulier", label: "Particulier", icon: "person" },
                      { value: "agence", label: "Agence / professionnel", icon: "business" },
                    ]}
                    selected={filters.particulier ? ["particulier"] : []}
                    onSelect={(v) => setField("particulier", v === "particulier")}
                  />
                </Section>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-outline-variant/60 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg px-4 py-2.5 text-label-md font-medium text-on-surface hover:bg-surface-container transition-colors"
                >
                  Réinitialiser
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="hidden rounded-lg px-4 py-2.5 text-label-md font-medium text-on-surface hover:bg-surface-container sm:block transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    onClick={applyFilters}
                    disabled={activeCount === 0}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary shadow-sm transition-all hover:bg-forest-deep disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="filter_alt" />
                    <span>Appliquer ({activeCount})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
    </Dialog>
  );
}
