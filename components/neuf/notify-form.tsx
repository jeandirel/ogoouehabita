"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { insertLead } from "@/data/local/leads-store";

export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    insertLead("neuf-notify", email.trim(), {});
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="flex items-center gap-3 bg-surface/10 border border-surface/20 rounded-xl px-4 py-3.5 text-surface">
        <Icon name="check_circle" className="text-primary-fixed-dim" />
        <span>
          Inscription confirmée pour <span className="font-bold">{email}</span>. Vous serez parmi
          les premiers informés à l&apos;ouverture du marketplace Ogooué Neuf.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-4">
      <input
        className="bg-surface/10 border border-surface/20 rounded-xl px-4 py-3.5 text-surface placeholder:text-surface-variant focus:outline-none focus:border-secondary flex-1"
        placeholder="Entrez votre adresse email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-secondary text-on-secondary px-8 py-3.5 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-md whitespace-nowrap"
      >
        Être averti en premier
      </button>
    </form>
  );
}
