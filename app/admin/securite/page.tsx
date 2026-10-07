import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AdminMfaForm } from "@/components/auth/admin-mfa-form";
import { SiteShell } from "@/components/layout/site-shell";
import { currentUser } from "@/lib/auth";

export default async function AdminSecurityPage() {
  const user = await currentUser();
  if (!user) redirect("/connexion");
  if (!user.roles.includes(UserRole.ADMIN)) redirect("/");
  return <SiteShell><main className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-10 lg:py-16"><p className="mb-2 text-label-md font-bold uppercase tracking-wider text-secondary">Administration</p><h1 className="font-headline-lg text-on-surface">Sécurité du compte</h1><p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">Configurez l’authentification renforcée requise avant toute gestion sensible des comptes et agences.</p><section className="mt-8 rounded-2xl border border-outline-variant/60 bg-surface p-6 shadow-sm"><AdminMfaForm /></section></main></SiteShell>;
}
