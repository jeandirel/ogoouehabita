"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { usePublishedListings } from "@/data/local/published-listings-store";
import { useLeads } from "@/data/local/leads-store";
import { NAV_MEGA_MENUS } from "@/data/nav-menu";

const NAV_LINKS = [
  { path: "acheter", href: "/acheter", label: "Acheter" },
  { path: "louer", href: "/louer", label: "Louer" },
  { path: "terrains", href: "/terrains", label: "Terrains" },
  { path: "neuf", href: "/neuf", label: "Neuf" },
  { path: "professionnels", href: "/professionnels", label: "Professionnels" },
  { path: "ogooue-diaspora", href: "/diaspora", label: "Ogooué Diaspora" },
  { path: "ogooue-ai", href: "/recherche", label: "Ogooué AI" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [lastMenu, setLastMenu] = useState<string | null>(null);
  const publishedListings = usePublishedListings();
  const leads = useLeads();
  const accountHref =
    publishedListings.length > 0 ? "/mes-annonces" : leads.length > 0 ? "/mes-demandes" : "/connexion";

  function openMenu(path: string) {
    setActiveMenu(path);
    setLastMenu(path);
  }

  const menuOpen = activeMenu !== null;
  const menuContent = lastMenu ? NAV_MEGA_MENUS[lastMenu] : undefined;

  return (
    <header
      className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-header"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div className="flex flex-col">
          <Link
            className="font-headline-md text-primary tracking-tight font-bold"
            href="/"
          >
            Ogooué Habitat
          </Link>
          <div className="w-12 h-0.5 bg-secondary mt-1 rounded-full" />
        </div>
        <nav className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.href}
              onMouseEnter={() => openMenu(link.path)}
              className={cn(
                "relative py-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-secondary after:origin-center after:transition-transform after:duration-200",
                isActive(pathname, link.href) ? "text-primary font-bold after:scale-x-100" : "after:scale-x-0",
                activeMenu === link.path && "text-on-surface after:scale-x-100",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden xl:flex items-center gap-4">
          <Link
            className="flex items-center gap-1.5 border border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-colors text-label-sm font-bold px-3 py-1.5 rounded-full"
            href="/aide"
          >
            <Icon name="help" className="text-[16px]" />
            Aide &amp; FAQ
          </Link>
          <Link
            className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
            href="/favoris"
            aria-label="Mes favoris"
          >
            <Icon name="favorite" />
          </Link>
          <Link
            className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors font-medium"
            href="/connexion"
          >
            Connexion
          </Link>
          <Link
            className="bg-primary text-on-primary px-space-md py-space-sm rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm"
            href="/publier"
          >
            Publier un bien
          </Link>
          <Link
            href={accountHref}
            aria-label="Mon compte"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          >
            <Icon name="person" className="text-on-primary text-[18px]" />
          </Link>
        </div>
        <button
          type="button"
          className="xl:hidden p-2 text-on-surface"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Icon name={mobileOpen ? "close" : "menu"} />
        </button>
      </div>

      {/* Desktop hover mega-menu */}
      <div
        className={cn(
          "hidden xl:block absolute top-full left-0 w-full border-t border-outline-variant/30 bg-surface shadow-2xl transition-all duration-200 ease-out",
          menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        {menuContent && (
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-lg grid grid-cols-1 lg:grid-cols-[1fr_1fr_minmax(0,320px)] gap-space-xl">
            {menuContent.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-1">
                <div className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  {column.title}
                </div>
                {column.links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setActiveMenu(null)}
                    className="group/link flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all hover:translate-x-1"
                  >
                    <Icon
                      name={link.icon}
                      className="text-[20px] text-primary/70 group-hover/link:text-primary transition-colors"
                    />
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            {menuContent.columns.length === 1 && <div className="hidden lg:block" />}
            <Link
              href={menuContent.highlight.href}
              onClick={() => setActiveMenu(null)}
              className="group/highlight relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-forest-deep via-primary to-anthracite p-space-lg text-on-primary shadow-lg"
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full bg-surface/10 blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-2">
                <div className="w-11 h-11 rounded-full bg-surface/15 backdrop-blur-md flex items-center justify-center">
                  <Icon name={menuContent.highlight.icon} className="text-[22px]" />
                </div>
                <span className="text-label-sm font-bold uppercase tracking-wider text-primary-fixed-dim">
                  {menuContent.highlight.eyebrow}
                </span>
                <span className="text-headline-sm font-bold leading-tight">{menuContent.highlight.title}</span>
                <p className="text-body-sm text-surface-variant">{menuContent.highlight.description}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-label-md font-bold">
                  {menuContent.highlight.cta}
                  <Icon
                    name="arrow_forward"
                    className="text-[18px] transition-transform group-hover/highlight:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t border-outline-variant/30 bg-surface px-6 py-space-md flex flex-col gap-space-sm max-h-[calc(100vh-5rem)] overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-body-md text-on-surface-variant py-2",
                isActive(pathname, link.href) && "text-primary font-bold",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-space-sm pt-space-sm border-t border-outline-variant/30">
            <Link
              href="/favoris"
              onClick={() => setMobileOpen(false)}
              className="p-2 text-on-surface-variant"
              aria-label="Mes favoris"
            >
              <Icon name="favorite" />
            </Link>
            <Link
              href={accountHref}
              onClick={() => setMobileOpen(false)}
              className="text-body-sm text-on-surface-variant font-medium"
            >
              {accountHref === "/connexion" ? "Connexion" : "Mon compte"}
            </Link>
            <Link
              href="/aide"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1 text-body-sm text-on-surface-variant font-medium ml-auto"
            >
              <Icon name="help" className="text-[18px]" />
              Aide &amp; FAQ
            </Link>
          </div>
          <Link
            href="/publier"
            onClick={() => setMobileOpen(false)}
            className="bg-primary text-on-primary px-space-md py-space-sm rounded-xl font-label-md text-center"
          >
            Publier un bien
          </Link>
        </div>
      )}
    </header>
  );
}
