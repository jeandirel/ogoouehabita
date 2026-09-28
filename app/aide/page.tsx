import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { HelpCenter } from "@/components/aide/help-center";

export const metadata: Metadata = {
  title: "Centre d'aide & FAQ",
  description:
    "Toutes les réponses sur la recherche, la publication d'annonces, le Passeport Ogooué et la confiance foncière sur Ogooué Habitat.",
};

export default function AidePage() {
  return (
    <SiteShell>
      <div className="flex flex-col w-full">
        <HelpCenter />
      </div>
    </SiteShell>
  );
}
