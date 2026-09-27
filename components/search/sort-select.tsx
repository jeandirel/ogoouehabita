"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "recent", label: "Plus récents" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      className="bg-transparent text-label-sm font-bold text-on-surface outline-none cursor-pointer"
      defaultValue={searchParams.get("sort") ?? "pertinence"}
      onChange={(event) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", event.target.value);
        router.push(`/recherche?${params.toString()}`);
      }}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
