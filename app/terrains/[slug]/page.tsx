import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { TrustLevelCard } from "@/components/land/trust-level-card";
import { LandFavoriteButton } from "@/components/land/land-favorite-button";
import { lands, TRUST_LEVELS } from "@/data/land";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return lands.map((land) => ({ slug: land.slug }));
}

export default async function LandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const land = lands.find((entry) => entry.slug === slug);
  if (!land) notFound();

  const matchingLevel = TRUST_LEVELS.find((level) => level.level === land.trustLevel)!;

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
        <Link href="/terrains" className="text-body-sm font-bold text-secondary hover:underline">
          ← Retour aux terrains
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div
              className="relative h-80 rounded-xl bg-cover bg-center shadow-md"
              style={{ backgroundImage: `url('${land.image.path}')` }}
              role="img"
              aria-label={land.image.alt}
            >
              <div
                className={`absolute top-4 left-4 text-label-sm px-3 py-1.5 rounded-full font-bold shadow-sm ${land.levelBadgeClass}`}
              >
                {land.levelLabel}
              </div>
            </div>
            <div>
              <div className="text-label-sm text-secondary font-medium uppercase tracking-wider mb-1">
                {land.location}
              </div>
              <h1 className="text-headline-lg text-on-surface font-bold">{land.title}</h1>
              <span className="mt-3 inline-block text-label-sm font-bold text-primary bg-primary-fixed/30 px-2.5 py-1 rounded-full">
                {land.reference}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-body-sm text-on-surface-variant">
              <span className="flex items-center gap-2 bg-surface-container-low rounded-xl p-4">
                <Icon name="straighten" className="text-secondary" /> {land.areaLabel}
              </span>
              <span className="flex items-center gap-2 bg-surface-container-low rounded-xl p-4">
                <Icon name="payments" className="text-secondary" /> {land.pricePerSqmLabel}
              </span>
              <span className="flex items-center gap-2 bg-surface-container-low rounded-xl p-4">
                <Icon name="alt_route" className="text-secondary" /> {land.accessLabel}
              </span>
              <span className="flex items-center gap-2 bg-surface-container-low rounded-xl p-4">
                <Icon name="pin_drop" className="text-secondary" /> {land.bornageLabel}
              </span>
            </div>
            <TrustLevelCard level={matchingLevel} />
            {land.landChecklist && (
              <div className="bg-surface-container-low p-space-lg rounded-xl shadow-sm">
                <h3 className="font-headline-sm text-on-surface mb-space-md">
                  Vérifications du dossier foncier
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {land.landChecklist.map((item) => (
                    <div key={item.label}>
                      <div className="text-label-sm text-on-surface-variant">{item.label}</div>
                      <div className="font-label-md text-on-surface flex items-center gap-1.5 mt-1">
                        <Icon
                          name={item.status === "ok" ? "verified" : "warning"}
                          className={cn(
                            "text-[18px]",
                            item.status === "ok" ? "text-secondary" : "text-laterite",
                          )}
                        />
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {land.disputeRisk && (
              <div
                className={cn(
                  "flex gap-3 p-space-lg rounded-xl border",
                  land.disputeRisk.level === "faible" &&
                    "bg-secondary-fixed/20 border-secondary/30 text-on-surface",
                  land.disputeRisk.level === "modere" &&
                    "bg-laterite/10 border-laterite/40 text-on-surface",
                  land.disputeRisk.level === "eleve" && "bg-error/10 border-error/40 text-on-surface",
                )}
              >
                <Icon
                  name={land.disputeRisk.level === "faible" ? "shield" : "gpp_maybe"}
                  className={cn(
                    "text-[22px] shrink-0",
                    land.disputeRisk.level === "faible" && "text-secondary",
                    land.disputeRisk.level === "modere" && "text-laterite",
                    land.disputeRisk.level === "eleve" && "text-error",
                  )}
                />
                <div>
                  <div className="font-label-md font-bold mb-1">
                    Risque de litige :{" "}
                    {land.disputeRisk.level === "faible"
                      ? "Faible"
                      : land.disputeRisk.level === "modere"
                        ? "Modéré"
                        : "Élevé"}
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{land.disputeRisk.note}</p>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-surface-container-low rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <div className="text-headline-md text-primary font-bold">{land.priceLabel}</div>
              <p className="text-body-sm text-on-surface-variant">
                Prix affiché pour {land.areaLabel} — {land.pricePerSqmLabel}. Dossier foncier
                consultable sur rendez-vous auprès de la Conservation Foncière compétente.
              </p>
              <Link
                href="/diaspora"
                className="bg-primary text-on-primary py-3 rounded-xl font-label-md text-center hover:bg-forest-deep transition-all shadow-sm"
              >
                Demander une vérification terrain
              </Link>
              <LandFavoriteButton land={land} />
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
