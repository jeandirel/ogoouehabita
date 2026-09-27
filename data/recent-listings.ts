import { stitchImage } from "@/data/image-manifest";
import type { RecentListing } from "@/lib/types";

export const recentListings: RecentListing[] = [
  {
    slug: "appartement-3-pieces-port-gentil-centre",
    title: "Appartement 3 pièces",
    location: "Port-Gentil, Centre",
    priceLabel: "500 000 FCFA",
    postedLabel: "Il y a 2 heures",
    image: stitchImage.properties_appartement_2_chambres,
  },
  {
    slug: "studio-meuble-standing-akanda-mbolo",
    title: "Studio Meublé Standing",
    location: "Akanda, Cité Mbolo",
    priceLabel: "300 000 FCFA",
    postedLabel: "Il y a 5 heures",
    image: stitchImage.properties_studio_meuble_akanda,
  },
  {
    slug: "duplex-vue-panoramique-franceville-potos",
    title: "Duplex Vue Panoramique",
    location: "Franceville, Potos",
    priceLabel: "650 000 FCFA",
    postedLabel: "Il y a 1 jour",
    image: stitchImage.properties_duplex_penthouse_franceville,
  },
];
