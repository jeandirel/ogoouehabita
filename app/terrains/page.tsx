import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { LandCard } from "@/components/land/land-card";
import { TrustLevelCard } from "@/components/land/trust-level-card";
import { lands, TRUST_LEVELS } from "@/data/land";
import { GABON_PROVINCE_NAMES } from "@/data/gabon-geography";
import { stitchImage } from "@/data/image-manifest";

const PROVINCES = GABON_PROVINCE_NAMES;
const ZONES = [
  "Ntoum (Km 27)",
  "Owendo (Port)",
  "Lambaréné (Adalbert)",
  "Libreville (Glass/Mindoubé)",
];

function parseBudget(value?: string) {
  if (!value) return undefined;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}

export default async function TerrainsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const province = typeof params.province === "string" ? params.province : undefined;
  const zone = typeof params.zone === "string" ? params.zone : undefined;
  const minArea = typeof params.minArea === "string" ? Number(params.minArea) : undefined;
  const maxBudget = parseBudget(typeof params.maxBudget === "string" ? params.maxBudget : undefined);

  const filtered = lands.filter((land) => {
    if (province && land.province !== province) return false;
    if (zone) {
      const zoneCity = zone.split(" (")[0];
      if (!land.location.includes(zoneCity)) return false;
    }
    if (minArea && !Number.isNaN(minArea)) {
      const area = Number(land.areaLabel.replace(/[^\d]/g, ""));
      if (area < minArea) return false;
    }
    if (maxBudget && land.priceValue > maxBudget) return false;
    return true;
  });

  return (
    <SiteShell>
      <div className="flex flex-col w-full">
        {/* Hero */}
        <section className="relative w-full bg-forest-deep text-on-primary py-16 px-6 lg:px-12 overflow-hidden">
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('${stitchImage.misc_hero_foret_vers_terrain_defriche.path}')` }}
            role="img"
            aria-label={stitchImage.misc_hero_foret_vers_terrain_defriche.alt}
          />
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="flex items-center gap-2">
                <span className="bg-laterite text-on-primary text-label-sm px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                  Cadastre &amp; Foncier National
                </span>
                <span className="text-primary-fixed-dim text-label-sm font-medium">
                  Répertoire Officiel Gabon
                </span>
              </div>
              <h1 className="text-headline-xl text-on-primary tracking-tight">
                Le foncier, avec plus de transparence.
              </h1>
              <p className="text-body-lg text-surface-variant max-w-xl">
                Sécurisez l&apos;acquisition de vos parcelles et terrains bâtissables à travers le
                Gabon grâce à notre système de certification par niveau de confiance et nos
                géomètres agréés.
              </p>
            </div>
            <form
              action="/terrains"
              className="lg:col-span-5 bg-surface p-6 rounded-xl shadow-xl text-on-surface"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-headline-sm text-primary font-bold">Recherche Foncière</div>
                <Icon name="explore" className="text-secondary" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
                      Province
                    </label>
                    <select
                      name="province"
                      defaultValue={province ?? PROVINCES[0]}
                      className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
                    >
                      {PROVINCES.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
                      Ville / Zone
                    </label>
                    <select
                      name="zone"
                      defaultValue={zone ?? ZONES[0]}
                      className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
                    >
                      {ZONES.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
                      Surface Min (m²)
                    </label>
                    <input
                      name="minArea"
                      className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
                      placeholder="ex: 500"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="text-label-sm font-medium text-on-surface-variant mb-1 block">
                      Budget Max (FCFA)
                    </label>
                    <input
                      name="maxBudget"
                      className="w-full bg-sand border-0 rounded-xl p-3 text-body-sm text-on-surface focus:ring-2 focus:ring-ogooue-blue"
                      placeholder="ex: 15.000.000"
                      type="text"
                    />
                  </div>
                </div>
                <button
                  className="mt-2 w-full bg-primary text-on-primary py-3 rounded-xl font-label-md flex items-center justify-center gap-2 hover:bg-forest-deep transition-colors shadow-sm"
                  type="submit"
                >
                  <Icon name="search" className="text-[18px]" />
                  Explorer les terrains certifiés
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Map + parcels */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-label-md text-laterite uppercase tracking-widest font-bold mb-1">
                Cartographie &amp; Parcelles
              </div>
              <h2 className="text-headline-lg text-on-surface font-bold">
                Sélection de terrains viabilisés &amp; bornés
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-body-sm text-on-surface-variant">Affichage:</span>
              <button className="bg-surface-container-high px-4 py-2 rounded-xl text-label-md font-bold text-primary shadow-sm">
                Grille
              </button>
              <button className="bg-surface text-on-surface-variant px-4 py-2 rounded-xl text-label-md font-medium">
                Vue Satellite Active
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-surface-container-low p-6 rounded-xl flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-headline-sm text-on-surface font-bold">Carte Foncier Live</div>
                <Icon name="satellite_alt" className="text-secondary animate-pulse" />
              </div>
              <div
                className="w-full h-72 rounded-xl bg-cover bg-center shadow-inner relative overflow-hidden"
                style={{ backgroundImage: `url('${stitchImage.misc_carte_illustrative_libreville.path}')` }}
                role="img"
                aria-label={stitchImage.misc_carte_illustrative_libreville.alt}
              >
                <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-label-sm font-bold text-primary flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-laterite" /> Zone Ntoum Km 27 (14
                  parcelles)
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Survolez les polygones cadastraux pour vérifier instantanément le statut juridique,
                les coordonnées Lambert et l&apos;accès routier.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <span className="text-label-sm text-on-surface-variant">
                  Dernière synchro cadastre
                </span>
                <span className="text-label-sm font-bold text-primary">Il y a 2h</span>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.length > 0 ? (
                filtered.map((land) => <LandCard key={land.slug} land={land} />)
              ) : (
                <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 text-center text-body-md text-on-surface-variant">
                  Aucun terrain ne correspond à ces critères pour le moment.{" "}
                  <Link href="/terrains" className="text-primary font-bold hover:underline">
                    Réinitialiser la recherche
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust ladder */}
        <section className="bg-surface-container py-16 px-6 lg:px-12 w-full my-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-label-md text-laterite uppercase tracking-widest font-bold mb-2">
                Sécurité Juridique
              </div>
              <h2 className="text-headline-lg text-on-surface font-bold">
                Comprendre le niveau de confiance foncière
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2">
                Notre échelle de certification en 5 niveaux garantit un achat sans litige coutumier
                ou domanial au Gabon.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {TRUST_LEVELS.map((level) => (
                <TrustLevelCard key={level.level} level={level} />
              ))}
            </div>
          </div>
        </section>

        {/* Diaspora CTA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
          <div className="bg-forest-deep text-on-primary rounded-xl p-8 lg:p-12 relative overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div
              className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-cover bg-center pointer-events-none"
              style={{ backgroundImage: `url('${stitchImage.diaspora_diaspora_verification_terrain.path}')` }}
              role="img"
              aria-label={stitchImage.diaspora_diaspora_verification_terrain.alt}
            />
            <div className="lg:col-span-7 relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="bg-secondary text-on-secondary text-label-sm px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                  Service Diaspora
                </span>
              </div>
              <h2 className="text-headline-lg text-on-primary">
                Faites vérifier un terrain sur place sans vous déplacer.
              </h2>
              <p className="text-body-lg text-surface-variant">
                Vous résidez en France, aux États-Unis ou ailleurs ? Nos experts assermentés se
                rendent sur le terrain au Gabon pour effectuer un audit visuel, interroger les
                riverains, vérifier les bornes GPS et vous délivrer un rapport certifié de 40
                points.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/diaspora"
                  className="bg-laterite text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-opacity-90 transition-all shadow-sm"
                >
                  Demander une vérification terrain
                </Link>
                <Link
                  href="/diaspora"
                  className="bg-surface/10 hover:bg-surface/20 text-on-primary px-6 py-3 rounded-xl font-label-md transition-all"
                >
                  Télécharger un exemple de Passeport
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative z-10 bg-surface/10 backdrop-blur-md p-6 rounded-xl border border-surface/20 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                  <Icon name="verified_user" />
                </div>
                <div>
                  <div className="font-headline-sm text-on-primary">Garantie Anti-Litige</div>
                  <div className="text-body-sm text-surface-variant">
                    Couverture notariale incluse
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-2 text-body-sm text-surface-variant">
                <div className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-primary-fixed-dim text-[18px]" /> Rapport
                  vidéo HD par drone
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-primary-fixed-dim text-[18px]" />{" "}
                  Certification des coordonnées par géomètre
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-primary-fixed-dim text-[18px]" />{" "}
                  Entretien avec les chefs de quartier
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
