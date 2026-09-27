export interface PassportStep {
  key: string;
  icon: string;
  title: string;
  description: string;
  proof?: { icon: string; text: string };
  validated: boolean;
}

export const PASSPORT_TIMELINE: PassportStep[] = [
  {
    key: "identite",
    icon: "badge",
    title: "IDENTITÉ",
    description:
      "Propriétaire / mandataire identifié formellement via pièce d'identité nationale officielle.",
    proof: { icon: "fingerprint", text: "CNIB vérifiée et croisée avec le fichier central." },
    validated: true,
  },
  {
    key: "contact",
    icon: "phone_iphone",
    title: "CONTACT",
    description:
      "Numéro de téléphone vérifié par code à usage unique (OTP) et test d'appel direct.",
    proof: { icon: "call", text: "Ligne active rattachée à l'opérateur agréé." },
    validated: true,
  },
  {
    key: "localisation",
    icon: "location_on",
    title: "LOCALISATION",
    description: "Coordonnées GPS et repérage cadastral minutieux effectués sur le terrain.",
    proof: { icon: "map", text: "Précision cartographique à moins de 3 mètres." },
    validated: true,
  },
  {
    key: "bien",
    icon: "home",
    title: "BIEN",
    description:
      "Présence physique et état général du bien vérifiés sur place par un inspecteur assermenté.",
    validated: true,
  },
  {
    key: "photos",
    icon: "photo_camera",
    title: "PHOTOS",
    description:
      "Photographies et visites virtuelles contrôlées, garantissant la conformité visuelle actuelle.",
    validated: true,
  },
  {
    key: "mandat",
    icon: "description",
    title: "MANDAT",
    description:
      "Document de mandat de vente ou de location fourni, signé et conforme aux usages légaux.",
    validated: true,
  },
  {
    key: "documentation",
    icon: "folder_open",
    title: "DOCUMENTATION",
    description: "Documents justificatifs (factures, quittances, plans) examinés par nos analystes.",
    validated: true,
  },
  {
    key: "administration",
    icon: "account_balance",
    title: "ADMINISTRATION",
    description:
      "Aucune vérification institutionnelle officielle ou certificat foncier définitif n'est disponible à ce stade.",
    validated: false,
  },
];

export const PASSPORT_META = {
  trustLevelLabel: "Niveau de confiance élevé",
  verifiedOnLabel: "Vérifié le 24 Oct 2024 par l'équipe Ogooué Shield.",
};
