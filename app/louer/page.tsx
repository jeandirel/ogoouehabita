import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { LouerResults } from "@/components/louer/louer-results";
import { NeighborhoodCard } from "@/components/neighborhood/neighborhood-card";
import { RecentListingRow } from "@/components/property/recent-listing-row";
import { AiAlertForm } from "@/components/louer/ai-alert-form";
import { properties } from "@/data/properties";
import { neighborhoods } from "@/data/neighborhoods";
import { recentListings } from "@/data/recent-listings";
import { LOUER_TYPE_OPTIONS } from "@/data/property-types";
import { GABON_GEOGRAPHY } from "@/data/gabon-geography";
import { parseBudgetLabel } from "@/lib/format";
import { matchesLouerFilters } from "@/lib/property-filters";
import { stitchImage } from "@/data/image-manifest";

const LOUER_SLUGS = [
  "standing-superieur-vue-mer-batterie-iv",
  "villa-contemporaine-jardin-louis",
  "studio-standing-equipe-glass",
];

const QUICK_FILTERS = [
  { label: "Appartement", icon: "apartment" },
  { label: "Maison", icon: "house" },
  { label: "Studio", icon: "king_bed" },
  { label: "Villa", icon: "villa" },
  { label: "Meublé", icon: "weekend" },
];

const PROPERTY_TYPES = LOUER_TYPE_OPTIONS;

// Real Gabon-wide ville coverage, grouped by province — same
// `GABON_GEOGRAPHY`-backed pattern as /acheter and /terrains, so "Localisation
// ou Quartier" isn't limited to Libreville + 2 hardcoded cities anymore.
// Libreville itself is excluded here since it keeps its own curated quartier
// list above (neighborhoods.ts); every other real ville (including other
// Estuaire villes like Akanda/Owendo/Ntoum) is grouped under its province.
const OTHER_PROVINCE_GROUPS = GABON_GEOGRAPHY.map((province) => ({
  province: province.name,
  villes: province.villes.filter((ville) => ville.name !== "Libreville"),
})).filter((group) => group.villes.length > 0);

const BUDGETS = [
  "Indifférent",
  "250 000 FCFA",
  "500 000 FCFA",
  "1 000 000 FCFA",
  "2 000 000+ FCFA",
];

export default async function LouerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : undefined;
  const quartier = typeof params.quartier === "string" ? params.quartier : undefined;
  const province = typeof params.province === "string" ? params.province : undefined;
  const budget = parseBudgetLabel(typeof params.budget === "string" ? params.budget : undefined);

  const LIBREVILLE_OPTIONS = [
    { value: "", label: "Libreville (Tous les quartiers)" },
    ...neighborhoods.map((n) => ({ value: n.slug, label: `${n.name} (Libreville)` })),
  ];

  const locationIncludes = quartier
    ? (neighborhoods.find((n) => n.slug === quartier)?.name ?? quartier)
    : undefined;
  const filters = { type, locationIncludes, province, budget };
  const listings = properties.filter((property) => LOUER_SLUGS.includes(property.slug));
  const filtered = listings.filter((property) => matchesLouerFilters(property, filters));

  return (
    <SiteShell>
      <div className="flex flex-col w-full">
        {/* Hero */}
        <section className="relative w-full min-h-[580px] bg-primary flex items-center justify-center -mt-20 pt-20 overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: `url('${stitchImage.misc_hero_libreville_drone_dusk.path}')` }}
            role="img"
            aria-label={stitchImage.misc_hero_libreville_drone_dusk.alt}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface/10 backdrop-blur-md text-surface mb-6 border border-surface/20">
              <Icon name="verified" className="text-primary-fixed-dim text-[18px]" />
              <span className="text-label-sm font-medium tracking-wide">
                Registre National des Locations Certifiées
              </span>
            </div>
            <h1 className="font-headline-xl text-surface max-w-4xl tracking-tight mb-6">
              Trouvez plus qu&apos;un logement. <span className="text-primary-fixed-dim">Trouvez votre place.</span>
            </h1>
            <p className="text-body-lg text-surface-variant max-w-2xl mb-10 font-light">
              Accédez aux meilleures opportunités immobilières en location au Gabon, vérifiées et
              garanties sans intermédiaires abusifs.
            </p>
            <form
              action="/louer"
              className="w-full max-w-4xl bg-surface p-4 rounded-xl shadow-2xl flex flex-col lg:flex-row gap-3"
            >
              <div className="flex-1 flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-lg">
                <Icon name="location_on" className="text-secondary" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-label-sm text-on-surface-variant font-medium">
                    Localisation ou Quartier
                  </span>
                  <select
                    name="quartier"
                    defaultValue={quartier ?? ""}
                    className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer"
                  >
                    <optgroup label="Libreville">
                      {LIBREVILLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                    {OTHER_PROVINCE_GROUPS.map((group) => (
                      <optgroup key={group.province} label={group.province}>
                        {group.villes.map((ville) => (
                          <option key={ville.name} value={ville.name}>
                            {ville.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-lg">
                <Icon name="home" className="text-secondary" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-label-sm text-on-surface-variant font-medium">
                    Type de bien
                  </span>
                  <select
                    name="type"
                    defaultValue={type ?? PROPERTY_TYPES[0]}
                    className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer"
                  >
                    {PROPERTY_TYPES.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-lg">
                <Icon name="payments" className="text-secondary" />
                <div className="flex flex-col text-left w-full">
                  <span className="text-label-sm text-on-surface-variant font-medium">
                    Budget Max / mois
                  </span>
                  <select
                    name="budget"
                    defaultValue={typeof params.budget === "string" ? params.budget : BUDGETS[0]}
                    className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer"
                  >
                    {BUDGETS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md hover:bg-forest-deep transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Icon name="search" />
                <span>Rechercher</span>
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <span className="text-surface-variant text-label-sm mr-2">Filtres rapides :</span>
              {QUICK_FILTERS.map((filter) => (
                <Link
                  key={filter.label}
                  href={`/louer?type=${encodeURIComponent(filter.label)}`}
                  className={`px-4 py-2 rounded-full text-surface text-label-sm transition-all border border-surface/20 backdrop-blur-sm flex items-center gap-1.5 ${
                    type === filter.label ? "bg-surface/30" : "bg-surface/10 hover:bg-surface/20"
                  }`}
                >
                  <Icon name={filter.icon} className="text-[16px]" /> {filter.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Verified listings */}
        <section className="w-full py-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
                Sélection rigoureuse
              </div>
              <h2 className="font-headline-lg text-on-surface">Annonces Vérifiées Ogooué Shield</h2>
            </div>
            <Link
              className="text-label-md text-primary font-bold hover:underline flex items-center gap-1 mt-4 md:mt-0"
              href="/recherche"
            >
              Voir toutes les locations <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>
          <LouerResults curated={filtered} filters={filters} />
        </section>

        {/* Passeport Locataire */}
        <section className="w-full bg-surface-container py-24 px-6 lg:px-12 my-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary w-fit text-label-sm font-bold">
                <Icon name="badge" className="text-[18px]" /> Innovation Ogooué Habitat
              </div>
              <h2 className="font-headline-xl text-on-surface tracking-tight">
                Créez votre <span className="text-secondary">Passeport Locataire</span> vérifié
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Démarquez-vous auprès des propriétaires bailleurs grâce à un dossier numérique
                infalsifiable, validé par nos services. Sécurisez votre location en 48 heures sans
                vous déplacer.
              </p>
              <div className="space-y-4 my-2">
                {[
                  {
                    step: 1,
                    title: "Téléchargez vos justificatifs",
                    text: "Pièce d'identité, justificatifs de revenus et garanties bancaires.",
                  },
                  {
                    step: 2,
                    title: "Certification Ogooué Shield",
                    text: "Nos équipes vérifient l'authenticité de vos documents en toute confidentialité.",
                  },
                  {
                    step: 3,
                    title: "Postulez en un clic",
                    text: "Envoyez votre passeport instantanément aux bailleurs de votre choix.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-on-surface mb-1">{item.title}</h4>
                      <p className="text-body-sm text-on-surface-variant">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  href="/inscription"
                  className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-label-md hover:bg-ogooue-blue transition-all shadow-md inline-flex items-center gap-2"
                >
                  <span>Générer mon Passeport Gratuitement</span>
                  <Icon name="arrow_forward" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-2xl blur-xl" />
              <div className="relative bg-surface p-8 rounded-2xl shadow-xl border border-outline-variant/20 flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-headline-sm">
                      JD
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-on-surface">Jean-Marc D.</h3>
                      <span className="text-label-sm text-secondary font-bold flex items-center gap-1">
                        <Icon name="verified" className="text-[16px]" /> Passeport Certifié N°OG-8921
                      </span>
                    </div>
                  </div>
                  <div className="bg-primary text-on-primary text-xs px-3 py-1.5 rounded-full font-bold">
                    Score 98/100
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-body-sm bg-surface-container-low p-3 rounded-lg">
                    <span className="text-on-surface-variant">Garantie Revenus</span>
                    <span className="font-bold text-on-surface">Validé (3.5x le loyer)</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm bg-surface-container-low p-3 rounded-lg">
                    <span className="text-on-surface-variant">Identité &amp; CNI</span>
                    <span className="font-bold text-primary flex items-center gap-1">
                      <Icon name="check_circle" className="text-[16px]" /> Vérifié
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm bg-surface-container-low p-3 rounded-lg">
                    <span className="text-on-surface-variant">Historique Locatif</span>
                    <span className="font-bold text-on-surface">Impeccable (3 ans sans incident)</span>
                  </div>
                </div>
                <div className="bg-secondary-fixed/30 p-4 rounded-xl flex items-center gap-3">
                  <Icon name="security" className="text-secondary text-[24px]" />
                  <p className="text-body-sm text-on-surface-variant">
                    Vos données sont cryptées et protégées selon les normes nationales de
                    confidentialité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="w-full py-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
              Cartographie Immobilière
            </div>
            <h2 className="font-headline-lg text-on-surface mb-4">Quartiers les plus recherchés</h2>
            <p className="text-body-md text-on-surface-variant">
              Explorez les zones résidentielles et d&apos;affaires les plus prisées du Grand
              Libreville.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {neighborhoods.map((neighborhood) => (
              <NeighborhoodCard key={neighborhood.slug} neighborhood={neighborhood} />
            ))}
          </div>
        </section>

        {/* Recently added */}
        <section className="w-full bg-surface-container-low py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
                  Nouveautés 24h
                </div>
                <h2 className="font-headline-lg text-on-surface">Locations récemment ajoutées</h2>
              </div>
              <Link
                className="text-label-md text-primary font-bold hover:underline flex items-center gap-1 mt-4 md:mt-0"
                href="/recherche"
              >
                Voir tout le flux <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentListings.map((listing) => (
                <RecentListingRow key={listing.slug} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* Ogooué AI alert */}
        <section className="w-full py-24 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="bg-primary text-on-primary rounded-2xl p-8 lg:p-16 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-6 max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 text-secondary-fixed text-label-sm font-bold w-fit">
                <Icon name="smart_toy" className="text-[18px]" /> Ogooué AI Assistant
              </div>
              <h2 className="font-headline-xl text-surface tracking-tight">
                Ne ratez plus aucune opportunité de location.
              </h2>
              <p className="text-body-lg text-surface-variant">
                Laissez notre intelligence artificielle analyser vos critères et vous alerter en
                temps réel dès qu&apos;un bien correspondant est certifié sur la plateforme.
              </p>
              <AiAlertForm />
            </div>
            <div className="relative z-10 bg-surface/10 backdrop-blur-md p-8 rounded-xl border border-surface/20 max-w-md w-full flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                  <Icon name="bolt" />
                </div>
                <div>
                  <h4 className="font-headline-sm text-surface text-base">
                    Alerte Instantanée Active
                  </h4>
                  <span className="text-label-sm text-primary-fixed-dim">
                    Correspondance en direct
                  </span>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-surface/10">
                <div className="flex justify-between text-body-sm">
                  <span className="text-surface-variant">Secteur :</span>
                  <span className="text-surface font-medium">Batterie IV / Louis</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-surface-variant">Type :</span>
                  <span className="text-surface font-medium">Appartement 3P</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-surface-variant">Budget Max :</span>
                  <span className="text-surface font-medium">800 000 FCFA</span>
                </div>
              </div>
              <div className="bg-primary-container p-3 rounded-lg flex items-center gap-3 text-surface text-body-sm">
                <Icon name="auto_awesome" className="text-primary-fixed-dim" />
                <span>12 nouvelles correspondances détectées cette semaine.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
