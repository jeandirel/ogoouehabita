import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez les biens et terrains que vous avez enregistrés en favoris sur Ogooué Habitat.",
};

export default function FavorisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
