export interface FaqCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FaqArticle {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  popular?: boolean;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "recherche",
    title: "Rechercher un bien",
    description: "Filtres, carte interactive, certification Ogooué Shield et échelle foncière.",
    icon: "travel_explore",
  },
  {
    id: "annonces",
    title: "Publier & mes annonces",
    description: "Déposer une annonce gratuitement et suivre son statut de vérification.",
    icon: "campaign",
  },
  {
    id: "compte",
    title: "Mon compte & mes demandes",
    description: "Favoris, demandes de visite et alertes conservés sur cet appareil.",
    icon: "account_circle",
  },
  {
    id: "confiance",
    title: "Confiance, sécurité & diaspora",
    description: "Passeport Ogooué, caution locative et vérification à distance.",
    icon: "verified_user",
  },
];

export const FAQ_PRO_LINKS = [
  {
    title: "Professionnels & agences",
    description:
      "Agences et promoteurs : exposez vos annonces à la diaspora et rejoignez le réseau de partenaires Ogooué Shield.",
    icon: "handshake",
    href: "/professionnels",
  },
  {
    title: "Programmes neufs (VEFA)",
    description: "Référencez vos programmes en construction et soyez notifié en avant-première.",
    icon: "apartment",
    href: "/neuf",
  },
];

export const FAQ_ARTICLES: FaqArticle[] = [
  {
    id: "recherche-ogooue-ai",
    categoryId: "recherche",
    question: "Comment fonctionne la recherche avancée « Ogooué AI » ?",
    answer:
      "Sur /recherche, filtrez par type de bien, budget, nombre de chambres, surface minimale, certification Ogooué Shield ou équipements (piscine, vue panoramique), puis triez les résultats par prix. La carte interactive permet de zoomer, de changer de couche (satellite, cadastre) et de vous géolocaliser réellement pour situer les biens autour de vous.",
    popular: true,
  },
  {
    id: "recherche-badge-shield",
    categoryId: "recherche",
    question: "Que signifie le badge « Certifié Ogooué Shield » sur une annonce ?",
    answer:
      "Ce badge n'apparaît que sur les annonces d'agences dont le numéro RCCM a été renseigné et vérifié dans notre répertoire partenaire. Les annonces publiées directement par des particuliers depuis /publier affichent au contraire, en toute transparence, la mention « Vendeur particulier — annonce en cours de vérification » tant qu'aucune vérification équivalente n'a eu lieu.",
    popular: true,
  },
  {
    id: "recherche-echelle-fonciere",
    categoryId: "recherche",
    question: "Comment fonctionne l'échelle de confiance foncière à 5 niveaux ?",
    answer:
      "Chaque terrain est classé de 1 (« Coutumier Brut », transmission orale sans acte enregistré) à 5 (titre foncier définitif et bornage contradictoire réalisé). La fiche de chaque terrain détaille un dossier de vérification concret : attestation villageoise, bornage contradictoire, certificat de non-litige, quitus fiscal foncier et, le cas échéant, un niveau de risque de litige (faible / modéré / élevé) avec une explication en clair.",
  },
  {
    id: "recherche-provinces",
    categoryId: "recherche",
    question: "Puis-je filtrer les biens par province et par ville ?",
    answer:
      "Oui. /acheter et /louer proposent une sélection de localisation groupée par les 9 provinces du Gabon, et le pied de page permet d'accéder directement à une recherche pré-filtrée par province depuis n'importe quelle page.",
  },
  {
    id: "annonces-publier",
    categoryId: "annonces",
    question: "Comment publier un bien sur Ogooué Habitat ?",
    answer:
      "Rendez-vous sur /publier et décrivez votre bien en quelques minutes : type de transaction, localisation, prix, surface et photos. La publication est gratuite. Votre annonce est immédiatement visible sur cet appareil, marquée « en cours de vérification » le temps que l'équipe Ogooué Shield l'examine.",
    popular: true,
  },
  {
    id: "annonces-badge",
    categoryId: "annonces",
    question: "Pourquoi mon annonce affiche « Vendeur particulier — en cours de vérification » ?",
    answer:
      "C'est une mention honnête plutôt qu'une fausse certification : tant que votre dossier n'a pas été audité comme le sont les annonces d'agences partenaires (numéro RCCM vérifié), l'annonce reste identifiée comme non encore vérifiée. Elle reste par contre pleinement visible et contactable.",
  },
  {
    id: "annonces-retrouver",
    categoryId: "annonces",
    question: "Où retrouver les annonces que j'ai publiées ?",
    answer:
      "Sur /mes-annonces, avec un lien direct vers la fiche publique de chaque annonce. Ces données sont conservées uniquement dans ce navigateur, sur cet appareil — elles disparaîtraient si vous videz les données de navigation de ce site.",
  },
  {
    id: "annonces-prix",
    categoryId: "annonces",
    question: "La publication d'une annonce est-elle payante ?",
    answer: "Non, déposer une annonce sur Ogooué Habitat est entièrement gratuit.",
  },
  {
    id: "compte-obligatoire",
    categoryId: "compte",
    question: "Ai-je besoin d'un compte pour publier ou contacter un vendeur ?",
    answer:
      "Non. Publier une annonce, réserver une visite ou contacter une agence ne nécessite aucune inscription : chaque appareil reçoit un identifiant anonyme local. Un compte (/connexion, /inscription) reste disponible mais ce projet fonctionne aujourd'hui comme un environnement de démonstration, sans session serveur réelle.",
  },
  {
    id: "compte-donnees",
    categoryId: "compte",
    question: "Où sont conservées mes données (favoris, demandes, annonces) ?",
    answer:
      "Uniquement dans le stockage local de votre navigateur, sur cet appareil — jamais sur un serveur distant. Voir /legal/confidentialite pour le détail complet du traitement.",
    popular: true,
  },
  {
    id: "compte-mes-demandes",
    categoryId: "compte",
    question: "Qu'est-ce que « Mes demandes » ?",
    answer:
      "/mes-demandes regroupe toutes vos démarches : demandes de visite ou de contact sur un bien, candidature Ogooué Diaspora, demande de partenariat professionnel, inscription à la liste d'attente Ogooué Neuf et alertes IA sur /louer.",
  },
  {
    id: "compte-supprimer",
    categoryId: "compte",
    question: "Comment supprimer mes favoris ou mes demandes ?",
    answer:
      "Un favori se retire en cliquant à nouveau sur son cœur. Il n'existe pas encore de suppression individuelle pour les demandes envoyées ; pour tout effacer d'un coup, videz les données de navigation stockées pour ce site depuis les réglages de votre navigateur.",
  },
  {
    id: "confiance-passeport",
    categoryId: "confiance",
    question: "Qu'est-ce que le Passeport Ogooué ?",
    answer:
      "Un dossier de vérification par étapes (identité, contact, localisation, bien, photos, mandat, documentation, administration) affiché avec un score de confiance sur /bien/[slug]/passeport. Il n'est disponible que pour les biens disposant d'un dossier complet — jamais généré artificiellement pour une annonce qui n'a pas été auditée.",
    popular: true,
  },
  {
    id: "confiance-caution",
    categoryId: "confiance",
    question: "Que signifie la caution demandée pour une location ?",
    answer:
      "Chaque annonce en location affiche sa caution réelle, généralement 1 à 3 mois de loyer plus un mois d'avance selon que le bien est meublé ou non — la convention du marché locatif gabonais. Cette information apparaît directement dans le panneau de contact de l'annonce, avant toute prise de contact.",
    popular: true,
  },
  {
    id: "confiance-diaspora",
    categoryId: "confiance",
    question: "Comment fonctionne le service Ogooué Diaspora ?",
    answer:
      "Conçu pour les Gabonais de l'étranger : visite vidéo en direct avec un agent certifié, mise en relation avec des agences partenaires locales, et un audit terrain (bornes GPS, riverains, chefs de quartier) pour vérifier un bien sans avoir à vous déplacer. La demande se fait depuis /diaspora.",
  },
  {
    id: "confiance-litige",
    categoryId: "confiance",
    question: "Que faire si un terrain affiche un risque de litige élevé ?",
    answer:
      "Considérez-le comme un signal d'alerte réel, pas un détail secondaire : consultez le détail du dossier foncier affiché (bornage, quitus fiscal, certificat de non-litige), faites vérifier la parcelle sur place via /diaspora si vous êtes à distance, et faites-vous systématiquement accompagner d'un notaire avant toute transaction.",
  },
];
