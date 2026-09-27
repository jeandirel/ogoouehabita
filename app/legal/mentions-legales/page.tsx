import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";

const SECTIONS = [
  { id: "editeur", label: "Éditeur du site" },
  { id: "hebergement", label: "Hébergement" },
  { id: "propriete-intellectuelle", label: "Propriété intellectuelle" },
  { id: "responsabilite", label: "Responsabilité" },
  { id: "liens", label: "Liens hypertextes" },
  { id: "droit-applicable", label: "Droit applicable" },
];

export default function MentionsLegalesPage() {
  return (
    <SiteShell>
      <div className="w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-space-xl">
          <nav className="hidden lg:block sticky top-28 self-start h-fit">
            <div className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              Sommaire
            </div>
            <ul className="flex flex-col gap-2">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-space-lg max-w-3xl">
            <div>
              <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
                Informations légales
              </div>
              <h1 className="font-headline-xl text-on-surface tracking-tight">Mentions légales</h1>
              <p className="text-body-sm text-on-surface-variant mt-3">Dernière mise à jour : 2024.</p>
            </div>

            <section id="editeur" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Éditeur du site</h2>
              <p className="text-body-md text-on-surface-variant">
                Le site Ogooué Habitat est édité par Ogooué Habitat SARL, société de droit
                gabonais au capital social variable, dont le siège social est situé à Libreville,
                province de l&apos;Estuaire, République Gabonaise. La société est immatriculée au
                Registre du Commerce et du Crédit Mobilier (RCCM) de Libreville et identifiée
                auprès de la Direction Générale des Impôts par un Numéro d&apos;Identification
                Fiscale (NIF).
              </p>
              <p className="text-body-md text-on-surface-variant">
                Directeur de la publication : la gérance d&apos;Ogooué Habitat SARL. Pour toute
                question relative au contenu du site, vous pouvez nous contacter à l&apos;adresse
                suivante : contact@ogouehabitat.ga.
              </p>
            </section>

            <section id="hebergement" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Hébergement</h2>
              <p className="text-body-md text-on-surface-variant">
                Le site est hébergé par un prestataire d&apos;hébergement cloud tiers, garantissant
                la disponibilité et la sécurité des données conformément aux standards
                internationaux en vigueur. Les coordonnées complètes de l&apos;hébergeur peuvent
                être communiquées sur simple demande écrite adressée à l&apos;éditeur du site.
              </p>
            </section>

            <section id="propriete-intellectuelle" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Propriété intellectuelle</h2>
              <p className="text-body-md text-on-surface-variant">
                L&apos;ensemble des éléments composant le site Ogooué Habitat (textes,
                illustrations, logos, marques, structure du site, base de données des annonces,
                identité visuelle « Passeport Ogooué » et « Ogooué Shield ») est protégé par le
                droit de la propriété intellectuelle et demeure la propriété exclusive d&apos;Ogooué
                Habitat SARL ou de ses partenaires, sauf mention contraire.
              </p>
              <p className="text-body-md text-on-surface-variant">
                Toute reproduction, représentation, modification ou exploitation totale ou
                partielle de ces éléments, par quelque procédé que ce soit, sans autorisation
                écrite préalable, est strictement interdite et constitue une contrefaçon
                sanctionnée par les textes en vigueur.
              </p>
            </section>

            <section id="responsabilite" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Responsabilité</h2>
              <p className="text-body-md text-on-surface-variant">
                Ogooué Habitat s&apos;efforce de fournir des informations aussi précises que
                possible sur les biens immobiliers présentés, notamment via les vérifications
                Ogooué Shield. Toutefois, l&apos;éditeur ne saurait être tenu responsable des
                omissions, inexactitudes ou carences dans la mise à jour des annonces, qu&apos;elles
                soient de son propre fait ou du fait des tiers (agences partenaires, vendeurs ou
                bailleurs) qui lui transmettent ces informations.
              </p>
              <p className="text-body-md text-on-surface-variant">
                Toute transaction immobilière doit faire l&apos;objet des vérifications d&apos;usage
                par les parties concernées, notamment auprès de la Conservation Foncière et d&apos;un
                notaire, avant tout engagement contractuel.
              </p>
            </section>

            <section id="liens" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Liens hypertextes</h2>
              <p className="text-body-md text-on-surface-variant">
                Le site peut contenir des liens vers des sites tiers (partenaires, agences,
                administrations). Ogooué Habitat n&apos;exerce aucun contrôle sur ces sites et
                décline toute responsabilité quant à leur contenu ou à leurs pratiques en matière
                de protection des données personnelles.
              </p>
            </section>

            <section id="droit-applicable" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Droit applicable</h2>
              <p className="text-body-md text-on-surface-variant">
                Les présentes mentions légales sont soumises au droit gabonais. Tout litige relatif
                à l&apos;utilisation du site relève de la compétence exclusive des juridictions
                gabonaises compétentes, sous réserve des dispositions d&apos;ordre public
                applicables.
              </p>
              <p className="text-body-md text-on-surface-variant">
                Pour toute question relative à la protection de vos données personnelles,
                consultez notre{" "}
                <Link href="/legal/confidentialite" className="text-primary font-bold hover:underline">
                  politique de confidentialité
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
