import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <SiteShell>
      <div className="min-h-[70vh] flex items-center justify-center px-6 lg:px-12 py-space-xl bg-surface-container-low">
        <div className="w-full max-w-md text-center flex flex-col items-center gap-space-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="signpost" className="text-primary text-[32px]" />
          </div>
          <h1 className="font-headline-lg text-on-surface">Page introuvable</h1>
          <p className="text-body-md text-on-surface-variant">
            Le lien que vous avez suivi est peut-être obsolète, ou la page a été déplacée. Vérifiez
            l&apos;adresse ou repartez depuis l&apos;accueil.
          </p>
          <Link
            href="/"
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
