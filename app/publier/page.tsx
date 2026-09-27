import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { PublishForm } from "@/components/publier/publish-form";

export default function PublierPage() {
  return (
    <SiteShell>
      <div className="w-full bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl">
          <div className="max-w-3xl mx-auto text-center mb-space-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary w-fit text-label-sm font-bold mx-auto mb-4">
              <Icon name="verified" className="text-[18px]" /> Vérification Ogooué Shield
            </div>
            <h1 className="font-headline-xl text-on-surface tracking-tight mb-4">
              Publier un bien
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Décrivez votre bien en quelques minutes. Chaque annonce est examinée par
              l&apos;équipe Ogooué Shield avant sa mise en ligne, afin de garantir la fiabilité de
              la plateforme pour tous les visiteurs.
            </p>
          </div>
          <div className="bg-surface p-space-lg lg:p-space-xl rounded-2xl shadow-lg">
            <PublishForm />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
