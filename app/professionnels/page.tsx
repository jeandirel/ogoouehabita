import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { PartnerForm } from "@/components/professionnels/partner-form";
import { stitchImage } from "@/data/image-manifest";

export const metadata: Metadata = {
  title: "Espace professionnels & agences",
  description:
    "Agences et promoteurs : exposez vos annonces à la diaspora gabonaise et bénéficiez de la certification Ogooué Shield sur Ogooué Habitat.",
};

const VALUE_PROPS = [
  {
    icon: "public",
    title: "Touchez les acheteurs de la diaspora",
    description:
      "Vos annonces sont exposées directement aux Gabonais de l'étranger via Ogooué Diaspora, un vivier d'acheteurs et locataires souvent difficile à atteindre depuis une simple vitrine locale.",
  },
  {
    icon: "verified_user",
    title: "La confiance Ogooué Shield",
    description:
      "La certification Ogooué Shield rassure les acquéreurs sur l'authenticité de vos dossiers et accélère la prise de décision, notamment pour les transactions à distance.",
  },
  {
    icon: "insights",
    title: "Un tableau de bord pour piloter vos annonces",
    description:
      "Centralisez la gestion de vos biens publiés, suivez les demandes de contact et de visite reçues, et gardez une vue d'ensemble sur l'état de vérification de chaque dossier.",
  },
];

export default function ProfessionnelsPage() {
  return (
    <SiteShell>
      <div className="flex flex-col w-full bg-surface">
        {/* Hero */}
        <section className="relative w-full min-h-[430px] bg-primary flex items-center overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: `url('${stitchImage.agencies_agent_immobilier_libreville.path}')` }}
            role="img"
            aria-label={stitchImage.agencies_agent_immobilier_libreville.alt}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-14 lg:py-16">
            <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface/10 backdrop-blur-md text-surface mb-6 border border-surface/20">
              <Icon name="apartment" className="text-primary-fixed-dim text-[18px]" />
              <span className="text-label-sm font-medium tracking-wide">
                Ogooué Habitat pour les professionnels
              </span>
            </div>
            <h1 className="font-headline-lg text-surface max-w-3xl tracking-tight mb-4">
              Développez votre activité d&apos;agence sur la plateforme nationale de référence.
            </h1>
            <p className="text-body-lg text-surface-variant max-w-2xl font-light">
              Agences immobilières, notaires et promoteurs : rejoignez le réseau de partenaires
              certifiés Ogooué Habitat et gagnez la confiance d&apos;acheteurs locaux comme
              expatriés.
            </p>
          </div>
        </section>

        {/* Value props */}
        <section id="pourquoi" className="w-full py-14 px-6 lg:px-10 max-w-7xl mx-auto scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
              Pourquoi rejoindre le réseau
            </div>
            <h2 className="font-headline-lg text-on-surface">Ce que le partenariat vous apporte</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUE_PROPS.map((item) => (
              <div key={item.title} className="border border-outline-variant/60 bg-surface p-space-lg rounded-xl flex flex-col gap-space-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name={item.icon} className="text-primary text-[24px]" />
                </div>
                <h3 className="font-headline-sm text-on-surface">{item.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partner form */}
        <section id="rejoindre" className="w-full bg-surface-container-low py-16 px-6 lg:px-10 scroll-mt-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary w-fit text-label-sm font-bold">
                <Icon name="handshake" className="text-[18px]" /> Devenir partenaire
              </div>
              <h2 className="font-headline-lg text-on-surface tracking-tight">
                Parlons de votre agence.
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Laissez-nous vos coordonnées : notre équipe partenariats revient vers vous pour
                étudier l&apos;intégration de votre portefeuille de biens et la certification
                Ogooué Shield de vos dossiers.
              </p>
            </div>
            <PartnerForm />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
