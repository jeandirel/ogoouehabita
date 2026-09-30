import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { AcheterResults } from "@/components/acheter/acheter-results";
import { LoanSimulator } from "@/components/acheter/loan-simulator";
import { properties } from "@/data/properties";
import { PROVINCE_QUICK_LINKS } from "@/data/provinces";
import { GABON_GEOGRAPHY, formatVilleLabel } from "@/data/gabon-geography";
import { ACHETER_TYPE_OPTIONS } from "@/data/property-types";
import { parseBudgetLabel } from "@/lib/format";
import { matchesAcheterFilters } from "@/lib/property-filters";
import { stitchImage } from "@/data/image-manifest";

export const metadata: Metadata = {
  title: "Acheter un bien immobilier au Gabon",
  description:
    "Villas, appartements et terrains à vendre au Gabon, vérifiés Ogooué Shield. Filtrez par ville, budget et type de bien sur Ogooué Habitat.",
};

const ACHETER_SLUGS = [
  "villa-architecte-akanda",
  "appartement-standing-vue-mer-batterie-iv",
  "terrain-constructible-titre-port-gentil",
];

const PROPERTY_TYPES = ACHETER_TYPE_OPTIONS;

const CITY_TILES = [
  {
    name: "Libreville",
    countLabel: "1 420 biens disponibles",
    image: stitchImage.cities_libreville_skyline_dusk,
  },
  {
    name: "Akanda",
    countLabel: "680 biens disponibles",
    image: stitchImage.cities_akanda_residentiel,
  },
  {
    name: "Port-Gentil",
    countLabel: "410 biens disponibles",
    image: stitchImage.cities_port_gentil_port,
  },
  {
    name: "Franceville",
    countLabel: "240 biens disponibles",
    image: stitchImage.cities_franceville_savane,
  },
];

const BUYING_GUIDE = [
  {
    step: 1,
    title: "Vérifier le Titre Foncier",
    description:
      "Assurez-vous de l'authenticité du morcellement et de l'absence d'hypothèque ou de litige familial auprès de la Conservation Foncière.",
  },
  {
    step: 2,
    title: "Le Rôle du Notaire",
    description:
      "Au Gabon, la signature de l'acte authentique de vente devant un notaire est obligatoire pour acter le transfert de propriété.",
  },
  {
    step: 3,
    title: "Anticiper les Frais Annexes",
    description:
      "Prévoyez environ 8% à 10% du montant du bien pour couvrir les droits d'enregistrement, les honoraires du notaire et les frais de mutation.",
  },
];

export default async function AcheterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ville = typeof params.ville === "string" ? params.ville : undefined;
  const province = typeof params.province === "string" ? params.province : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;
  const budget = parseBudgetLabel(typeof params.budget === "string" ? params.budget : undefined);
  const q = typeof params.q === "string" ? params.q.toLowerCase().trim() : undefined;

  const filters = { ville, province, type, budget, q };
  const listings = properties.filter((property) => ACHETER_SLUGS.includes(property.slug));
  const filtered = listings.filter((property) => matchesAcheterFilters(property, filters));
  const isFiltered = Boolean(ville || province || type || budget || q);

  return (
    <SiteShell>
      <div className="portal-page">
        {/* Search-first header */}
        <section className="relative w-full border-b border-outline-variant/20 bg-primary text-on-primary overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('${stitchImage.misc_hero_rainforest_canopy.path}')` }}
            role="img"
            aria-label={stitchImage.misc_hero_rainforest_canopy.alt}
          />
          <div className="portal-container relative z-10 flex flex-col gap-5 py-8 sm:py-10">
            <div className="flex items-center gap-space-sm">
              <Icon name="verified" className="text-secondary-fixed" />
              <span className="text-label-sm text-primary-fixed-dim uppercase tracking-[0.14em] font-extrabold">
                Registre Foncier National
              </span>
            </div>
            <div className="max-w-2xl">
              <h1 className="font-headline-xl text-on-primary tracking-[-0.04em]">
                Achetez avec confiance.
              </h1>
              <p className="mt-2 text-body-md text-on-primary/75">
                Découvrez des biens vérifiés partout au Gabon.
              </p>
            </div>
            <form
              action="/acheter"
              className="portal-panel mt-1 grid grid-cols-1 gap-1 p-2 text-on-surface md:grid-cols-2 xl:grid-cols-5"
            >
              <div className="flex min-h-14 flex-col justify-center rounded-xl px-3 py-2 hover:bg-surface-container-low">
                <label className="text-label-sm text-on-surface-variant font-bold mb-1">
                  Localisation
                </label>
                <div className="flex items-center gap-2">
                  <Icon name="location_on" className="text-secondary" />
                  <select
                    name="ville"
                    defaultValue={ville ?? ""}
                    className="portal-input"
                  >
                    <option value="">Toutes les villes</option>
                    {GABON_GEOGRAPHY.map((province) => (
                      <optgroup key={province.name} label={province.name}>
                        {province.villes.map((v) => (
                          <option key={v.name} value={v.name}>
                            {formatVilleLabel(v)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex min-h-14 flex-col justify-center rounded-xl px-3 py-2 hover:bg-surface-container-low">
                <label className="text-label-sm text-on-surface-variant font-bold mb-1">
                  Type de bien
                </label>
                <div className="flex items-center gap-2">
                  <Icon name="home" className="text-secondary" />
                  <select
                    name="type"
                    defaultValue={type ?? ""}
                    className="portal-input"
                  >
                    <option value="">Tous les types</option>
                    {PROPERTY_TYPES.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex min-h-14 flex-col justify-center rounded-xl px-3 py-2 hover:bg-surface-container-low">
                <label className="text-label-sm text-on-surface-variant font-bold mb-1">
                  Budget max (FCFA)
                </label>
                <div className="flex items-center gap-2">
                  <Icon name="payments" className="text-secondary" />
                  <input
                    name="budget"
                    className="portal-input"
                    type="text"
                    defaultValue={typeof params.budget === "string" ? params.budget : ""}
                  />
                </div>
              </div>
              <div className="flex min-h-14 flex-col justify-center rounded-xl px-3 py-2 hover:bg-surface-container-low">
                <label className="text-label-sm text-on-surface-variant font-bold mb-1">
                  Ogooué AI Query
                </label>
                <div className="flex items-center gap-2">
                  <Icon name="neurology" className="text-laterite" />
                  <input
                    name="q"
                    defaultValue={typeof params.q === "string" ? params.q : ""}
                    className="portal-input"
                    placeholder="Ex: Villa sécurisée avec piscine à Akanda..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center p-1">
                <button
                  type="submit"
                  className="w-full min-h-14 bg-primary text-on-primary py-3 px-space-md rounded-xl font-label-md hover:bg-forest-deep transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Icon name="search" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Verified properties */}
        <section className="portal-container py-8 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="portal-eyebrow">
                Résultats à acheter
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
                {filtered.length} bien{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
              </h2>
            </div>
            <Link
              className="text-body-sm font-bold text-secondary hover:underline flex items-center gap-1"
              href="/recherche"
            >
              <span>Carte et filtres avancés</span>
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
          <AcheterResults curated={filtered} filters={filters} isFiltered={isFiltered} />
        </section>

        {/* Explorer par ville */}
        <section className="bg-surface-container-low py-space-xl px-6 lg:px-12 my-space-xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-space-lg">
              <span className="text-label-md text-secondary uppercase font-bold tracking-wider">
                Dynamique Urbaine
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
                Explorer par ville
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2">
                Trouvez votre prochaine adresse dans les principaux pôles économiques du Gabon.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
              {CITY_TILES.map((city) => (
                <Link
                  key={city.name}
                  href={`/acheter?ville=${encodeURIComponent(city.name)}`}
                  className="relative h-48 rounded-xl overflow-hidden group cursor-pointer shadow-sm block"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${city.image.path}')` }}
                    role="img"
                    aria-label={city.image.alt}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                    <h3 className="font-headline-sm text-on-primary">{city.name}</h3>
                    <p className="text-body-sm text-primary-fixed">{city.countLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 9 provinces */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-space-lg gap-4">
            <div>
              <span className="text-label-md text-secondary uppercase font-bold tracking-wider">
                Territoire National
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
                Explorer les 9 provinces
              </h2>
            </div>
            <p className="text-body-sm text-on-surface-variant max-w-md">
              De l&apos;Estuaire au Woleu-Ntem, accédez au premier registre foncier unifié couvrant
              l&apos;ensemble du territoire gabonais.
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
            {PROVINCE_QUICK_LINKS.map((province) => (
              <Link
                key={province.slug}
                href={`/recherche?province=${encodeURIComponent(province.name)}`}
                className="p-4 bg-surface-container rounded-xl text-center hover:bg-primary hover:text-on-primary transition-all group flex flex-col items-center justify-center gap-2"
              >
                <Icon name={province.icon} className="text-secondary group-hover:text-on-primary" />
                <span className="text-label-md font-bold">{province.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Passeport Ogooué banner */}
        <section className="bg-primary text-on-primary py-16 px-6 lg:px-12 my-space-xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('${stitchImage.misc_registre_foncier_documents.path}')` }}
            role="img"
            aria-label={stitchImage.misc_registre_foncier_documents.alt}
          />
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-space-lg items-center">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <Icon name="shield_lock" className="text-secondary-fixed" />
                <span className="text-label-md text-primary-fixed uppercase tracking-wider">
                  Sécurité Juridique Absolue
                </span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-primary">
                Biens avec Passeport Ogooué
              </h2>
              <p className="text-body-lg text-primary-fixed-dim">
                Chaque bien certifié dispose d&apos;un Passeport Ogooué infalsifiable : vérification
                cadastrale, absence de litige foncier, conformité urbanistique et historique
                notarié garantis par l&apos;État.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Link
                  href="/bien/villa-r1-les-rapides/passeport"
                  className="bg-secondary-fixed text-on-secondary-fixed px-space-md py-3 rounded-xl font-label-md hover:bg-secondary-fixed-dim transition-all shadow-sm"
                >
                  En savoir plus sur le Passeport
                </Link>
              </div>
            </div>
            <div className="bg-surface/10 backdrop-blur-md p-space-lg rounded-xl border border-white/10 flex flex-col gap-4">
              {[
                "Vérification Cadastrale",
                "Absence de litige domanial",
                "Expertise technique & structurelle",
                "Authentification Notariée",
              ].map((label, index, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between ${index < arr.length - 1 ? "border-b border-white/10 pb-4" : ""}`}
                >
                  <span className="text-body-md text-primary-fixed">{label}</span>
                  <Icon name="check_circle" className="text-primary-fixed" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Loan simulator */}
        <section id="simulateur-pret" className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl scroll-mt-24">
          <LoanSimulator />
        </section>

        {/* Buying guide */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl">
          <div className="text-center max-w-xl mx-auto mb-space-lg">
            <span className="text-label-md text-laterite uppercase font-bold tracking-wider">
              Guide Immobilier
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
              Conseils pour acheter au Gabon
            </h2>
            <p className="text-body-md text-on-surface-variant mt-2">
              Maîtrisez les étapes clés de l&apos;acquisition immobilière en toute sérénité.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {BUYING_GUIDE.map((item) => (
              <div
                key={item.step}
                className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-headline-sm">
                  {item.step}
                </div>
                <h3 className="font-headline-sm text-primary">{item.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
