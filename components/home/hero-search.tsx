"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { GABON_GEOGRAPHY } from "@/data/gabon-geography";

const TABS = [
  { key: "acheter", label: "Acheter", href: "/acheter" },
  { key: "louer", label: "Louer", href: "/louer" },
  { key: "terrains", label: "Terrains", href: "/terrains" },
  { key: "neuf", label: "Neuf", href: "/neuf" },
] as const;

const LOCATIONS = GABON_GEOGRAPHY.map((province) => {
  const sample = province.villes.slice(0, 3).map((v) => v.name).join(", ");
  const suffix = province.villes.length > 3 ? "..." : "";
  return `${province.name} (${sample}${suffix})`;
});

const PROPERTY_TYPES = [
  "Villa & Maison",
  "Appartement de standing",
  "Terrain constructible",
  "Immeuble commercial",
];

const BUDGETS = [
  "Tous budgets",
  "Jusqu'à 300 000 FCFA / mois",
  "Jusqu'à 600 000 FCFA / mois",
  "Jusqu'à 100 000 000 FCFA",
];

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("acheter");
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [aiQuery, setAiQuery] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const tab = TABS.find((t) => t.key === activeTab)!;
    const params = new URLSearchParams({ location, type: propertyType, budget });
    router.push(`${tab.href}?${params.toString()}`);
  };

  const handleAiSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (aiQuery.trim()) params.set("q", aiQuery.trim());
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl bg-surface/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-2xl text-on-surface"
    >
      <div className="flex flex-wrap gap-2 mb-4 border-b border-outline-variant/30 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "search-tab px-4 py-2 rounded-xl text-label-md font-bold transition-all",
              activeTab === tab.key
                ? "bg-primary text-on-primary"
                : "font-medium text-on-surface-variant hover:bg-surface-container",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex flex-col text-left p-3 rounded-xl bg-surface-container-low">
          <label className="text-label-sm text-on-surface-variant font-bold uppercase mb-1" htmlFor="hero-location">
            Localisation ou Province
          </label>
          <select
            id="hero-location"
            className="bg-transparent text-body-md font-medium text-on-surface outline-none cursor-pointer"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {LOCATIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col text-left p-3 rounded-xl bg-surface-container-low">
          <label className="text-label-sm text-on-surface-variant font-bold uppercase mb-1" htmlFor="hero-type">
            Type de bien
          </label>
          <select
            id="hero-type"
            className="bg-transparent text-body-md font-medium text-on-surface outline-none cursor-pointer"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            {PROPERTY_TYPES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col text-left p-3 rounded-xl bg-surface-container-low">
          <label className="text-label-sm text-on-surface-variant font-bold uppercase mb-1" htmlFor="hero-budget">
            Budget max
          </label>
          <select
            id="hero-budget"
            className="bg-transparent text-body-md font-medium text-on-surface outline-none cursor-pointer"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            {BUDGETS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant/30 flex flex-col md:flex-row items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary-container/30 text-ogooue-blue rounded-xl w-full md:w-auto">
          <Icon name="auto_awesome" className="text-[20px]" />
          <span className="text-label-sm font-bold uppercase tracking-wider">Ogooué AI</span>
        </div>
        <input
          className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-body-md text-on-surface outline-none focus:ring-2 focus:ring-ogooue-blue transition-all"
          placeholder="Ex: Je cherche une villa sécurisée de 3 chambres à Akanda pour moins de 500 000 FCFA..."
          type="text"
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAiSearch(e);
          }}
        />
        <button
          type="button"
          onClick={handleAiSearch}
          className="w-full md:w-auto bg-primary text-on-primary px-8 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          <Icon name="search" />
          <span>Explorer</span>
        </button>
      </div>
    </form>
  );
}
