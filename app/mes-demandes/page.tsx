"use client";

import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { useLeads } from "@/data/local/leads-store";
import { formatLocalDate } from "@/lib/format";
import type { LeadKind, LeadSubmission } from "@/lib/types";

const KIND_SECTIONS: { kind: LeadKind; title: string; icon: string }[] = [
  { kind: "contact-bien", title: "Demandes sur des biens", icon: "calendar_month" },
  { kind: "diaspora", title: "Ogooué Diaspora", icon: "public" },
  { kind: "professionnels", title: "Devenir partenaire", icon: "handshake" },
  { kind: "neuf-notify", title: "Alerte Ogooué Neuf", icon: "apartment" },
  { kind: "louer-alerte", title: "Alerte IA — Location", icon: "notifications_active" },
];

const FIELD_LABELS: Record<string, string> = {
  name: "Nom",
  country: "Pays de résidence",
  project: "Projet",
  agencyName: "Agence",
  contactName: "Contact",
  phone: "Téléphone",
  city: "Ville",
  agence: "Agence",
  type: "Type de demande",
};

function LeadCard({ lead }: { lead: LeadSubmission }) {
  const fields = Object.entries(lead.payload).filter(
    ([key, value]) => key !== "slug" && value.trim().length > 0,
  );
  return (
    <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-label-md font-bold text-on-surface">{lead.contact}</span>
        <span className="text-label-sm text-on-surface-variant">
          {formatLocalDate(lead.createdAt)}
        </span>
      </div>
      {fields.length > 0 && (
        <div className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
          {fields.map(([key, value]) => (
            <span key={key}>
              <span className="font-medium text-on-surface">{FIELD_LABELS[key] ?? key} :</span>{" "}
              {value}
            </span>
          ))}
        </div>
      )}
      {lead.kind === "contact-bien" && lead.payload.slug && (
        <Link
          href={`/bien/${lead.payload.slug}`}
          className="inline-flex items-center gap-1 text-label-sm font-bold text-primary hover:underline mt-1"
        >
          Voir l&apos;annonce
          <Icon name="arrow_forward" className="text-[14px]" />
        </Link>
      )}
    </div>
  );
}

export default function MesDemandesPage() {
  const allLeads = useLeads();
  const hasAny = allLeads.length > 0;

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full">
        <div className="mb-space-lg">
          <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
            Mon espace
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">Mes demandes</h1>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Les demandes que vous avez envoyées (Ogooué Diaspora, partenariats, alertes...). Elles
            ne sont conservées que dans ce navigateur, sur cet appareil.
          </p>
          <Link
            href="/mes-annonces"
            className="inline-flex items-center gap-1 text-label-md font-bold text-primary hover:underline mt-3"
          >
            Voir mes annonces publiées
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>

        {hasAny ? (
          <div className="flex flex-col gap-space-xl">
            {KIND_SECTIONS.map(({ kind, title, icon }) => {
              const leads = allLeads.filter((lead) => lead.kind === kind);
              if (leads.length === 0) return null;
              return (
                <div key={kind}>
                  <h2 className="font-headline-md text-on-surface mb-space-md flex items-center gap-2">
                    <Icon name={icon} className="text-secondary" />
                    {title} ({leads.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-space-md bg-surface-container-low rounded-2xl py-24 px-6">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="mail" className="text-[32px] text-outline" />
            </div>
            <div className="max-w-md flex flex-col gap-2">
              <h2 className="font-headline-sm text-on-surface">
                Vous n&apos;avez envoyé aucune demande
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Vos demandes de visite/contact sur un bien, ainsi que celles envoyées depuis Ogooué
                Diaspora, Professionnels, Ogooué Neuf ou les alertes de location, apparaîtront ici.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-space-sm mt-2">
              <Link
                href="/diaspora"
                className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm"
              >
                Ogooué Diaspora
              </Link>
              <Link
                href="/mes-annonces"
                className="bg-surface border border-outline-variant/40 text-on-surface px-6 py-3 rounded-xl font-label-md hover:bg-surface-container transition-all"
              >
                Voir mes annonces
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
