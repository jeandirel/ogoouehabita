import Link from "next/link";
import { Icon } from "@/components/ui/icon";

// Exact 4-item list from the Stitch source's footer (fixed 4-row column
// aligned against "Liens Rapides"/"Administratif & Légal") — intentionally
// not expanded to all 9 real provinces, see STITCH_IMPLEMENTATION.md.
const PROVINCES = ["Estuaire", "Haut-Ogooué", "Ogooué-Maritime", "Woleu-Ntem"];

const QUICK_LINKS = [
  { label: "Acheter", href: "/acheter" },
  { label: "Louer", href: "/louer" },
  { label: "Ogooué Diaspora", href: "/diaspora" },
  { label: "Ogooué AI", href: "/recherche" },
];

const LEGAL_LINKS = [
  { label: "Mentions Légales", href: "/legal/mentions-legales" },
  { label: "Politique de Confidentialité", href: "/legal/confidentialite" },
  { label: "Registre Foncier National", href: "/terrains" },
  { label: "Aide & FAQ", href: "/aide" },
];

export function Footer() {
  return (
    <footer className="w-full bg-forest-deep py-space-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-space-lg mb-space-xl">
        <div className="flex flex-col gap-space-sm">
          <div className="font-headline-sm text-on-primary font-bold">Ogooué Habitat</div>
          <p className="text-body-sm text-on-primary/75">
            La plateforme nationale de confiance immobilière du Gabon.
          </p>
          <div className="flex items-center gap-space-xs mt-2 bg-on-primary/10 p-2 rounded-xl w-fit">
            <Icon name="verified" className="text-ogooue-gold" />
            <span className="text-label-sm font-bold text-on-primary">
              Ogooué Shield Certifié
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-space-xs">
          <div className="text-label-md font-bold text-on-primary mb-2">Provinces</div>
          {PROVINCES.map((province) => (
            <Link
              key={province}
              className="text-body-sm text-on-primary/75 hover:text-ogooue-gold transition-colors"
              href={`/recherche?province=${encodeURIComponent(province)}`}
            >
              {province}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-space-xs">
          <div className="text-label-md font-bold text-on-primary mb-2">Liens Rapides</div>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              className="text-body-sm text-on-primary/75 hover:text-ogooue-gold transition-colors"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-space-xs">
          <div className="text-label-md font-bold text-on-primary mb-2">
            Administratif &amp; Légal
          </div>
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              className="text-body-sm text-on-primary/75 hover:text-ogooue-gold transition-colors"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-space-md border-t border-on-primary/10 text-center text-on-primary/60 text-body-sm">
        © 2024 Ogooué Habitat. Tous droits réservés.
      </div>
    </footer>
  );
}
