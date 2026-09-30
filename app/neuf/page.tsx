import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { NotifyForm } from "@/components/neuf/notify-form";
import { stitchImage } from "@/data/image-manifest";

export const metadata: Metadata = {
  title: "Programmes immobiliers neufs (VEFA)",
  description:
    "Découvrez les futurs programmes immobiliers neufs au Gabon et soyez notifié en avant-première, avec Passeport Ogooué et vérification des promoteurs.",
};

const UPCOMING = [
  {
    icon: "badge",
    title: "Passeport Ogooué pour les programmes neufs",
    description:
      "Chaque programme en construction (VEFA) disposera de son propre Passeport Ogooué : permis de construire vérifié, avancement des travaux et conformité du promoteur.",
  },
  {
    icon: "domain_verification",
    title: "Vérification systématique des promoteurs",
    description:
      "Ogooué Shield étendra son contrôle aux promoteurs et constructeurs : capacité financière, références de chantiers antérieurs et respect des délais.",
  },
  {
    icon: "payments",
    title: "Suivi des paiements échelonnés",
    description:
      "Un tableau de bord dédié permettra de suivre chaque appel de fonds lié à l'avancement réel du chantier, pour sécuriser les versements progressifs.",
  },
];

export default function NeufPage() {
  return (
    <SiteShell>
      <div className="flex flex-col w-full bg-surface">
        {/* Hero */}
        <section id="notifier" className="relative w-full min-h-[440px] bg-primary flex items-center overflow-hidden scroll-mt-24">
          <div
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: `url('${stitchImage.misc_hero_foret_vers_terrain_defriche.path}')` }}
            role="img"
            aria-label={stitchImage.misc_hero_foret_vers_terrain_defriche.alt}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-14 lg:py-16 flex flex-col items-start">
            <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface/10 backdrop-blur-md text-surface mb-6 border border-surface/20">
              <Icon name="construction" className="text-primary-fixed-dim text-[18px]" />
              <span className="text-label-sm font-medium tracking-wide">Ogooué Neuf — en préparation</span>
            </div>
            <h1 className="font-headline-lg text-surface max-w-3xl tracking-tight mb-4">
              Bientôt : le marketplace du neuf vérifié au Gabon.
            </h1>
            <p className="text-body-lg text-surface-variant max-w-2xl font-light mb-7">
              Ogooué Habitat construit actuellement un espace dédié aux programmes immobiliers
              neufs (VEFA) : logements sur plan, résidences en construction et promoteurs
              certifiés Ogooué Shield. Inscrivez-vous pour être averti dès l&apos;ouverture.
            </p>
            <div className="w-full max-w-xl">
              <NotifyForm />
            </div>
          </div>
        </section>

        {/* What's coming */}
        <section id="a-venir" className="w-full py-14 px-6 lg:px-10 max-w-7xl mx-auto scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
              Ce qui arrive
            </div>
            <h2 className="font-headline-lg text-on-surface">Ce que nous préparons pour vous</h2>
            <p className="text-body-md text-on-surface-variant mt-4">
              Le neuf pose des questions spécifiques : qui est le promoteur, où en est le chantier,
              et comment sécuriser des paiements échelonnés ? Voici ce sur quoi nous travaillons.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {UPCOMING.map((item) => (
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
      </div>
    </SiteShell>
  );
}
