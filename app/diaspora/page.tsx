import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { DiasporaLeadForm } from "@/components/diaspora/diaspora-lead-form";
import { stitchImage } from "@/data/image-manifest";

export const metadata: Metadata = {
  title: "Service Diaspora — Investir depuis l'étranger",
  description:
    "Visites vidéo en direct, Passeport Ogooué et agences partenaires certifiées pour acheter un bien au Gabon en toute confiance depuis l'étranger.",
};

const VALUE_PROPS = [
  {
    icon: "videocam",
    title: "Visites vidéo en direct",
    description:
      "Un agent certifié vous fait visiter le bien en visioconférence, où que vous soyez, avec la possibilité de poser vos questions en temps réel.",
  },
  {
    icon: "verified_user",
    title: "Passeport Ogooué & Ogooué Shield",
    description:
      "Chaque bien proposé à la diaspora est vérifié : titre foncier authentifié, absence de litige et conformité du dossier avant toute transaction à distance.",
  },
  {
    icon: "groups",
    title: "Réseau d'agences locales de confiance",
    description:
      "Nous vous mettons en relation avec des agences partenaires certifiées, présentes sur le terrain à Libreville, Port-Gentil et Franceville.",
  },
  {
    icon: "account_balance",
    title: "Accompagnement notarié et paiement sécurisé",
    description:
      "Conseils sur les démarches notariales gabonaises et les circuits de paiement disponibles pour finaliser votre achat sans vous déplacer : virement bancaire notarié, ou Airtel Money / Moov Money pour les frais de dossier et acomptes.",
  },
  {
    icon: "edit_document",
    title: "Procuration à distance",
    description:
      "Vous ne pouvez pas signer en personne ? Nos conseillers vous expliquent comment établir une procuration notariée pour qu'un mandataire de confiance signe l'acte authentique en votre nom, sans que vous ayez à voyager.",
  },
];

export default function DiasporaPage() {
  return (
    <SiteShell>
      <div className="flex flex-col w-full bg-surface">
        {/* Hero */}
        <section className="relative w-full min-h-[520px] bg-primary flex items-center -mt-20 pt-20 overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage: `url('${stitchImage.diaspora_diaspora_verification_terrain.path}')`,
            }}
            role="img"
            aria-label={stitchImage.diaspora_diaspora_verification_terrain.alt}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
            <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface/10 backdrop-blur-md text-surface mb-6 border border-surface/20">
              <Icon name="public" className="text-primary-fixed-dim text-[18px]" />
              <span className="text-label-sm font-medium tracking-wide">Ogooué Diaspora</span>
            </div>
            <h1 className="font-headline-xl text-surface max-w-3xl tracking-tight mb-6">
              Investissez au Gabon depuis n&apos;importe où dans le monde.
            </h1>
            <p className="text-body-lg text-surface-variant max-w-2xl font-light">
              Ogooué Habitat a conçu un parcours d&apos;achat et de location entièrement pensé pour
              les Gabonais de l&apos;étranger : vérification à distance, agences partenaires de
              confiance et accompagnement notarié, pour investir sereinement au pays.
            </p>
          </div>
        </section>

        {/* Value props */}
        <section id="pourquoi" className="w-full py-20 px-6 lg:px-12 max-w-7xl mx-auto scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
              Pourquoi passer par Ogooué Diaspora
            </div>
            <h2 className="font-headline-lg text-on-surface">
              Un achat à distance, sans les risques habituels
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUE_PROPS.map((item) => (
              <div
                key={item.title}
                className="flex gap-space-md bg-surface-container-low p-space-lg rounded-2xl last:md:col-span-2"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} className="text-primary text-[24px]" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-on-surface mb-1.5">{item.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lead capture */}
        <section id="demande" className="w-full bg-surface-container py-24 px-6 lg:px-12 scroll-mt-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary w-fit text-label-sm font-bold">
                <Icon name="support_agent" className="text-[18px]" /> Conseillers dédiés diaspora
              </div>
              <h2 className="font-headline-xl text-on-surface tracking-tight">
                Un conseiller qui connaît vos contraintes de distance et de fuseau horaire.
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Décrivez votre projet ci-contre : nos conseillers dédiés à la diaspora
                s&apos;occupent de la mise en relation avec l&apos;agence certifiée la plus adaptée
                et organisent votre première visite vidéo.
              </p>
            </div>
            <DiasporaLeadForm />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
