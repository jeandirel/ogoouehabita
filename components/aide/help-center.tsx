"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { FAQ_ARTICLES, FAQ_CATEGORIES, FAQ_PRO_LINKS } from "@/data/faq";

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(DIACRITICS_PATTERN, "");
}

export function HelpCenter() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const normalizedQuery = normalize(query.trim());
  const activeCategoryData = FAQ_CATEGORIES.find((category) => category.id === activeCategory);

  // Deep link from the floating Aide & FAQ widget (`/aide#<article.id>`):
  // reuses the same search filter a visitor would type, so the target
  // article is guaranteed to render and expand, popular or not. Reading
  // window.location.hash post-mount (not derivable at render time) is why
  // this needs an effect rather than a lazy useState initializer.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const article = FAQ_ARTICLES.find((item) => item.id === hash);
    if (!article) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(article.question);
    setOpenId(article.id);
    const target = document.getElementById(article.id);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const filtered = useMemo(() => {
    return FAQ_ARTICLES.filter((article) => {
      if (activeCategory && article.categoryId !== activeCategory) return false;
      if (!normalizedQuery) return true;
      return (
        normalize(article.question).includes(normalizedQuery) ||
        normalize(article.answer).includes(normalizedQuery)
      );
    });
  }, [activeCategory, normalizedQuery]);

  const isDefaultView = !normalizedQuery && !activeCategory;
  const list = isDefaultView ? filtered.filter((article) => article.popular) : filtered;

  function selectCategory(id: string) {
    setActiveCategory((current) => (current === id ? null : id));
    setQuery("");
  }

  function reset() {
    setActiveCategory(null);
    setQuery("");
  }

  return (
    <>
      {/* Hero + search */}
      <section className="relative w-full bg-gradient-to-br from-forest-deep via-primary to-anthracite text-on-primary py-space-xl px-6 lg:px-12 overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center text-center gap-space-md">
          <span className="bg-secondary text-on-secondary text-label-sm px-3 py-1 rounded-full uppercase tracking-widest font-bold">
            Centre d&apos;aide
          </span>
          <h1 className="font-headline-xl text-on-primary tracking-tight">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-body-md text-primary-fixed-dim">
            Recherche, publication, confiance foncière, Passeport Ogooué… toutes les réponses sur le
            fonctionnement réel de la plateforme.
          </p>
          <div className="w-full max-w-xl relative mt-2">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveCategory(null);
              }}
              placeholder="Rechercher dans le centre d'aide…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface text-on-surface placeholder:text-on-surface-variant shadow-xl focus:outline-none focus:ring-4 focus:ring-secondary/40"
              aria-label="Rechercher dans le centre d'aide"
            />
          </div>
        </div>
      </section>

      {/* Professional shortcuts */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-space-lg w-full">
        <div className="text-label-md text-laterite uppercase tracking-widest font-bold mb-space-sm">
          Je suis un professionnel
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {FAQ_PRO_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-space-md bg-surface-container-low hover:bg-surface-container rounded-xl p-space-md transition-colors shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name={item.icon} className="text-primary" />
              </div>
              <div>
                <div className="font-label-md font-bold text-on-surface flex items-center gap-1">
                  {item.title}
                  <Icon
                    name="arrow_forward"
                    className="text-[16px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  />
                </div>
                <p className="text-body-sm text-on-surface-variant mt-1">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-space-lg w-full">
        <div className="text-label-md text-laterite uppercase tracking-widest font-bold mb-space-sm">
          Je suis un particulier
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {FAQ_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                aria-pressed={isActive}
                className={cn(
                  "text-left flex flex-col gap-space-sm rounded-xl p-space-md shadow-sm transition-all border",
                  isActive
                    ? "bg-primary text-on-primary border-primary shadow-lg -translate-y-0.5"
                    : "bg-surface border-outline-variant/30 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isActive ? "bg-surface/20" : "bg-secondary/10",
                  )}
                >
                  <Icon name={category.icon} className={isActive ? "text-on-primary" : "text-secondary"} />
                </div>
                <div className={cn("font-label-md font-bold", isActive ? "text-on-primary" : "text-on-surface")}>
                  {category.title}
                </div>
                <p
                  className={cn(
                    "text-body-sm",
                    isActive ? "text-primary-fixed-dim" : "text-on-surface-variant",
                  )}
                >
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ list */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-space-xl w-full">
        <div className="flex items-center justify-between mb-space-md flex-wrap gap-space-sm">
          <h2 className="font-headline-lg text-on-surface font-bold">
            {normalizedQuery
              ? `Résultats pour « ${query.trim()} »`
              : activeCategoryData
                ? activeCategoryData.title
                : "Articles les plus consultés"}
          </h2>
          {(activeCategory || normalizedQuery) && (
            <button type="button" onClick={reset} className="text-body-sm font-bold text-secondary hover:underline">
              Réinitialiser
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="bg-surface-container-low rounded-xl p-space-lg text-center text-body-md text-on-surface-variant">
            Aucune question ne correspond à « {query.trim()} » pour le moment. Essayez un autre
            mot-clé ou parcourez les catégories ci-dessus.
          </div>
        ) : (
          <div className="flex flex-col gap-space-sm">
            {list.map((article) => {
              const isOpen = openId === article.id;
              return (
                <div
                  key={article.id}
                  id={article.id}
                  className="bg-surface border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden scroll-mt-24"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : article.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-space-md p-space-md text-left"
                  >
                    <span className="font-label-md font-bold text-on-surface">{article.question}</span>
                    <Icon
                      name="expand_more"
                      className={cn(
                        "text-on-surface-variant text-[22px] shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180 text-primary",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-space-md pb-space-md text-body-sm text-on-surface-variant">
                        {article.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
