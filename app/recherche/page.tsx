import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { RechercheResults } from "@/components/recherche/recherche-results";
import { InteractiveMap } from "@/components/recherche/interactive-map";
import { SortSelect } from "@/components/search/sort-select";
import { properties } from "@/data/properties";
import { matchesRechercheFilters, sortByPrice } from "@/lib/property-filters";
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

  const transactionType: TransactionType = get("type") === "location" ? "location" : "vente";
  const q = get("q")?.toLowerCase().trim();
  const province = get("province");
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

  const filters = { transactionType, province, q, chips: activeChips };
  const pool = properties.filter((property) => RECHERCHE_SLUGS.includes(property.slug));
  const filtered = pool.filter((property) => matchesRechercheFilters(property, filters));
  const results = sortByPrice(filtered, sort);

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
        <div className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-160px)]">
          {/* Left Column: Listings */}
          <div className="w-full lg:w-[42%] lg:h-full lg:overflow-y-auto px-6 py-space-md flex flex-col gap-space-md">
            <RechercheResults
              curated={results}
              filters={filters}
              sort={sort}
              sortSelect={<SortSelect />}
            />
          </div>

          {/* Right Column: Interactive Map with Price Pins */}
          <InteractiveMap pins={MAP_PINS} />
        </div>
      </div>
    </SiteShell>
  );
}
