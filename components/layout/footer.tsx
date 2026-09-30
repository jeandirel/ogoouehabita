import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const PROVINCES = ["Estuaire", "Haut-Ogooué", "Ogooué-Maritime", "Woleu-Ntem"];
const EXPLORE_LINKS = [{ label: "Acheter", href: "/acheter" }, { label: "Louer", href: "/louer" }, { label: "Terrains", href: "/terrains" }, { label: "Recherche immobilière", href: "/recherche" }];
const SERVICE_LINKS = [{ label: "Ogooué Diaspora", href: "/diaspora" }, { label: "Agences partenaires", href: "/agences" }, { label: "Aide & FAQ", href: "/aide" }, { label: "Publier un bien", href: "/publier" }];
const LEGAL_LINKS = [{ label: "Mentions légales", href: "/legal/mentions-legales" }, { label: "Confidentialité", href: "/legal/confidentialite" }];

export function Footer() {
  return <footer className="mt-auto w-full bg-forest-deep text-on-primary">
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-11 sm:px-8 lg:grid-cols-[1.45fr_repeat(3,1fr)] lg:px-10">
      <div><Link href="/" className="font-headline-md font-extrabold tracking-[-0.04em]">Ogooué Habitat</Link><p className="mt-4 max-w-xs text-body-sm leading-6 text-on-primary/70">La plateforme immobilière gabonaise qui rend chaque projet plus clair, plus simple et mieux vérifié.</p><div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary-fixed-dim/20 bg-surface/10 px-3 py-2 text-label-sm font-bold"><Icon name="verified_user" className="text-[18px] text-primary-fixed-dim" />Ogooué Shield</div></div>
      <FooterColumn title="Explorer" links={EXPLORE_LINKS} />
      <FooterColumn title="Nos services" links={SERVICE_LINKS} />
      <div><h2 className="text-label-sm font-extrabold uppercase tracking-[0.14em] text-primary-fixed-dim">Par province</h2><div className="mt-4 grid gap-3">{PROVINCES.map((province) => <Link key={province} href={`/recherche?province=${encodeURIComponent(province)}`} className="text-body-sm text-on-primary/70 transition-colors hover:text-ogooue-gold">{province}</Link>)}</div></div>
    </div>
    <div className="border-t border-on-primary/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-body-sm text-on-primary/55 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><span>© 2024 Ogooué Habitat. Tous droits réservés.</span><div className="flex flex-wrap gap-x-5 gap-y-2">{LEGAL_LINKS.map((link) => <Link key={link.href} href={link.href} className="hover:text-ogooue-gold">{link.label}</Link>)}</div></div></div>
  </footer>;
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return <div><h2 className="text-label-sm font-extrabold uppercase tracking-[0.14em] text-primary-fixed-dim">{title}</h2><div className="mt-4 grid gap-3">{links.map((link) => <Link key={link.href} href={link.href} className="text-body-sm text-on-primary/70 transition-colors hover:text-ogooue-gold">{link.label}</Link>)}</div></div>;
}