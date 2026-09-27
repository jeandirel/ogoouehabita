import { stitchImage } from "@/data/image-manifest";
import type { Neighborhood } from "@/lib/types";

export const neighborhoods: Neighborhood[] = [
  {
    slug: "louis",
    name: "Louis",
    city: "Libreville",
    image: stitchImage.neighborhoods_quartier_louis,
    averagePriceLabel: "850 000 FCFA",
    propertyCount: 42,
  },
  {
    slug: "batterie-iv",
    name: "Batterie IV",
    city: "Libreville",
    image: stitchImage.neighborhoods_quartier_batterie_iv,
    averagePriceLabel: "1 200 000 FCFA",
    propertyCount: 38,
  },
  {
    slug: "glass",
    name: "Glass",
    city: "Libreville",
    image: stitchImage.neighborhoods_quartier_glass,
    averagePriceLabel: "450 000 FCFA",
    propertyCount: 64,
  },
  {
    slug: "bas-de-gue-gue",
    name: "Bas de Gué-Gué",
    city: "Libreville",
    image: stitchImage.neighborhoods_quartier_bas_de_gue_gue,
    averagePriceLabel: "600 000 FCFA",
    propertyCount: 29,
  },
];
