"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { GABON_PROVINCE_NAMES } from "@/data/gabon-geography";
import { useMergedProperties } from "@/data/local/published-listings-store";
import { estimatePrice, type EstimationResult } from "@/lib/estimation";
import { formatFcfa } from "@/lib/format";

const TRANSACTION_TYPES = [
  { key: "vente", label: "Vente" },
  { key: "location", label: "Location" },
] as const;

const CATEGORIES = ["Villa", "Maison", "Appartement", "Studio", "Terrain", "Immeuble"];

export function EstimationForm() {
  const properties = useMergedProperties();
  const [transactionType, setTransactionType] =
    useState<(typeof TRANSACTION_TYPES)[number]["key"]>("vente");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [province, setProvince] = useState(GABON_PROVINCE_NAMES[0]);
  const [surface, setSurface] = useState("");
  const [result, setResult] = useState<EstimationResult | null | undefined>(undefined);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const surfaceM2 = Number(surface.replace(/[^\d]/g, ""));
    if (!surfaceM2) return;
    setResult(estimatePrice(properties, { transactionType, category, province, surfaceM2 }));
  };

  return (
    <div className="flex flex-col gap-space-lg max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-space-lg lg:p-space-xl rounded-xl border border-outline-variant/70 shadow-sm flex flex-col gap-space-md"
      >
        <div className="flex bg-surface-container p-1 rounded-xl w-fit">
          {TRANSACTION_TYPES.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                setTransactionType(option.key);
                setResult(undefined);
              }}
              aria-pressed={transactionType === option.key}
              className={cn(
                "px-6 py-2.5 text-label-md rounded-lg transition-all",
                transactionType === option.key
                  ? "font-bold bg-primary text-on-primary shadow-sm"
                  : "font-medium text-on-surface-variant hover:text-on-surface",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <label className="flex flex-col gap-1.5">
            <span className="text-label-md font-bold text-on-surface">Catégorie</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
            >
              {CATEGORIES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-label-md font-bold text-on-surface">Province</span>
            <select
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
            >
              {GABON_PROVINCE_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">Surface (m²)</span>
          <input
            type="text"
            required
            value={surface}
            onChange={(event) => setSurface(event.target.value)}
            placeholder="Ex : 250"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>

        <button
          type="submit"
          className="bg-primary text-on-primary py-3.5 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Icon name="calculate" className="text-[18px]" />
          Estimer le prix indicatif
        </button>
      </form>

      {result === null && (
        <div className="border border-outline-variant/60 bg-surface-container-low p-space-lg rounded-xl flex flex-col items-center text-center gap-space-sm">
          <Icon name="info" className="text-outline text-[28px]" />
          <p className="text-body-md text-on-surface-variant max-w-md">
            Pas encore assez d&apos;annonces comparables ({category}, {TRANSACTION_TYPES.find((t) => t.key === transactionType)?.label.toLowerCase()}) sur Ogooué Habitat pour produire une estimation. Un conseiller d&apos;une agence partenaire peut vous aider directement.
          </p>
          <Link
            href="/agences"
            className="inline-flex items-center gap-1 text-label-md font-bold text-primary hover:underline"
          >
            Voir les agences partenaires
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      )}

      {result && (
        <div className="bg-primary-fixed/30 p-space-lg rounded-xl flex flex-col gap-space-sm">
          <span className="text-label-md font-bold text-secondary uppercase tracking-wider">
            Estimation indicative
          </span>
          <div className="text-headline-lg text-on-surface font-bold">
            {formatFcfa(result.estimateLow)} — {formatFcfa(result.estimateHigh)}
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Basée sur {result.sampleSize} annonce{result.sampleSize > 1 ? "s" : ""} comparable
            {result.sampleSize > 1 ? "s" : ""} ({category},{" "}
            {TRANSACTION_TYPES.find((t) => t.key === transactionType)?.label.toLowerCase()}
            {result.matchedProvince ? ` — ${province}` : ", toutes provinces confondues"}) déjà
            présente{result.sampleSize > 1 ? "s" : ""} sur Ogooué Habitat, soit environ{" "}
            {formatFcfa(result.pricePerSqm)} / m². Non contractuelle : elle ne remplace pas une
            évaluation par un professionnel.
          </p>
        </div>
      )}
    </div>
  );
}
