// Real hover mega-menus for the primary nav, one entry per `NAV_LINKS` path
// key in components/layout/header.tsx. Every link below points at a filter,
// anchor or page that genuinely exists and genuinely changes what the target
// page shows (query params consumed by lib/property-filters.ts and each
// page's own searchParams parsing, or a real in-page section id) — none of
// this is decorative, unlike a plain visual copy of a reference site's menu.

export interface NavMenuLink {
  label: string;
  href: string;
  icon: string;
}

export interface NavMenuColumn {
  title: string;
  links: NavMenuLink[];
}

export interface NavMenuHighlight {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface NavMenuContent {
  columns: NavMenuColumn[];
  highlight: NavMenuHighlight;
}

const acheterTypeHref = (type: string) => `/acheter?type=${encodeURIComponent(type)}`;
const acheterProvinceHref = (province: string) => `/acheter?province=${encodeURIComponent(province)}`;
const louerTypeHref = (type: string) => `/louer?type=${encodeURIComponent(type)}`;
const louerProvinceHref = (province: string) => `/louer?province=${encodeURIComponent(province)}`;
const terrainsProvinceHref = (province: string) => `/terrains?province=${encodeURIComponent(province)}`;

export const NAV_MEGA_MENUS: Record<string, NavMenuContent> = {
  acheter: {
    columns: [
      {
        title: "Type de bien",
        links: [
          { label: "Villa & Résidence", href: acheterTypeHref("Villa & Résidence"), icon: "villa" },
          { label: "Appartement de standing", href: acheterTypeHref("Appartement de standing"), icon: "apartment" },
          { label: "Terrain constructible", href: acheterTypeHref("Terrain constructible"), icon: "landscape" },
          { label: "Immeuble commercial", href: acheterTypeHref("Immeuble commercial"), icon: "business" },
        ],
      },
      {
        title: "Provinces populaires",
        links: [
          { label: "Estuaire", href: acheterProvinceHref("Estuaire"), icon: "landscape" },
          { label: "Ogooué-Maritime", href: acheterProvinceHref("Ogooué-Maritime"), icon: "waves" },
          { label: "Haut-Ogooué", href: acheterProvinceHref("Haut-Ogooué"), icon: "terrain" },
          { label: "Woleu-Ntem", href: acheterProvinceHref("Woleu-Ntem"), icon: "forest" },
        ],
      },
    ],
    highlight: {
      icon: "calculate",
      eyebrow: "Outil gratuit",
      title: "Simulateur de prêt immobilier",
      description: "Estimez votre capacité d'emprunt et vos mensualités avant de contacter une banque.",
      href: "/acheter#simulateur-pret",
      cta: "Simuler mon prêt",
    },
  },
  louer: {
    columns: [
      {
        title: "Type de logement",
        links: [
          { label: "Appartement", href: louerTypeHref("Appartement"), icon: "apartment" },
          { label: "Maison", href: louerTypeHref("Maison"), icon: "house" },
          { label: "Studio", href: louerTypeHref("Studio"), icon: "king_bed" },
          { label: "Villa", href: louerTypeHref("Villa"), icon: "villa" },
          { label: "Meublé", href: louerTypeHref("Meublé"), icon: "weekend" },
        ],
      },
      {
        title: "Où louer",
        links: [
          { label: "Libreville", href: louerProvinceHref("Estuaire"), icon: "location_city" },
          { label: "Ogooué-Maritime", href: louerProvinceHref("Ogooué-Maritime"), icon: "waves" },
          { label: "Haut-Ogooué", href: louerProvinceHref("Haut-Ogooué"), icon: "terrain" },
        ],
      },
    ],
    highlight: {
      icon: "notifications_active",
      eyebrow: "Ogooué AI",
      title: "Créer une alerte locative",
      description: "Soyez notifié dès qu'un logement correspondant à vos critères est certifié.",
      href: "/louer#alerte-ai",
      cta: "Créer mon alerte",
    },
  },
  terrains: {
    columns: [
      {
        title: "Échelle de confiance foncière",
        links: [
          { label: "1. Coutumier Brut", href: "/terrains#echelle-confiance", icon: "error" },
          { label: "2. Attestation Légale", href: "/terrains#echelle-confiance", icon: "description" },
          { label: "3. Bornage Géomètre", href: "/terrains#echelle-confiance", icon: "straighten" },
          { label: "4. Permis d'Occuper", href: "/terrains#echelle-confiance", icon: "shield" },
          { label: "5. Titre Foncier", href: "/terrains#echelle-confiance", icon: "verified" },
        ],
      },
      {
        title: "Provinces",
        links: [
          { label: "Estuaire", href: terrainsProvinceHref("Estuaire"), icon: "landscape" },
          { label: "Moyen-Ogooué", href: terrainsProvinceHref("Moyen-Ogooué"), icon: "water_drop" },
          { label: "Woleu-Ntem", href: terrainsProvinceHref("Woleu-Ntem"), icon: "forest" },
        ],
      },
    ],
    highlight: {
      icon: "verified_user",
      eyebrow: "Sécurité juridique",
      title: "Comprendre le foncier gabonais",
      description: "Notre échelle en 5 niveaux garantit un achat sans litige coutumier ou domanial.",
      href: "/terrains#echelle-confiance",
      cta: "Voir l'échelle de confiance",
    },
  },
  neuf: {
    columns: [
      {
        title: "Ce que nous préparons",
        links: [
          { label: "Passeport Ogooué pour le neuf", href: "/neuf#a-venir", icon: "badge" },
          { label: "Vérification des promoteurs", href: "/neuf#a-venir", icon: "domain_verification" },
          { label: "Suivi des paiements échelonnés", href: "/neuf#a-venir", icon: "payments" },
        ],
      },
    ],
    highlight: {
      icon: "construction",
      eyebrow: "En préparation",
      title: "Programmes neufs (VEFA)",
      description: "Soyez averti dès l'ouverture du marketplace du neuf vérifié Ogooué Shield.",
      href: "/neuf#notifier",
      cta: "Être notifié",
    },
  },
  professionnels: {
    columns: [
      {
        title: "Pourquoi rejoindre le réseau",
        links: [
          { label: "Toucher les acheteurs de la diaspora", href: "/professionnels#pourquoi", icon: "public" },
          { label: "La confiance Ogooué Shield", href: "/professionnels#pourquoi", icon: "verified_user" },
          { label: "Un tableau de bord dédié", href: "/professionnels#pourquoi", icon: "insights" },
        ],
      },
    ],
    highlight: {
      icon: "handshake",
      eyebrow: "Agences & promoteurs",
      title: "Rejoignez le réseau de partenaires",
      description: "Exposez vos annonces à la diaspora gabonaise et gagnez le badge Ogooué Shield.",
      href: "/professionnels#rejoindre",
      cta: "Devenir partenaire",
    },
  },
  "ogooue-diaspora": {
    columns: [
      {
        title: "Un achat sans les risques habituels",
        links: [
          { label: "Visites vidéo en direct", href: "/diaspora#pourquoi", icon: "videocam" },
          { label: "Passeport Ogooué & Ogooué Shield", href: "/diaspora#pourquoi", icon: "verified_user" },
          { label: "Réseau d'agences locales", href: "/diaspora#pourquoi", icon: "groups" },
          { label: "Procuration à distance", href: "/diaspora#pourquoi", icon: "edit_document" },
        ],
      },
    ],
    highlight: {
      icon: "public",
      eyebrow: "Ogooué Diaspora",
      title: "Investir depuis l'étranger",
      description: "Un conseiller qui connaît vos contraintes de distance et de fuseau horaire.",
      href: "/diaspora#demande",
      cta: "Démarrer ma demande",
    },
  },
  "ogooue-ai": {
    columns: [
      {
        title: "Filtres rapides",
        links: [
          { label: "Villa & Maison", href: "/recherche?villa=1", icon: "villa" },
          { label: "Budget 50-250M FCFA", href: "/recherche?budget=1", icon: "payments" },
          { label: "4+ Chambres", href: "/recherche?chambres=1", icon: "king_bed" },
          { label: "Surface > 300m²", href: "/recherche?surface=1", icon: "straighten" },
        ],
      },
      {
        title: "Confort & confiance",
        links: [
          { label: "Certifié Ogooué Shield", href: "/recherche?shield=1", icon: "verified" },
          { label: "Piscine", href: "/recherche?piscine=1", icon: "pool" },
          { label: "Vue panoramique", href: "/recherche?vue=1", icon: "water" },
        ],
      },
    ],
    highlight: {
      icon: "travel_explore",
      eyebrow: "Carte interactive",
      title: "Explorer la carte des biens",
      description: "Visualisez chaque bien certifié directement sur la carte du Gabon.",
      href: "/recherche#carte",
      cta: "Explorer la carte",
    },
  },
};
