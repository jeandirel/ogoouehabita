import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { RechercheResults } from "@/components/recherche/recherche-results";
import { RechercheActionButtons } from "@/components/recherche/recherche-action-buttons";
import { AdvancedFiltersDrawer } from "@/components/search/advanced-filters-drawer";
import { InteractiveMap } from "@/components/recherche/interactive-map";
import { SortSelect } from "@/components/search/sort-select";
import { properties } from "@/data/properties";
import { matchesRechercheFilters, sortProperties, type PropertySort } from "@/lib/property-filters";
import type { AdvancedFilters } from "@/components/search/advanced-filters-drawer";
import type { TransactionType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Recherche avancée immobilier Gabon",
  description:
    "Filtrez villas, appartements et terrains par budget, chambres, surface et certification Ogooué Shield, avec carte interactive.",
};

const RECHERCHE_SLUGS = [
  "villa-akande-executive",
  "duplex-panorama-ocean",
  "terrain-residentiel-angondje",
];

const CHIPS = [
  { key: "villa", icon: undefined, label: "Villa & Maison" },
  { key: "budget", icon: undefined, label: "50M - 250M FCFA" },
  { key: "chambres", icon: undefined, label: "4+ Chambres" },
  { key: "surface", icon: undefined, label: "Surface > 300m²" },
  { key: "shield", icon: "verified", label: "Certifié Ogooué Shield" },
  { key: "piscine", icon: "pool", label: "Piscine" },
  { key: "vue", icon: "water", label: "Vue Panoramique" },
] as const;

const MAP_PINS = [
  { slug: "villa-akande-executive", priceShort: "185M FCFA", top: "35%", left: "42%", active: true },
  { slug: "duplex-panorama-ocean", priceShort: "95M FCFA", top: "55%", left: "60%", active: false },
  { slug: "terrain-residentiel-angondje", priceShort: "45M FCFA", top: "20%", left: "70%", active: false },
] as const;

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const get = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);
  const getUrlList = (key: string) => {
    const v = params[key];
    if (typeof v === "string") return [v];
    if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
    return [];
  };

  const transactionType: TransactionType = get("type") === "location" ? "location" : "vente";
  const q = get("q")?.toLowerCase().trim();
  const province = get("province");
  const vue = get("vue") ?? "carte"; // "liste" | "carte"
  const urlFiltres = get("filtres") === "1";
  const sort = get("sort") ?? "pertinence";

  const activeChips = {
    villa: get("villa") === "1",
    budget: get("budget") === "1",
    chambres: get("chambres") === "1",
    surface: get("surface") === "1",
    shield: get("shield") === "1",
    piscine: get("piscine") === "1",
    vue: get("vue") === "1",
  };
  const activeChipCount = Object.values(activeChips).filter(Boolean).length;

  const getNum = (key: string): number | undefined => {
    const v = get(key);
    return v ? Number(v) : undefined;
  };
  const activeFilters: Record<string, string | string[]> = {};
  [
    "ville",
    "province",
    "quartier",
    "budgetMin",
    "budgetMax",
    "surfaceMin",
    "surfaceMax",
    "chambresMin",
    "sallesDeBainMin",
    "piecesMin",
    "neuf",
    "meuble",
    "shield",
    "titreFoncier",
    "particulier",
  ].forEach((k) => {
    const v = get(k);
    if (v !== undefined && v !== "") activeFilters[k] = v;
  });
  const types = getUrlList("type");
  if (types.length) activeFilters.type = types;
  const amenities = getUrlList("amenity");
  if (amenities.length) activeFilters.amenity = amenities;

  const filters = { transactionType, province, q, chips: activeChips };
  const pool = properties.filter((property) => RECHERCHE_SLUGS.includes(property.slug));
  const filtered = pool.filter((property) => matchesRechercheFilters(property, filters));
  const results = sortProperties(filtered, sort as PropertySort);

  const showMap = vue === "carte";

  // Pin positions are hand-placed against the one static illustrative map
  // image (no real property coordinates exist to fabricate), so the map
  // can only ever show these 3 — but it can at least stay honest about
  // *which* of them still match the current filters/search/sort, instead
  // of always showing all 3 regardless of what the list is showing.
  const resultSlugs = new Set(results.map((property) => property.slug));
  const visiblePins = MAP_PINS.filter((pin) => resultSlugs.has(pin.slug)).map((pin) => ({
    ...pin,
    active: pin.slug === results[0]?.slug,
  }));

  const advancedFilters: AdvancedFilters = {
    ville: get("ville"),
    province: get("province"),
    quartier: get("quartier"),
    types,
    budgetMin: getNum("budgetMin"),
    budgetMax: getNum("budgetMax"),
    surfaceMin: getNum("surfaceMin"),
    surfaceMax: getNum("surfaceMax"),
    chambresMin: getNum("chambresMin"),
    sallesDeBainMin: getNum("sallesDeBainMin"),
    piecesMin: getNum("piecesMin"),
    neuf: get("neuf") === "1",
    meuble: get("meuble") === "1",
    amenities,
    titreFoncier: get("titreFoncier") === "1",
    shield: get("shield") === "1",
    particulier: get("particulier") === "1",
    transactionType,
    q,
  };

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") next.set(key, value);
    }
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    return qs ? `/recherche?${qs}` : "/recherche";
  };

  return (
    <SiteShell>
      <div className="flex flex-col w-full bg-surface">
        {/* Top Control & Search Bar */}
        <div className="w-full bg-surface-container-low px-6 lg:px-12 py-space-md shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex flex-wrap items-center gap-space-sm flex-1">
                <div className="flex bg-surface-container p-1 rounded-xl">
                  <Link
                    href={buildHref({ type: undefined })}
                    className={`px-4 py-2 text-label-md rounded-lg transition-all ${
                      transactionType === "vente"
                        ? "font-bold bg-primary text-on-primary shadow-sm"
                        : "font-medium text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Acheter
                  </Link>
                  <Link
                    href={buildHref({ type: "location" })}
                    className={`px-4 py-2 text-label-md rounded-lg transition-all ${
                      transactionType === "location"
                        ? "font-bold bg-primary text-on-primary shadow-sm"
                        : "font-medium text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Louer
                  </Link>
                </div>
                <form id="recherche-form" action="/recherche" className="flex items-center bg-surface px-4 py-2 rounded-xl shadow-sm min-w-[240px] flex-1">
                  {transactionType === "location" && <input type="hidden" name="type" value="location" />}
                  {sort !== "pertinence" && <input type="hidden" name="sort" value={sort} />}
                  {Object.entries(activeChips)
                    .filter(([, isActive]) => isActive)
                    .map(([key]) => (
                      <input key={key} type="hidden" name={key} value="1" />
                    ))}
                  <Icon name="location_on" className="text-secondary mr-2" />
                  <input
                    className="bg-transparent border-none outline-none text-body-sm text-on-surface w-full"
                    placeholder="Libreville (Estuaire), Port-Gentil..."
                    type="text"
                    name="q"
                    defaultValue={get("q") ?? ""}
                  />
                  {q && (
                    <Link href={buildHref({ q: undefined })} aria-label="Effacer la recherche">
                      <Icon name="close" className="text-outline cursor-pointer hover:text-on-surface" />
                    </Link>
                  )}
                </form>
              </div>
              <div className="flex items-center gap-space-sm">
                <a
                  href="#filtres"
                  className="flex items-center gap-2 bg-surface px-4 py-2.5 rounded-xl text-body-sm font-medium text-on-surface shadow-sm hover:bg-surface-container transition-all"
                >
                  <Icon name="tune" className="text-[18px] text-secondary" />
                  <span>Tous les filtres ({activeChipCount})</span>
                </a>
                <button
                  type="submit"
                  form="recherche-form"
                  className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-body-sm font-medium shadow-sm hover:bg-forest-deep transition-all"
                >
                  <Icon name="search" className="text-[18px]" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
            <div id="filtres" className="flex items-center gap-space-sm overflow-x-auto pb-1 no-scrollbar scroll-mt-24">
              {CHIPS.map((chip) => {
                const isActive = activeChips[chip.key];
                return (
                  <Link
                    key={chip.key}
                    href={buildHref({ [chip.key]: isActive ? undefined : "1" })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-label-md whitespace-nowrap transition-all shadow-sm ${
                      isActive
                        ? "bg-primary-fixed/50 font-bold text-primary hover:bg-primary-fixed"
                        : "bg-surface font-medium text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    {chip.icon && (
                      <Icon name={chip.icon} filled={isActive} className="text-[16px]" />
                    )}
                    <span>{chip.label}</span>
                    {!chip.icon && <Icon name="expand_more" className="text-[16px]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Split Marketplace Layout */}
        <div id="carte" className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-160px)] scroll-mt-20">
          {/* Left Column: Listings */}
          <div className="w-full lg:w-[42%] lg:h-full lg:overflow-y-auto px-6 py-space-md flex flex-col gap-space-md">
            <RechercheActionButtons
              transactionType={transactionType}
              activeFilters={activeFilters}
              clearUrl={`/recherche${transactionType === "location" ? "?type=location" : ""}`}
              currentSort={sort}
              showMap={showMap}
            />
            <RechercheResults
              curated={results}
              filters={filters}
              sort={sort}
              activeFilters={activeFilters}
              hasActiveFilters={Object.keys(activeFilters).length > 0}
              showMap={showMap}
              sortSelect={<SortSelect />}
              transactionType={transactionType}
            />
          </div>

          {/* Right Column: Interactive Map with Price Pins */}
          {showMap && <InteractiveMap pins={visiblePins} />}
        </div>

        <AdvancedFiltersDrawer
          open={urlFiltres}
          onClose={() => {}}
          initialFilters={advancedFilters}
          transactionType={transactionType}
        />
      </div>
    </SiteShell>
  );
}
