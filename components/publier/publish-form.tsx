"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const TRANSACTION_TYPES = [
  { key: "vente", label: "Vente" },
  { key: "location", label: "Location" },
] as const;

const CATEGORIES = ["Villa", "Maison", "Appartement", "Studio", "Terrain", "Immeuble commercial"];

export function PublishForm() {
  const [transactionType, setTransactionType] =
    useState<(typeof TRANSACTION_TYPES)[number]["key"]>("vente");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !title.trim() ||
      !location.trim() ||
      !price.trim() ||
      !surface.trim() ||
      !description.trim() ||
      !contactName.trim() ||
      !contactPhone.trim()
    ) {
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-space-sm text-center bg-primary-fixed/30 p-space-xl rounded-2xl max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
          <Icon name="fact_check" className="text-on-primary text-[26px]" />
        </div>
        <h2 className="font-headline-sm text-on-surface">Annonce soumise pour vérification</h2>
        <p className="text-body-md text-on-surface font-medium">
          Votre annonce « {title} » a été soumise pour vérification par l&apos;équipe Ogooué
          Shield.
        </p>
        <p className="text-body-sm text-on-surface-variant max-w-md">
          Elle sera publiée sur la plateforme après validation du dossier (titre foncier, identité
          du vendeur/bailleur), généralement sous 48h en moyenne. Vous serez contacté au{" "}
          {contactPhone} si des documents complémentaires sont nécessaires.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-md max-w-3xl mx-auto">
      <div className="flex bg-surface-container p-1 rounded-xl w-fit">
        {TRANSACTION_TYPES.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setTransactionType(option.key)}
            aria-pressed={transactionType === option.key}
            className={cn(
              "px-6 py-2.5 text-label-md rounded-lg transition-all",
              transactionType === option.key
                ? "font-bold bg-primary text-on-primary shadow-sm"
                : "font-medium text-on-surface-variant hover:text-on-surface",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">Catégorie</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          >
            {CATEGORIES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">Titre de l&apos;annonce</span>
          <input
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex : Villa standing avec piscine à Angondjé"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Localisation / Quartier</span>
        <input
          type="text"
          required
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Ex : Angondjé, Libreville (Estuaire)"
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">
            Prix {transactionType === "location" ? "(FCFA / mois)" : "(FCFA)"}
          </span>
          <input
            type="text"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Ex : 45 000 000"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">Surface (m²)</span>
          <input
            type="text"
            required
            value={surface}
            onChange={(event) => setSurface(event.target.value)}
            placeholder="Ex : 350"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">Chambres</span>
          <input
            type="text"
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
            placeholder="Ex : 4"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Description du bien</span>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Décrivez le bien : état général, équipements, environnement, accès..."
          className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue resize-none"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">Votre nom</span>
          <input
            type="text"
            required
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            placeholder="Nom du vendeur / bailleur"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-label-md font-bold text-on-surface">Téléphone de contact</span>
          <input
            type="tel"
            required
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            placeholder="+241 XX XX XX XX"
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          />
        </label>
      </div>

      <button
        type="submit"
        className="bg-primary text-on-primary py-3.5 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2 flex items-center justify-center gap-2"
      >
        <Icon name="publish" className="text-[18px]" />
        Soumettre mon annonce pour vérification
      </button>
    </form>
  );
}
