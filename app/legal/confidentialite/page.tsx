import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";

const SECTIONS = [
  { id: "donnees-collectees", label: "Données collectées" },
  { id: "utilisation", label: "Utilisation des données" },
  { id: "cookies-stockage-local", label: "Cookies & stockage local" },
  { id: "vos-droits", label: "Vos droits" },
  { id: "conservation", label: "Conservation & sécurité" },
  { id: "contact", label: "Nous contacter" },
];

export default function ConfidentialitePage() {
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
                Vos données
              </div>
              <h1 className="font-headline-xl text-on-surface tracking-tight">
                Politique de confidentialité
              </h1>
              <p className="text-body-sm text-on-surface-variant mt-3">
                Dernière mise à jour : 2024. Cette politique s&apos;applique au site et aux
                services Ogooué Habitat.
              </p>
            </div>

            <section id="donnees-collectees" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Données collectées</h2>
              <p className="text-body-md text-on-surface-variant">
                Nous collectons les catégories de données suivantes lorsque vous utilisez
                Ogooué Habitat :
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-2 text-body-md text-on-surface-variant">
                <li>
                  Informations de compte que vous saisissez volontairement (nom, email,
                  téléphone) lors d&apos;une inscription ou d&apos;une demande de contact ;
                </li>
                <li>
                  Historique de recherche immobilière (types de biens consultés, quartiers,
                  budgets) utilisé pour améliorer les résultats qui vous sont présentés ;
                </li>
                <li>
                  Favoris enregistrés, qui sont stockés uniquement dans le stockage local
                  (« localStorage ») de votre navigateur et ne sont jamais transmis à nos
                  serveurs ;
                </li>
                <li>
                  Contenu des formulaires de contact, de publication d&apos;annonce ou de demande
                  de partenariat que vous soumettez sur le site.
                </li>
              </ul>
            </section>

            <section id="utilisation" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Utilisation des données</h2>
              <p className="text-body-md text-on-surface-variant">
                Les données collectées servent exclusivement à faire fonctionner et améliorer la
                plateforme : mise en relation avec les agences partenaires, traitement des
                demandes de visite ou de contact, vérification des annonces dans le cadre
                d&apos;Ogooué Shield, et personnalisation des résultats de recherche. Nous ne
                vendons aucune donnée personnelle à des tiers.
              </p>
            </section>

            <section id="cookies-stockage-local" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Cookies &amp; stockage local</h2>
              <p className="text-body-md text-on-surface-variant">
                Le site utilise le stockage local de votre navigateur (« localStorage ») pour
                mémoriser vos biens favoris d&apos;une visite à l&apos;autre, sans créer de compte.
                Ces informations restent sur votre appareil et peuvent être effacées à tout moment
                en vidant les données de navigation de votre navigateur. Nous n&apos;utilisons pas
                de cookies publicitaires tiers.
              </p>
            </section>

            <section id="vos-droits" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Vos droits</h2>
              <p className="text-body-md text-on-surface-variant">
                Conformément à la loi n°001/2011 relative à la protection des données à caractère
                personnel en République Gabonaise, vous disposez d&apos;un droit d&apos;accès, de
                rectification, d&apos;opposition et de suppression concernant vos données
                personnelles détenues par Ogooué Habitat. Vous pouvez exercer ces droits à tout
                moment en nous contactant aux coordonnées indiquées ci-dessous.
              </p>
            </section>

            <section id="conservation" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Conservation &amp; sécurité</h2>
              <p className="text-body-md text-on-surface-variant">
                Les données transmises via nos formulaires sont conservées pour la durée
                nécessaire au traitement de votre demande, puis archivées ou supprimées
                conformément aux obligations légales applicables. Des mesures techniques et
                organisationnelles raisonnables sont mises en œuvre pour protéger vos données
                contre tout accès non autorisé.
              </p>
            </section>

            <section id="contact" className="flex flex-col gap-3 scroll-mt-24">
              <h2 className="font-headline-sm text-on-surface">Nous contacter</h2>
              <p className="text-body-md text-on-surface-variant">
                Pour toute question ou demande relative à vos données personnelles, contactez
                notre équipe à l&apos;adresse confidentialite@ogouehabitat.ga. Pour toute question
                d&apos;ordre général sur l&apos;éditeur du site, consultez nos{" "}
                <Link href="/legal/mentions-legales" className="text-primary font-bold hover:underline">
                  mentions légales
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
