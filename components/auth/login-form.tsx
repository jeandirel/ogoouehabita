"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null); setPending(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) { setError(result.error ?? "Connexion impossible."); return; }
      router.push("/mes-annonces"); router.refresh();
    } catch { setError("Connexion indisponible. Réessayez dans un instant."); }
    finally { setPending(false); }
  };

  return <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
    <label className="flex flex-col gap-1.5"><span className="text-label-md font-bold text-on-surface">Adresse email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue" /></label>
    <label className="flex flex-col gap-1.5"><span className="text-label-md font-bold text-on-surface">Mot de passe</span><input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue" /></label>
    {error && <p role="alert" className="text-body-sm text-error">{error}</p>}
    <button type="submit" disabled={pending} className="bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2 disabled:opacity-60">{pending ? "Connexion…" : "Se connecter"}</button>
    <p className="text-body-sm text-on-surface-variant text-center">Pas encore de compte ? <Link href="/inscription" className="text-primary font-bold hover:underline">Créer un compte</Link></p>
  </form>;
}
