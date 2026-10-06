"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const ROLES = [{ key: "particulier", label: "Locataire / Acheteur" }, { key: "proprietaire", label: "Propriétaire" }] as const;

export function SignupForm() {
  const [role, setRole] = useState<(typeof ROLES)[number]["key"]>("particulier");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null); const [error, setError] = useState<string | null>(null); const [pending, setPending] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setError(null); setMessage(null); setPending(true);
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: name, email, phone, password, role }) });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) { setError(result.error ?? "Inscription impossible."); return; }
      setMessage(result.message ?? "Compte créé. Vérifiez votre adresse email.");
    } catch { setError("Inscription indisponible. Réessayez dans un instant."); } finally { setPending(false); }
  };
  if (message) return <div className="flex flex-col items-center gap-space-sm text-center bg-primary-fixed/30 p-space-lg rounded-xl"><Icon name="mark_email_read" className="text-primary text-[28px]" /><p className="text-body-md text-on-surface font-medium">{message}</p><p className="text-body-sm text-on-surface-variant">Un lien d’activation expirant a été envoyé à {email}. Les connexions Google, Facebook et par SMS restent désactivées tant que leurs prestataires ne sont pas configurés.</p></div>;
  return <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
    <div className="flex bg-surface-container p-1 rounded-xl">{ROLES.map((option) => <button key={option.key} type="button" onClick={() => setRole(option.key)} aria-pressed={role === option.key} className={cn("flex-1 px-3 py-2.5 text-label-sm rounded-lg transition-all", role === option.key ? "font-bold bg-primary text-on-primary shadow-sm" : "font-medium text-on-surface-variant hover:text-on-surface")}>{option.label}</button>)}</div>
    <label className="flex flex-col gap-1.5"><span className="text-label-md font-bold text-on-surface">Nom complet</span><input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Votre nom et prénom" className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue" /></label>
    <label className="flex flex-col gap-1.5"><span className="text-label-md font-bold text-on-surface">Téléphone / WhatsApp <span className="font-medium text-on-surface-variant">(optionnel)</span></span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+241 XX XX XX XX" className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue" /></label>
    <label className="flex flex-col gap-1.5"><span className="text-label-md font-bold text-on-surface">Adresse email</span><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue" /></label>
    <label className="flex flex-col gap-1.5"><span className="text-label-md font-bold text-on-surface">Mot de passe</span><input type="password" required minLength={12} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="12 caractères minimum" className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue" /></label>
    {error && <p role="alert" className="text-body-sm text-error">{error}</p>}<button type="submit" disabled={pending} className="bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2 disabled:opacity-60">{pending ? "Création…" : "Créer mon compte"}</button>
    <p className="text-body-sm text-on-surface-variant text-center">Déjà inscrit ? <Link href="/connexion" className="text-primary font-bold hover:underline">Se connecter</Link></p>
  </form>;
}
