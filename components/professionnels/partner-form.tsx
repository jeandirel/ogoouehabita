"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { insertLead } from "@/data/local/leads-store";

export function PartnerForm() {
  const [agencyName, setAgencyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!agencyName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) return;
    insertLead("professionnels", email.trim(), {
      agencyName: agencyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      city: city.trim(),
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex items-center gap-3 bg-primary-fixed/40 text-primary p-space-md rounded-xl text-body-sm font-medium">
        <Icon name="check_circle" />
        Votre demande de partenariat a été transmise à l&apos;équipe Ogooué Habitat. Un membre de
        notre équipe partenariats vous recontactera sous 24h.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-space-sm bg-surface p-space-lg rounded-2xl shadow-xl"
    >
      <h3 className="font-headline-sm text-on-surface mb-1">Devenir partenaire</h3>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm font-bold text-on-surface">Nom de l&apos;agence</span>
        <input
          type="text"
          required
          value={agencyName}
          onChange={(event) => setAgencyName(event.target.value)}
          placeholder="Nom commercial de votre agence"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm font-bold text-on-surface">Nom du contact</span>
        <input
          type="text"
          required
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          placeholder="Votre nom et prénom"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <div className="grid grid-cols-2 gap-space-sm">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm font-bold text-on-surface">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contact@agence.ga"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-sm font-bold text-on-surface">Téléphone</span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+241 XX XX XX XX"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-label-sm font-bold text-on-surface">Ville</span>
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Libreville, Port-Gentil, Franceville..."
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-2.5 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>
      <button
        type="submit"
        className="bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2 flex items-center justify-center gap-2"
      >
        <Icon name="handshake" className="text-[18px]" />
        Envoyer ma demande de partenariat
      </button>
    </form>
  );
}
