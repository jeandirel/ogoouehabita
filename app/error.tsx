"use client";

import { useEffect } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SiteShell>
      <div className="min-h-[70vh] flex items-center justify-center px-6 lg:px-12 py-space-xl bg-surface-container-low">
        <div className="w-full max-w-md text-center flex flex-col items-center gap-space-md">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
            <Icon name="error" className="text-error text-[32px]" />
          </div>
          <h1 className="font-headline-lg text-on-surface">Une erreur est survenue</h1>
          <p className="text-body-md text-on-surface-variant">
            Quelque chose s&apos;est mal passé de notre côté. Vous pouvez réessayer, l&apos;incident
            a été enregistré.
          </p>
          <button
            onClick={reset}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    </SiteShell>
  );
}
