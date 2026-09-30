import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { EstimationForm } from "@/components/estimation/estimation-form";

export const metadata: Metadata = {
  title: "Estimer un bien",
  description:
    "Obtenez une estimation indicative de prix pour votre bien au Gabon, calculée à partir des annonces comparables déjà présentes sur Ogooué Habitat.",
};

export default function EstimationPage() {
  return (
    <SiteShell>
      <div className="w-full bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary w-fit text-label-sm font-bold mx-auto mb-4">
              <Icon name="calculate" className="text-[18px]" /> Estimation indicative
            </div>
            <h1 className="font-headline-lg text-on-surface tracking-tight mb-3">
              Estimer le prix de mon bien
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Renseignez le type et la surface de votre bien pour obtenir une fourchette de prix
              indicative, calculée à partir des annonces comparables déjà publiées sur Ogooué
              Habitat — jamais une donnée de marché externe inventée.
            </p>
          </div>
          <EstimationForm />
        </div>
      </div>
    </SiteShell>
  );
}
