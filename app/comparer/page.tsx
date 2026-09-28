"use client";

import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { useCompareIds, removeFromCompare } from "@/data/local/compare-store";
import { parseFavoriteId } from "@/data/local/favorite-id";
import { useMergedProperties } from "@/data/local/published-listings-store";
import { lands } from "@/data/land";
import type { Land, Property } from "@/lib/types";

type CompareEntry =
  | { id: string; kind: "property"; item: Property }
  | { id: string; kind: "land"; item: Land };

function useCompareEntries(): CompareEntry[] {
  const ids = useCompareIds();
  const properties = useMergedProperties();

  return ids
    .map((id): CompareEntry | undefined => {
      const parsed = parseFavoriteId(id);
      if (!parsed) return undefined;
      if (parsed.kind === "property") {
        const item = properties.find((property) => property.slug === parsed.slug);
        return item ? { id, kind: "property", item } : undefined;
      }
      const item = lands.find((land) => land.slug === parsed.slug);
      return item ? { id, kind: "land", item } : undefined;
    })
    .filter((entry): entry is CompareEntry => entry !== undefined);
}

function detailHref(entry: CompareEntry): string {
  return entry.kind === "property" ? `/bien/${entry.item.slug}` : `/terrains/${entry.item.slug}`;
}

const ROW_LABEL_CLASS = "px-4 py-3 text-label-sm font-bold text-on-surface-variant uppercase tracking-wide align-top";
const CELL_CLASS = "px-4 py-3 text-body-sm text-on-surface align-top min-w-[220px]";

export default function ComparerPage() {
  const entries = useCompareEntries();

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full">
        <div className="mb-space-lg">
          <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
            Mon espace
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">Comparateur de biens</h1>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Comparez côte à côte les biens et terrains ajoutés depuis l&apos;icône
            <Icon name="compare_arrows" className="text-[16px] mx-1 inline-block align-text-bottom" />
            pendant votre recherche. Cette sélection est conservée localement sur cet appareil.
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-space-md bg-surface-container-low rounded-2xl py-24 px-6">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="compare_arrows" className="text-[32px] text-outline" />
            </div>
            <div className="max-w-md flex flex-col gap-2">
              <h2 className="font-headline-sm text-on-surface">Aucun bien à comparer</h2>
              <p className="text-body-md text-on-surface-variant">
                Cliquez sur l&apos;icône de comparaison d&apos;une annonce pendant votre recherche
                pour l&apos;ajouter ici et comparer plusieurs biens côte à côte.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-space-sm mt-2">
              <Link
                href="/recherche"
                className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm"
              >
                Lancer une recherche
              </Link>
              <Link
                href="/terrains"
                className="bg-surface border border-outline-variant/40 text-on-surface px-6 py-3 rounded-xl font-label-md hover:bg-surface-container transition-all"
              >
                Explorer les terrains
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 shadow-sm">
            <table className="w-full border-collapse bg-surface-container-lowest">
              <tbody>
                <tr className="border-b border-outline-variant/20">
                  <td className={ROW_LABEL_CLASS}>Bien</td>
                  {entries.map((entry) => (
                    <td key={entry.id} className={CELL_CLASS}>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className="w-full h-32 rounded-xl bg-cover bg-center"
                            style={{ backgroundImage: `url('${entry.item.image.path}')` }}
                            role="img"
                            aria-label={entry.item.image.alt}
                          />
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-on-surface leading-tight">
                            {entry.item.title}
                          </h3>
                          <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
                            <Icon name="location_on" className="text-[14px] text-secondary" />
                            {entry.item.location}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(entry.id)}
                          className="self-start flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Icon name="close" className="text-[14px]" />
                          Retirer
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-outline-variant/20 bg-surface-container-low/60">
                  <td className={ROW_LABEL_CLASS}>Prix</td>
                  {entries.map((entry) => (
                    <td key={entry.id} className={CELL_CLASS}>
                      <span className="font-headline-sm text-primary font-bold">
                        {entry.item.priceLabel}
                      </span>
                      {entry.kind === "property" && entry.item.priceSecondaryLabel && (
                        <span className="block text-label-sm text-on-surface-variant">
                          {entry.item.priceSecondaryLabel}
                        </span>
                      )}
                      {entry.kind === "land" && (
                        <span className="block text-label-sm text-on-surface-variant">
                          {entry.item.pricePerSqmLabel}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-outline-variant/20">
                  <td className={ROW_LABEL_CLASS}>Type / Province</td>
                  {entries.map((entry) => (
                    <td key={entry.id} className={CELL_CLASS}>
                      {entry.kind === "property" ? entry.item.category ?? "—" : "Terrain"}
                      <span className="block text-label-sm text-on-surface-variant">
                        {entry.item.province}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-outline-variant/20 bg-surface-container-low/60">
                  <td className={ROW_LABEL_CLASS}>Caractéristiques</td>
                  {entries.map((entry) => (
                    <td key={entry.id} className={CELL_CLASS}>
                      {entry.kind === "property" ? (
                        <ul className="flex flex-col gap-1">
                          {entry.item.specs.map((spec) => (
                            <li key={spec.label} className="flex items-center gap-1.5">
                              <Icon name={spec.icon} className="text-[14px] text-secondary" />
                              {spec.label}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="flex flex-col gap-1">
                          <li className="flex items-center gap-1.5">
                            <Icon name="straighten" className="text-[14px] text-secondary" />
                            {entry.item.areaLabel}
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Icon name="alt_route" className="text-[14px] text-secondary" />
                            {entry.item.accessLabel}
                          </li>
                        </ul>
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-outline-variant/20">
                  <td className={ROW_LABEL_CLASS}>Confiance / Vérification</td>
                  {entries.map((entry) => (
                    <td key={entry.id} className={CELL_CLASS}>
                      {entry.kind === "property" ? (
                        entry.item.passportScore !== undefined ? (
                          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-label-sm font-bold">
                            <Icon name="verified" className="text-[14px]" />
                            Passeport Ogooué {entry.item.passportScore}%
                          </span>
                        ) : (
                          <span className="text-on-surface-variant">Non vérifié</span>
                        )
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-bold ${entry.item.levelBadgeClass}`}
                        >
                          {entry.item.levelLabel}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className={ROW_LABEL_CLASS}>Fiche</td>
                  {entries.map((entry) => (
                    <td key={entry.id} className={CELL_CLASS}>
                      <Link
                        href={detailHref(entry)}
                        className="inline-flex items-center gap-1 text-label-md font-bold text-primary hover:underline"
                      >
                        Voir la fiche complète
                        <Icon name="arrow_forward" className="text-[16px]" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
