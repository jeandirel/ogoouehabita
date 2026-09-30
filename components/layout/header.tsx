"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useLeads } from "@/data/local/leads-store";
import { usePublishedListings } from "@/data/local/published-listings-store";
import { NAV_MEGA_MENUS } from "@/data/nav-menu";

const PRIMARY_LINKS = [
  { path: "acheter", href: "/acheter", label: "Acheter" },
  { path: "louer", href: "/louer", label: "Louer" },
  { path: "terrains", href: "/terrains", label: "Terrains" },
  { path: "neuf", href: "/neuf", label: "Neuf" },
] as const;

const DISCOVER_LINKS = [
  { href: "/recherche", label: "Recherche & Ogooué AI", icon: "travel_explore" },
  { href: "/diaspora", label: "Ogooué Diaspora", icon: "public" },
  { href: "/professionnels", label: "Professionnels", icon: "apartment" },
  { href: "/agences", label: "Agences partenaires", icon: "groups" },
  { href: "/aide", label: "Aide & FAQ", icon: "help" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const publishedListings = usePublishedListings();
  const leads = useLeads();
  const accountHref = publishedListings.length > 0 ? "/mes-annonces" : leads.length > 0 ? "/mes-demandes" : "/connexion";
  const menuContent = activeMenu ? NAV_MEGA_MENUS[activeMenu] : undefined;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/70 bg-surface/95 shadow-header backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8 xl:px-10">
        <Link className="group flex shrink-0 flex-col leading-none" href="/" aria-label="Ogooué Habitat — Accueil">
          <span className="font-headline-sm font-extrabold tracking-[-0.045em] text-primary sm:text-headline-md">Ogooué Habitat</span>
          <span className="mt-1 h-px w-8 bg-secondary transition-all group-hover:w-full" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {PRIMARY_LINKS.map((link) => (
            <div key={link.path} className="relative" onMouseEnter={() => setActiveMenu(link.path)}>
              <Link href={link.href} className={cn("inline-flex items-center rounded-lg px-3 py-2 text-label-md font-semibold transition-colors", isActive(pathname, link.href) || activeMenu === link.path ? "bg-primary-fixed text-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")}>{link.label}</Link>
            </div>
          ))}
          <div className="relative" onMouseEnter={() => setDiscoverOpen(true)} onMouseLeave={() => setDiscoverOpen(false)}>
            <button type="button" aria-expanded={discoverOpen} onClick={() => setDiscoverOpen((open) => !open)} className={cn("inline-flex items-center gap-1 rounded-lg px-3 py-2 text-label-md font-semibold transition-colors", DISCOVER_LINKS.some((link) => isActive(pathname, link.href)) || discoverOpen ? "bg-primary-fixed text-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")}>
              Découvrir <Icon name="expand_more" className="text-[18px]" />
            </button>
            {discoverOpen && <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-outline-variant/70 bg-surface p-2 shadow-2xl">
              {DISCOVER_LINKS.map((link) => <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-body-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-fixed text-primary"><Icon name={link.icon} className="text-[19px]" /></span>{link.label}</Link>)}
            </div>}
          </div>
        </nav>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          <Link href="/favoris" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"><Icon name="favorite" className="text-[19px]" /><span className="hidden xl:inline">Favoris</span></Link>
          <Link href={accountHref} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"><Icon name="account_circle" className="text-[20px]" /><span className="hidden xl:inline">Mon espace</span></Link>
          <Link href="/publier" className="ml-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-md font-bold text-on-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lg"><Icon name="add_home" className="text-[19px]" />Publier un bien</Link>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <Link href="/favoris" className="flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low" aria-label="Mes favoris"><Icon name="favorite" /></Link>
          <button type="button" aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary"><Icon name={mobileOpen ? "close" : "menu"} /></button>
        </div>
      </div>

      <div className="hidden border-t border-outline-variant/70 lg:block" onMouseLeave={() => setActiveMenu(null)}>
        {menuContent && <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_280px] gap-8 px-8 py-5 xl:px-10">
          <div className="grid grid-cols-2 gap-x-10 gap-y-5">
            {menuContent.columns.map((column) => <section key={column.title}><h2 className="mb-3 text-label-sm font-extrabold uppercase tracking-[0.13em] text-secondary">{column.title}</h2><div className="grid gap-1">{column.links.map((link) => <Link key={link.href} href={link.href} className="flex items-center gap-2 rounded-lg px-2 py-2 text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"><Icon name={link.icon} className="text-[18px] text-secondary" />{link.label}</Link>)}</div></section>)}
          </div>
          <Link href={menuContent.highlight.href} className="group rounded-2xl bg-primary p-5 text-on-primary shadow-lg transition-transform hover:-translate-y-0.5"><Icon name={menuContent.highlight.icon} className="mb-5 text-[25px] text-primary-fixed-dim" /><p className="text-label-sm font-bold uppercase tracking-wider text-primary-fixed-dim">{menuContent.highlight.eyebrow}</p><h2 className="mt-2 font-headline-sm font-bold">{menuContent.highlight.title}</h2><p className="mt-2 text-body-sm text-on-primary/75">{menuContent.highlight.description}</p><span className="mt-4 inline-flex items-center gap-1 text-label-md font-bold">{menuContent.highlight.cta}<Icon name="arrow_forward" className="text-[18px] transition-transform group-hover:translate-x-1" /></span></Link>
        </div>}
      </div>

      {mobileOpen && <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-outline-variant/70 bg-surface px-4 py-3 lg:hidden"><nav className="mx-auto grid max-w-lg gap-1" aria-label="Navigation mobile">
        {PRIMARY_LINKS.map((link) => <Link key={link.href} href={link.href} className={cn("rounded-xl px-4 py-3 text-body-md font-semibold", isActive(pathname, link.href) ? "bg-primary-fixed text-primary" : "text-on-surface")}>{link.label}</Link>)}
        <p className="px-4 pb-1 pt-5 text-label-sm font-extrabold uppercase tracking-[0.14em] text-on-surface-variant">Découvrir</p>
        {DISCOVER_LINKS.map((link) => <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-body-md font-medium text-on-surface-variant"><Icon name={link.icon} className="text-[20px] text-secondary" />{link.label}</Link>)}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-outline-variant/70 pt-4"><Link href={accountHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-3 text-label-md font-bold text-on-surface"><Icon name="account_circle" />Mon espace</Link><Link href="/publier" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-label-md font-bold text-on-primary"><Icon name="add_home" />Publier</Link></div>
      </nav></div>}
    </header>
  );
}