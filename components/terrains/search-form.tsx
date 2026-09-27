"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { GABON_GEOGRAPHY, getVillesByProvince } from "@/data/gabon-geography";

export function TerrainsSearchForm({
  initialProvince,
  initialVille,
  initialMinArea,
  initialMaxBudget,
}: {
  initialProvince?: string;
  initialVille?: string;
  initialMinArea?: string;
  initialMaxBudget?: string;
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
      className="lg:col-span-5 bg-surface p-6 rounded-xl shadow-xl text-on-surface"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-headline-sm text-primary font-bold">Recherche Foncière</div>
        <Icon name="explore" className="text-secondary" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
              Province
            </label>
            <select
              name="province"
              value={province}
              onChange={(event) => handleProvinceChange(event.target.value)}
              className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
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
              className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
            >
              {villesForProvince.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
              Surface Min (m²)
            </label>
            <input
              name="minArea"
              defaultValue={initialMinArea}
              className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
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
              className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
              placeholder="ex: 15.000.000"
              type="text"
            />
          </div>
        </div>
        <button
          className="mt-2 w-full bg-primary text-on-primary py-3 rounded-xl font-label-md flex items-center justify-center gap-2 hover:bg-forest-deep transition-colors shadow-sm"
          type="submit"
        >
          <Icon name="search" className="text-[18px]" />
          Explorer les terrains certifiés
        </button>
      </div>
    </form>
  );
}
