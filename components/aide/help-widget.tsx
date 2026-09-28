"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { FAQ_ARTICLES } from "@/data/faq";

const POPULAR_ARTICLES = FAQ_ARTICLES.filter((article) => article.popular).slice(0, 4);

// Global floating entry point, separate from the full /aide route (which
// stays untouched) — a lightweight shortcut mounted once in SiteShell.
export function HelpWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-anthracite/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Aide et FAQ"
        className={`fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-sm origin-bottom-right rounded-2xl bg-surface shadow-2xl border border-outline-variant/30 transition-all duration-200 ease-out ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-space-lg pt-space-lg pb-space-md">
          <div>
            <div className="text-label-sm text-secondary font-bold uppercase tracking-wider">
              Centre d&apos;aide
            </div>
            <div className="font-headline-sm text-on-surface">Une question ?</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-space-sm pb-space-sm">
          {POPULAR_ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={`/aide#${article.id}`}
              onClick={() => setOpen(false)}
              className="flex items-start gap-2.5 px-space-sm py-2.5 rounded-xl text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            >
              <Icon name="help_outline" className="text-[18px] text-primary/60 shrink-0 mt-0.5" />
              {article.question}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 px-space-lg pt-space-sm pb-space-lg border-t border-outline-variant/20">
          <Link
            href="/aide"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between text-label-md font-bold text-primary hover:underline"
          >
            Voir toute l&apos;aide
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
          <Link
            href="/recherche"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Icon name="travel_explore" className="text-[16px]" />
            Essayer Ogooué AI
          </Link>
          <a
            href="mailto:support@ogoouehabitat.ga"
            className="flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Icon name="mail" className="text-[16px]" />
            Contacter le support
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Fermer l'aide" : "Ouvrir l'aide et la FAQ"}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-surface hover:bg-surface-container-low border border-outline-variant/30 text-on-surface pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Icon name={open ? "close" : "chat_bubble"} className="text-[20px] text-primary" />
        <span className="text-label-md font-bold hidden sm:inline">Aide &amp; FAQ</span>
      </button>
    </>
  );
}
