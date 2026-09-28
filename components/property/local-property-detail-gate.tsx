"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PropertyDetailView } from "@/components/property/property-detail-view";
import { getPublishedListings } from "@/data/local/published-listings-store";
import type { PublishedListing } from "@/lib/types";

// A slug not found in the static `properties` seed can still be a listing
// published locally (localStorage, browser-only) — the server render never
// sees it, so this client gate checks after hydration before giving up and
// rendering the real not-found page (never on the first, server-matching pass).
export function LocalPropertyDetailGate({ slug }: { slug: string }) {
  const [status, setStatus] = useState<"loading" | "found" | "missing">("loading");
  const [listing, setListing] = useState<PublishedListing | null>(null);

  useEffect(() => {
    // Deliberate one-time read of localStorage post-mount, not a derivable
    // render value: doing this synchronously during render (or via
    // usePublishedListings() + notFound()) would 404 on the SSR-matching
    // hydration pass, before the real client snapshot ever arrives.
    const match = getPublishedListings().find((entry) => entry.slug === slug) ?? null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setListing(match);
    setStatus(match ? "found" : "missing");
  }, [slug]);

  if (status === "missing") notFound();
  if (status === "loading" || !listing) return null;

  return (
    <SiteShell>
      <PropertyDetailView property={listing} />
    </SiteShell>
  );
}
