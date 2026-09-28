"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { insertLead } from "@/data/local/leads-store";

const PROJECTS = [
  "Achat d'une villa ou maison",
  "Achat d'un terrain",
  "Investissement locatif",
  "Location longue durée pour ma famille",
];

export function DiasporaLeadForm() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState("");
  const [project, setProject] = useState(PROJECTS[0]);
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !country.trim() || !contact.trim()) return;
    insertLead("diaspora", contact.trim(), {
      name: name.trim(),
      country: country.trim(),
      project,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex items-center gap-3 bg-primary-fixed/40 text-primary p-space-md rounded-xl text-body-sm font-medium">
        <Icon name="check_circle" />
        Votre demande a été transmise à l&apos;équipe Ogooué Diaspora. Un conseiller vous
        recontactera sous 24h, où que vous soyez dans le monde.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-space-sm bg-surface p-space-lg rounded-2xl shadow-xl"
    >
      <h3 className="font-headline-sm text-on-surface mb-1">Parlez-nous de votre projet</h3>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm font-bold text-on-surface">Nom complet</span>
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Votre nom et prénom"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm font-bold text-on-surface">Pays de résidence</span>
        <input
          type="text"
          required
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder="France, Canada, États-Unis..."
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm font-bold text-on-surface">Téléphone (WhatsApp) ou email</span>
        <input
          type="text"
          required
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder="+33 6 XX XX XX XX ou vous@exemple.com"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm font-bold text-on-surface">Votre projet</span>
        <select
          value={project}
          onChange={(event) => setProject(event.target.value)}
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        >
          {PROJECTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2 flex items-center justify-center gap-2"
      >
        <Icon name="send" className="text-[18px]" />
        Être recontacté par un conseiller
      </button>
    </form>
  );
}
