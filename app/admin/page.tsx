import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
export default async function AdminPage() {
  const user = await currentUser();
  if (!user || !user.roles.some((role) => role === "ADMIN" || role === "MODERATEUR")) redirect("/connexion");
  const [users, agencies, pending, reports] = await Promise.all([
    prisma.user.count(), prisma.agency.count(), prisma.listing.count({ where: { status: "PENDING_REVIEW" } }), prisma.report.count({ where: { status: "OPEN" } }),
  ]);
  const cards = [["Comptes", users], ["Agences", agencies], ["Annonces à modérer", pending], ["Signalements ouverts", reports]];
  return <SiteShell><main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-16"><p className="mb-2 text-label-md font-bold uppercase tracking-wider text-secondary">Administration</p><h1 className="font-headline-lg text-on-surface">Pilotage Ogooué Habitat</h1><p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">Données de modération et d’exploitation, visibles selon votre rôle serveur.</p>{user.roles.includes("ADMIN") && !user.adminMfaEnabled && <div className="mt-6 rounded-xl border border-secondary/30 bg-secondary/5 p-4 text-body-md text-on-surface"><p>L’authentification renforcée doit être configurée avant les actions administratives sensibles.</p><Link href="/admin/securite" className="mt-2 inline-block font-bold text-primary hover:underline">Configurer le second facteur</Link></div>}<section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value]) => <article key={String(label)} className="rounded-2xl border border-outline-variant/60 bg-surface p-6 shadow-sm"><p className="text-body-sm text-on-surface-variant">{label}</p><p className="mt-2 font-headline-md text-primary">{value}</p></article>)}</section></main></SiteShell>;
}
