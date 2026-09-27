import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { TrustScoreGauge } from "@/components/passport/trust-score-gauge";
import { VerificationTimelineStep } from "@/components/passport/verification-timeline-step";
import { PASSPORT_TIMELINE, PASSPORT_META } from "@/data/passport-timeline";
import { properties } from "@/data/properties";

function passportEligible(property: (typeof properties)[number]) {
  return property.passportScore !== undefined && property.reference !== undefined;
}

export function generateStaticParams() {
  return properties.filter(passportEligible).map((property) => ({ slug: property.slug }));
}

export default async function PassportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property || !passportEligible(property)) notFound();

  return (
    <SiteShell>
      <div className="flex flex-col w-full bg-surface">
        {/* Hero */}
        <section className="relative w-full bg-primary text-on-primary py-space-xl px-6 lg:px-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-primary to-anthracite opacity-90" />
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-space-lg">
            <div className="flex flex-col gap-space-sm max-w-2xl">
              <div className="flex items-center gap-space-sm">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-label-sm font-bold tracking-wider uppercase">
                  Passeport Numérique Ogooué
                </span>
                <span className="text-primary-fixed-dim text-body-sm">• Réf: #{property.reference}</span>
              </div>
              <h1 className="font-headline-xl text-on-primary tracking-tight">{property.title}</h1>
              <p className="text-body-lg text-primary-fixed-dim">{property.location}</p>
            </div>
            <div className="bg-surface text-on-surface p-space-md rounded-xl shadow-xl flex items-center gap-space-md min-w-[280px]">
              <TrustScoreGauge score={property.passportScore!} />
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-forest-deep font-bold text-label-md">
                  <Icon name="verified" filled className="text-[18px]" />
                  {PASSPORT_META.trustLevelLabel}
                </div>
                <p className="text-body-sm text-on-surface-variant mt-1">{PASSPORT_META.verifiedOnLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <h2 className="font-headline-lg text-on-surface">Timeline de Vérification</h2>
              <p className="text-body-md text-on-surface-variant">
                Chaque étape du passeport est audité selon les critères rigoureux du registre foncier
                national.
              </p>
            </div>
            <div className="flex flex-col gap-space-md">
              {PASSPORT_TIMELINE.map((step) => (
                <VerificationTimelineStep key={step.key} step={step} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            <div className="bg-secondary-fixed/30 p-space-md rounded-xl flex flex-col gap-space-sm shadow-sm">
              <div className="flex items-center gap-space-sm text-secondary">
                <Icon name="info" className="text-[24px]" />
                <span className="font-headline-sm text-on-surface">Avis Juridique &amp; Portée</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Les documents examinés et les vérifications menées par Ogooué Habitat constituent un audit
                rigoureux de conformité et de présence, mais{" "}
                <strong>ne signifient pas une authenticité administrative garantie</strong> ou un titre
                foncier indérogeable émis par l&apos;administration publique.
              </p>
              <p className="text-body-sm text-on-surface-variant">
                Nous recommandons systématiquement l&apos;accompagnement d&apos;un notaire pour toute
                transaction finale.
              </p>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-md shadow-sm">
              <div
                className="w-full h-48 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url('${property.image.path}')` }}
                role="img"
                aria-label={property.image.alt}
              />
              <div className="flex flex-col gap-1">
                <span className="text-label-sm text-on-surface-variant">Propriété certifiée</span>
                <div className="font-headline-sm text-primary">{property.title}</div>
                <div className="text-body-md text-on-surface font-bold mt-1">{property.priceLabel}</div>
              </div>
              <Link
                className="w-full bg-primary text-on-primary py-space-sm rounded-xl font-label-md text-center hover:bg-forest-deep transition-all shadow-sm"
                href={`/bien/${property.slug}`}
              >
                Contacter le conseiller dédié
              </Link>
            </div>

            <div className="flex items-center gap-space-sm p-space-md bg-surface-container-low rounded-xl">
              <Icon name="verified_user" className="text-secondary text-[32px]" />
              <div className="flex flex-col">
                <span className="font-label-md font-bold text-on-surface">Ogooué Shield Protocol</span>
                <span className="text-body-sm text-on-surface-variant">
                  Standard national de transparence immobilière.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
