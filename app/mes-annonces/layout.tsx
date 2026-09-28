import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes annonces",
  description: "Suivez le statut de vos annonces publiées sur Ogooué Habitat.",
};

export default function MesAnnoncesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
