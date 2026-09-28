import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { LoginForm } from "@/components/auth/login-form";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace Ogooué Habitat pour suivre vos favoris, alertes et demandes de visite.",
};

export default function ConnexionPage() {
  return (
    <SiteShell>
      <div className="min-h-[70vh] flex items-center justify-center px-6 lg:px-12 py-space-xl bg-surface-container-low">
        <div className="w-full max-w-md bg-surface p-space-xl rounded-2xl shadow-lg flex flex-col gap-space-lg">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" className="text-on-primary text-[22px]" />
            </div>
            <h1 className="font-headline-lg text-on-surface">Connexion</h1>
            <p className="text-body-sm text-on-surface-variant">
              Accédez à votre espace Ogooué Habitat pour suivre vos favoris, vos alertes Ogooué AI
              et vos demandes de visite.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </SiteShell>
  );
}
