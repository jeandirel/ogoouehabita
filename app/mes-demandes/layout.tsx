import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes demandes",
  description: "Retrouvez vos demandes de visite, alertes et candidatures envoyées sur Ogooué Habitat.",
};

export default function MesDemandesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
