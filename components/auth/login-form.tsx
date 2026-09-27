"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-space-sm text-center bg-primary-fixed/30 p-space-lg rounded-xl">
        <Icon name="info" className="text-primary text-[28px]" />
        <p className="text-body-md text-on-surface font-medium">
          Ceci est un environnement de démonstration : la connexion réelle sera disponible au
          lancement public d&apos;Ogooué Habitat.
        </p>
        <p className="text-body-sm text-on-surface-variant">
          Aucune session n&apos;a été ouverte et aucune donnée n&apos;a été transmise à un serveur
          distant.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
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
        <span className="text-label-md font-bold text-on-surface">Mot de passe</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <button
        type="submit"
        className="bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2"
      >
        Se connecter
      </button>
      <p className="text-body-sm text-on-surface-variant text-center">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-primary font-bold hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
