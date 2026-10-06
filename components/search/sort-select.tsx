"use client";

import { useRouter, useSearchParams } from "next/navigation";

export type PropertySort = "pertinence" | "recent" | "prix-asc" | "prix-desc" | "surface-asc" | "surface-desc";

const SORT_OPTIONS: { value: PropertySort; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "recent", label: "Plus récents" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "surface-asc", label: "Surface croissante" },
  { value: "surface-desc", label: "Surface décroissante" },
];

interface SortSelectProps {
  searchParamKey?: string;
  className?: string;
  onSort?: (sort: PropertySort) => void;
}

export function SortSelect({ searchParamKey = "sort", className, onSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = searchParams.get(searchParamKey) ?? "pertinence";

  const handleChange = (newValue: PropertySort) => {
    if (onSort) {
      onSort(newValue);
    } else if (searchParamKey === "sort") {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue === "pertinence") {
        params.delete("sort");
      } else {
        params.set("sort", newValue);
      }
      router.push(`/recherche?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue === "pertinence") {
        params.delete(searchParamKey);
      } else {
        params.set(searchParamKey, newValue);
      }
      router.push(`/recherche?${params.toString()}`);
    }
  };

  return (
    <select
      className={`bg-transparent text-label-sm font-bold text-on-surface outline-none cursor-pointer ${className ?? ""}`}
      defaultValue={value}
      onChange={(event) => handleChange(event.target.value as PropertySort)}
      aria-label="Trier par"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
