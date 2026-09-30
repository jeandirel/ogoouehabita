"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { GABON_GEOGRAPHY } from "@/data/gabon-geography";
import { ACHETER_TYPE_OPTIONS, LOUER_TYPE_OPTIONS } from "@/data/property-types";

const TABS = [
  { key: "acheter", label: "Acheter", href: "/acheter", icon: "home" },
  { key: "louer", label: "Louer", href: "/louer", icon: "key" },
  { key: "terrains", label: "Terrains", href: "/terrains", icon: "landscape" },
  { key: "neuf", label: "Neuf", href: "/neuf", icon: "construction" },
] as const;

const LOCATIONS = GABON_GEOGRAPHY.map((province) => ({ value: province.name, label: province.name }));
const TYPE_OPTIONS_BY_TAB: Record<(typeof TABS)[number]["key"], string[]> = {
  acheter: ACHETER_TYPE_OPTIONS,
  louer: LOUER_TYPE_OPTIONS,
  terrains: ["Tous les terrains"],
  neuf: ["Programmes neufs"],
};
const BUDGETS_BY_TAB: Record<(typeof TABS)[number]["key"], string[]> = {
  acheter: ["Tous budgets", "50 000 000 FCFA", "100 000 000 FCFA", "200 000 000 FCFA", "500 000 000 FCFA"],
  louer: ["Indifférent", "250 000 FCFA", "500 000 FCFA", "1 000 000 FCFA", "2 000 000 FCFA"],
  terrains: ["Tous budgets", "25 000 000 FCFA", "50 000 000 FCFA", "100 000 000 FCFA", "250 000 000 FCFA"],
  neuf: ["À venir"],
};

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("acheter");
  const [province, setProvince] = useState(LOCATIONS[0].value);
  const [propertyType, setPropertyType] = useState(TYPE_OPTIONS_BY_TAB.acheter[0]);
  const [budget, setBudget] = useState(BUDGETS_BY_TAB.acheter[0]);

  const selectTab = (tab: (typeof TABS)[number]["key"]) => {
    setActiveTab(tab);
    setPropertyType(TYPE_OPTIONS_BY_TAB[tab][0]);
    setBudget(BUDGETS_BY_TAB[tab][0]);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (activeTab === "neuf") {
      router.push("/neuf#notifier");
      return;
    }
    const params = new URLSearchParams({ province });
    if (activeTab === "terrains") {
      if (budget !== "Tous budgets") params.set("maxBudget", budget);
    } else {
      if (propertyType && propertyType !== "Tous types") params.set("type", propertyType);
      if (!["Tous budgets", "Indifférent"].includes(budget)) params.set("budget", budget);
    }
    router.push(`${TABS.find((tab) => tab.key === activeTab)!.href}?${params.toString()}`);
  };

  return <form onSubmit={handleSearch} className="w-full max-w-6xl rounded-xl bg-surface p-2 text-on-surface shadow-xl shadow-anthracite/20 sm:p-3">
    <div className="flex gap-1 overflow-x-auto border-b border-outline-variant/70 px-1 pb-3 no-scrollbar">
      {TABS.map((tab) => <button key={tab.key} type="button" onClick={() => selectTab(tab.key)} className={cn("inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-label-md font-bold transition-all", activeTab === tab.key ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")}><Icon name={tab.icon} className="text-[18px]" />{tab.label}</button>)}
    </div>
    <div className="grid gap-2 pt-3 lg:grid-cols-[1.15fr_1fr_1fr_auto] lg:items-stretch">
      <label className="group flex min-w-0 items-center gap-3 rounded-lg border border-outline-variant/80 bg-surface-container-low px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-surface">
        <Icon name="location_on" className="shrink-0 text-[22px] text-secondary" />
        <span className="min-w-0 text-left"><span className="block text-label-sm font-bold uppercase tracking-wide text-on-surface-variant">Localisation</span><select value={province} onChange={(event) => setProvince(event.target.value)} className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent pr-1 text-body-md font-bold text-on-surface outline-none">{LOCATIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></span>
      </label>
      <label className="group flex min-w-0 items-center gap-3 rounded-lg border border-outline-variant/80 bg-surface-container-low px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-surface">
        <Icon name={activeTab === "terrains" ? "landscape" : "apartment"} className="shrink-0 text-[22px] text-secondary" />
        <span className="min-w-0 text-left"><span className="block text-label-sm font-bold uppercase tracking-wide text-on-surface-variant">{activeTab === "terrains" ? "Type de projet" : "Type de bien"}</span><select value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent pr-1 text-body-md font-bold text-on-surface outline-none">{TYPE_OPTIONS_BY_TAB[activeTab].map((option) => <option key={option}>{option}</option>)}</select></span>
      </label>
      <label className="group flex min-w-0 items-center gap-3 rounded-lg border border-outline-variant/80 bg-surface-container-low px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-surface">
        <Icon name="payments" className="shrink-0 text-[22px] text-secondary" />
        <span className="min-w-0 text-left"><span className="block text-label-sm font-bold uppercase tracking-wide text-on-surface-variant">Budget maximum</span><select value={budget} onChange={(event) => setBudget(event.target.value)} className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent pr-1 text-body-md font-bold text-on-surface outline-none">{BUDGETS_BY_TAB[activeTab].map((option) => <option key={option}>{option}</option>)}</select></span>
      </label>
      <button type="submit" className="inline-flex min-h-[62px] items-center justify-center gap-2 rounded-lg bg-primary px-7 text-label-md font-extrabold text-on-primary shadow-sm transition-all hover:bg-forest-deep hover:shadow-md"><Icon name="search" className="text-[22px]" />{activeTab === "neuf" ? "Découvrir" : "Rechercher"}</button>
    </div>
    <div className="flex flex-col gap-2 px-2 pb-1 pt-3 text-left sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-label-sm text-on-surface-variant"><Icon name="verified" className="text-[17px] text-secondary" />Filtres détaillés et niveau de vérification disponibles ensuite.</p><button type="button" onClick={() => router.push("/recherche")} className="inline-flex items-center gap-1 text-label-sm font-bold text-primary hover:underline">Recherche avancée <Icon name="arrow_forward" className="text-[16px]" /></button></div>
  </form>;
}