import { stitchImage } from "@/data/image-manifest";
import type { Province } from "@/lib/types";

export interface ProvinceCard extends Province {
  citiesLabel: string;
  propertyCount: number;
}

export const provinces: ProvinceCard[] = [
  {
    slug: "estuaire",
    name: "Estuaire",
    image: stitchImage.provinces_estuaire_libreville_coastline,
    description: "Libreville, Akanda, Owendo",
    citiesLabel: "Libreville, Akanda, Owendo",
    propertyCount: 1850,
  },
  {
    slug: "ogooue-maritime",
    name: "Ogooué-Maritime",
    image: stitchImage.provinces_ogooue_maritime_port_gentil,
    description: "Port-Gentil, Omboué",
    citiesLabel: "Port-Gentil, Omboué",
    propertyCount: 920,
  },
  {
    slug: "haut-ogooue",
    name: "Haut-Ogooué",
    image: stitchImage.provinces_haut_ogooue_franceville,
    description: "Franceville, Moanda",
    citiesLabel: "Franceville, Moanda",
    propertyCount: 640,
  },
  {
    slug: "woleu-ntem",
    name: "Woleu-Ntem",
    image: stitchImage.provinces_woleu_ntem,
    description: "Oyem, Bitam",
    citiesLabel: "Oyem, Bitam",
    propertyCount: 310,
  },
  {
    slug: "moyen-ogooue",
    name: "Moyen-Ogooué",
    image: stitchImage.provinces_moyen_ogooue_lambarene,
    description: "Lambaréné, Ndjolé",
    citiesLabel: "Lambaréné, Ndjolé",
    propertyCount: 180,
  },
  {
    slug: "ngounie",
    name: "Ngounié",
    image: stitchImage.provinces_ngounie,
    description: "Mouila, Ndendé",
    citiesLabel: "Mouila, Ndendé",
    propertyCount: 140,
  },
];

// The acheter screen's "Explorer les 9 provinces" quick-nav grid is an
// icon-tile pattern (no photography) covering all 9 Gabonese provinces,
// distinct from the homepage's 6 photographic ProvinceCard entries above.
export const PROVINCE_QUICK_LINKS = [
  { slug: "estuaire", name: "Estuaire", icon: "landscape" },
  { slug: "haut-ogooue", name: "Haut-Ogooué", icon: "terrain" },
  { slug: "ogooue-maritime", name: "Ogooué-Maritime", icon: "waves" },
  { slug: "woleu-ntem", name: "Woleu-Ntem", icon: "forest" },
  { slug: "ngounie", name: "Ngounié", icon: "park" },
  { slug: "nyanga", name: "Nyanga", icon: "eco" },
  { slug: "ogooue-ivindo", name: "Ogooué-Ivindo", icon: "nature" },
  { slug: "moyen-ogooue", name: "Moyen-Ogooué", icon: "water_drop" },
  { slug: "ogooue-lolo", name: "Ogooué-Lolo", icon: "hive" },
] as const;
