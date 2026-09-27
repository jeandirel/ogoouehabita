import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { HeroSearch } from "@/components/home/hero-search";
import { PropertyCard } from "@/components/property/property-card";
import { ProvinceCard } from "@/components/property/province-card";
import { Icon } from "@/components/ui/icon";
import { properties } from "@/data/properties";
import { provinces } from "@/data/provinces";
import { stitchImage } from "@/data/image-manifest";

const METRICS = [
  { value: "100%", label: "Titres Fonciers Vérifiés", color: "text-primary" },
  { value: "4 500+", label: "Biens Certifiés au Gabon", color: "text-secondary" },
  { value: "98.4%", label: "Taux de Satisfaction Diaspora", color: "text-laterite" },
  { value: "9", label: "Provinces Couvertes", color: "text-primary" },
];

export default function HomePage() {
  return (
    <SiteShell>
      <div className="flex flex-col w-full">
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-forest-deep text-on-primary">
          <div
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: `url('${stitchImage.misc_hero_ogooue_river_libreville.path}')` }}
            role="img"
            aria-label={stitchImage.misc_hero_ogooue_river_libreville.alt}
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-forest-deep via-forest-deep/60 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-space-xs px-4 py-2 rounded-full bg-primary-fixed/20 border border-primary-fixed-dim/30 backdrop-blur-md mb-6 shadow-sm">
              <Icon name="verified" className="text-primary-fixed-dim text-[18px]" />
              <span className="text-label-sm font-bold text-primary-fixed uppercase tracking-wider">
                Ogooué Shield Certifié • 100% Confiance Nationale
              </span>
            </div>
            <h1 className="text-headline-xl lg:text-[56px] lg:leading-[64px] font-bold max-w-4xl tracking-tight mb-6">
              Trouvez un bien. <span className="text-primary-fixed-dim">Vérifiez-le.</span> Vivez-y.
            </h1>
            <p className="text-body-lg max-w-2xl text-surface-variant mb-12">
              Découvrez des logements, terrains et opportunités immobilières partout au Gabon avec un
              niveau de confiance visible avant même votre première visite.
            </p>
            <HeroSearch />
          </div>
        </section>

        <section className="bg-surface-container-low py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {METRICS.map((metric) => (
              <div key={metric.label} className="flex flex-col items-center">
                <div className={`text-headline-lg font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-body-sm text-on-surface-variant mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-label-sm font-bold text-secondary uppercase tracking-widest mb-2">
                Sécurité Maximale
              </div>
              <h2 className="text-headline-lg text-on-surface font-bold">
                Biens vérifiés par Ogooué Shield™
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-md mt-4 md:mt-0">
              Chaque propriété subit une inspection notariale, un contrôle cadastral et une
              vérification d&apos;identité du propriétaire.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-ogooue-blue text-label-sm font-bold uppercase tracking-wider mb-4 w-fit">
                <Icon name="public" className="text-[16px]" /> Ogooué Diaspora™
              </div>
              <h2 className="text-headline-lg font-bold text-on-surface mb-6">
                Investissez au pays depuis Paris, Montréal ou Washington en toute sérénité.
              </h2>
              <p className="text-body-md text-on-surface-variant mb-8">
                Êtes-vous un Gabonais de l&apos;étranger souhaitant acquérir un bien immobilier ou un
                terrain au pays ? Ogooué Habitat déploie ses experts assermentés sur place pour vous
                représenter de A à Z.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <Icon name="videocam" />
                  </div>
                  <div>
                    <div className="font-headline-sm text-on-surface font-bold text-base">
                      Visite Vidéo Live
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      Visite guidée en direct avec votre conseiller expert.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                    <Icon name="description" />
                  </div>
                  <div>
                    <div className="font-headline-sm text-on-surface font-bold text-base">
                      Rapport Notarié
                    </div>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      Audit complet juridique et technique délivré sous 48h.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/diaspora"
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-md w-fit flex items-center gap-2"
              >
                <span>Découvrir le service Diaspora</span>
                <Icon name="arrow_forward" />
              </Link>
            </div>
            <div
              className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl bg-cover bg-center"
              style={{ backgroundImage: `url('${stitchImage.agencies_agent_immobilier_libreville.path}')` }}
              role="img"
              aria-label={stitchImage.agencies_agent_immobilier_libreville.alt}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent flex items-end p-8">
                <div className="text-on-primary">
                  <div className="text-label-sm uppercase tracking-wider text-primary-fixed-dim font-bold mb-1">
                    Accompagnement Sur-Mesure
                  </div>
                  <div className="text-headline-sm font-bold">
                    Sécurisation notariale de l&apos;acte de vente à distance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-label-sm font-bold text-secondary uppercase tracking-widest mb-2">
              Immersion Nationale
            </div>
            <h2 className="text-headline-lg font-bold text-on-surface mb-4">
              Explorer le Gabon par Province
            </h2>
            <p className="text-body-md text-on-surface-variant">
              De l&apos;effervescence urbaine de l&apos;Estuaire aux richesses forestières et
              côtières des 9 provinces.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {provinces.map((province) => (
              <ProvinceCard key={province.slug} province={province} />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 mb-12">
          <div className="bg-primary text-on-primary rounded-3xl p-8 lg:p-16 relative overflow-hidden shadow-xl">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/20 text-primary-fixed-dim text-label-sm font-bold uppercase tracking-wider mb-6">
                <Icon name="verified_user" className="text-[16px]" /> Transparence Totale
              </div>
              <h2 className="text-headline-lg lg:text-headline-xl font-bold mb-6">
                Ogooué Shield™ : Zéro compromis sur la sécurité immobilière.
              </h2>
              <p className="text-body-lg text-surface-variant mb-8">
                Fini les doubles ventes de terrains et les arnaques aux faux mandats. Notre protocole
                exclusif certifie chaque transaction auprès des conservations foncières nationales.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/terrains"
                  className="bg-primary-fixed text-on-primary-fixed px-8 py-4 rounded-xl font-label-md hover:bg-primary-fixed-dim transition-all shadow-md font-bold"
                >
                  Consulter le Registre Foncier
                </Link>
                <Link
                  href="/terrains"
                  className="bg-transparent text-on-primary border border-primary-fixed-dim/40 px-8 py-4 rounded-xl font-label-md hover:bg-surface/10 transition-all"
                >
                  Comment ça marche ?
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
