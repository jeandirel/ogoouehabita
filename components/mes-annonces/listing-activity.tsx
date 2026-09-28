"use client";

import { Icon } from "@/components/ui/icon";
import { useLeads } from "@/data/local/leads-store";
import { formatLocalDate } from "@/lib/format";

export function ListingActivity({ slug }: { slug: string }) {
  const leads = useLeads("contact-bien").filter((lead) => lead.payload.slug === slug);

  if (leads.length === 0) {
    return (
      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant bg-surface-container-low rounded-lg px-3 py-2 mt-2">
        <Icon name="inbox" className="text-[16px]" />
        Aucune demande reçue sur cet appareil pour cette annonce.
      </div>
    );
  }

  const mostRecent = leads.reduce((latest, lead) => (lead.createdAt > latest.createdAt ? lead : latest));

  return (
    <div className="flex flex-col gap-1 text-body-sm bg-secondary-fixed/20 rounded-lg px-3 py-2 mt-2">
      <span className="font-bold text-on-surface flex items-center gap-1.5">
        <Icon name="mail" className="text-[16px] text-secondary" />
        {leads.length} demande{leads.length > 1 ? "s" : ""} reçue{leads.length > 1 ? "s" : ""} sur cet
        appareil
      </span>
      <span className="text-on-surface-variant">
        Dernière : {mostRecent.payload.type ?? "Message"} — {formatLocalDate(mostRecent.createdAt)}
      </span>
    </div>
  );
}
