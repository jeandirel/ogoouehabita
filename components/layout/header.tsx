"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

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

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-header">
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
              className={cn(
                "text-body-sm text-on-surface-variant hover:text-on-surface transition-colors",
                isActive(pathname, link.href) && "text-primary font-bold",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden xl:flex items-center gap-4">
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
            href="/connexion"
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
              href="/connexion"
              onClick={() => setMobileOpen(false)}
              className="text-body-sm text-on-surface-variant font-medium"
            >
              Connexion
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
