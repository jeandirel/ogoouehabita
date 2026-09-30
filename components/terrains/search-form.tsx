"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { GABON_GEOGRAPHY, getVillesByProvince } from "@/data/gabon-geography";
import { TRUST_LEVELS } from "@/data/land";

export function TerrainsSearchForm({
  initialProvince,
  initialVille,
  initialMinArea,
  initialMaxBudget,
  initialTrustMin,
}: {
  initialProvince?: string;
  initialVille?: string;
  initialMinArea?: string;
  initialMaxBudget?: string;
  initialTrustMin?: string;
}) {
  const [province, setProvince] = useState(initialProvince ?? GABON_GEOGRAPHY[0].name);
  const villesForProvince = useMemo(() => getVillesByProvince(province), [province]);
  const [ville, setVille] = useState(initialVille ?? villesForProvince[0]?.name ?? "");

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setVille(getVillesByProvince(value)[0]?.name ?? "");
  };

  return (
    <form
      action="/terrains"
      className="portal-panel p-4 text-on-surface sm:p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-headline-sm font-bold text-primary">Recherche foncière</div>
          <div className="mt-0.5 text-label-sm text-on-surface-variant">Affinez votre sélection</div>
        </div>
        <Icon name="explore" className="text-secondary" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
              Province
            </label>
            <select
              name="province"
              value={province}
              onChange={(event) => handleProvinceChange(event.target.value)}
              className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary"
            >
              {GABON_GEOGRAPHY.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
              Ville / Zone
            </label>
            <select
              name="ville"
              value={ville}
              onChange={(event) => setVille(event.target.value)}
              className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary"
            >
              {villesForProvince.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
              Surface Min (m²)
            </label>
            <input
              name="minArea"
              defaultValue={initialMinArea}
              className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary"
              placeholder="ex: 500"
              type="number"
            />
          </div>
          <div>
            <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
              Budget Max (FCFA)
            </label>
            <input
              name="maxBudget"
              defaultValue={initialMaxBudget}
              className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary"
              placeholder="ex: 15.000.000"
              type="text"
            />
          </div>
        </div>
        <div>
          <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
            Niveau de confiance minimum
          </label>
          <select
            name="trustMin"
            defaultValue={initialTrustMin ?? ""}
            className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-3 py-3 text-body-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="">Indifférent</option>
            {[...TRUST_LEVELS].reverse().map((level) => (
              <option key={level.level} value={level.level}>
                Niveau {level.level}+ — {level.title}
              </option>
            ))}
          </select>
        </div>
        <button
          className="mt-1 w-full rounded-xl bg-primary py-3 text-on-primary font-label-md flex items-center justify-center gap-2 hover:bg-forest-deep transition-colors shadow-sm"
          type="submit"
        >
          <Icon name="search" className="text-[18px]" />
          Explorer les terrains certifiés
        </button>
      </div>
    </form>
  );
}
