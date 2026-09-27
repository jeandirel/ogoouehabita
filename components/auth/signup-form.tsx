"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const ROLES = [
  { key: "particulier", label: "Locataire / Acheteur" },
  { key: "professionnel", label: "Propriétaire / Agence" },
] as const;

export function SignupForm() {
  const [role, setRole] = useState<(typeof ROLES)[number]["key"]>("particulier");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-space-sm text-center bg-primary-fixed/30 p-space-lg rounded-xl">
        <Icon name="info" className="text-primary text-[28px]" />
        <p className="text-body-md text-on-surface font-medium">
          Ceci est un environnement de démonstration : la création de compte réelle sera
          disponible au lancement public d&apos;Ogooué Habitat.
        </p>
        <p className="text-body-sm text-on-surface-variant">
          Aucun compte n&apos;a été créé et aucune donnée n&apos;a été transmise à un serveur
          distant.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
      <div className="flex bg-surface-container p-1 rounded-xl">
        {ROLES.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setRole(option.key)}
            aria-pressed={role === option.key}
            className={cn(
              "flex-1 px-3 py-2.5 text-label-sm rounded-lg transition-all",
              role === option.key
                ? "font-bold bg-primary text-on-primary shadow-sm"
                : "font-medium text-on-surface-variant hover:text-on-surface",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Nom complet</span>
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Votre nom et prénom"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Adresse email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="vous@exemple.com"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Téléphone</span>
        <input
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+241 XX XX XX XX"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Mot de passe</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="8 caractères minimum"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <button
        type="submit"
        className="bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2"
      >
        Créer mon compte
      </button>
      <p className="text-body-sm text-on-surface-variant text-center">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="text-primary font-bold hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
