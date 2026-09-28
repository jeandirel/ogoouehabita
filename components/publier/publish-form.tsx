"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { GABON_GEOGRAPHY, getVillesByProvince, getQuartiersForVille } from "@/data/gabon-geography";
import { insertPublishedListing } from "@/data/local/published-listings-store";
import { formatFcfa, parseBudgetLabel } from "@/lib/format";

const MAX_PHOTO_DIMENSION = 1280;

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Image invalide"));
      image.onload = () => {
        const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Traitement d'image indisponible"));
          return;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const TRANSACTION_TYPES = [
  { key: "vente", label: "Vente" },
  { key: "location", label: "Location" },
] as const;

const CATEGORIES = ["Villa", "Maison", "Appartement", "Studio", "Terrain", "Immeuble commercial"];

// Aligns the form's long "Immeuble commercial" label with the short category
// token every other page's filters actually compare against (see
// data/property-types.ts's ACHETER_CATEGORY_MAP + data/properties.ts).
const CATEGORY_TOKEN: Record<string, string> = {
  "Immeuble commercial": "Immeuble",
};

const AUTRE_QUARTIER = "__autre__";

export function PublishForm() {
  const [transactionType, setTransactionType] =
    useState<(typeof TRANSACTION_TYPES)[number]["key"]>("vente");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [province, setProvince] = useState(GABON_GEOGRAPHY[0].name);
  const [ville, setVille] = useState(GABON_GEOGRAPHY[0].villes[0].name);
  const [quartierSelect, setQuartierSelect] = useState("");
  const [quartierLibre, setQuartierLibre] = useState("");
  const [price, setPrice] = useState("");
  const [surface, setSurface] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const villesForProvince = useMemo(() => getVillesByProvince(province), [province]);
  const quartiersForVille = useMemo(() => getQuartiersForVille(ville), [ville]);
  const hasQuartierData = quartiersForVille.length > 0;

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    const nextVille = getVillesByProvince(value)[0]?.name ?? "";
    setVille(nextVille);
    setQuartierSelect("");
    setQuartierLibre("");
  };

  const handleVilleChange = (value: string) => {
    setVille(value);
    setQuartierSelect("");
    setQuartierLibre("");
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Veuillez sélectionner un fichier image.");
      return;
    }
    try {
      const compressed = await compressImageFile(file);
      setPhotoDataUrl(compressed);
      setPhotoError(null);
    } catch {
      setPhotoError("Impossible de traiter cette image, essayez-en une autre.");
    }
  };

  const quartierFinal = hasQuartierData
    ? (quartierSelect === AUTRE_QUARTIER ? quartierLibre.trim() : quartierSelect)
    : quartierLibre.trim();
  const location = quartierFinal ? `${quartierFinal}, ${ville} (${province})` : `${ville} (${province})`;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !title.trim() ||
      !price.trim() ||
      !surface.trim() ||
      !description.trim() ||
      !contactName.trim() ||
      !contactPhone.trim()
    ) {
      return;
    }

    const priceValue = parseBudgetLabel(price) ?? 0;
    const priceLabel =
      transactionType === "location" ? `${formatFcfa(priceValue)} / mois` : formatFcfa(priceValue);
    const surfaceM2 = parseBudgetLabel(surface);
    const bedroomsCount = bedrooms.trim() ? parseBudgetLabel(bedrooms) : undefined;

    const listing = insertPublishedListing({
      title: title.trim(),
      transactionType,
      category: CATEGORY_TOKEN[category] ?? category,
      location,
      province,
      priceValue,
      priceLabel,
      surfaceM2,
      bedrooms: bedroomsCount,
      description: description.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      photoDataUrl: photoDataUrl ?? undefined,
    });
    setCreatedSlug(listing.slug);
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
          Votre annonce « {title} » est déjà visible sur cet appareil, marquée « en cours de
          vérification ».
        </p>
        <p className="text-body-sm text-on-surface-variant max-w-md">
          L&apos;équipe Ogooué Shield doit encore valider le dossier (titre foncier, identité du
          vendeur/bailleur) avant de retirer ce statut, généralement sous 48h en moyenne. Vous
          serez contacté au {contactPhone} si des documents complémentaires sont nécessaires.
          L&apos;annonce n&apos;est conservée que dans ce navigateur, sur cet appareil.
        </p>
        {createdSlug && (
          <Link
            href={`/bien/${createdSlug}`}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2"
          >
            Voir mon annonce
          </Link>
        )}
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

      <div className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Photo principale (optionnel)</span>
        <div className="flex items-center gap-space-md">
          {photoDataUrl ? (
            <div
              className="w-24 h-24 rounded-xl bg-cover bg-center shadow-sm shrink-0"
              style={{ backgroundImage: `url('${photoDataUrl}')` }}
              role="img"
              aria-label="Aperçu de la photo sélectionnée"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
              <Icon name="add_a_photo" className="text-outline text-[28px]" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 rounded-xl text-label-md font-bold text-on-surface hover:bg-surface-container cursor-pointer w-fit">
              <Icon name="upload" className="text-[18px]" />
              {photoDataUrl ? "Changer la photo" : "Ajouter une photo"}
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            {photoDataUrl && (
              <button
                type="button"
                onClick={() => setPhotoDataUrl(null)}
                className="text-label-sm font-bold text-on-surface-variant hover:text-error text-left"
              >
                Retirer la photo
              </button>
            )}
            {photoError && <span className="text-label-sm text-error">{photoError}</span>}
            {!photoDataUrl && !photoError && (
              <span className="text-label-sm text-on-surface-variant">
                Sans photo, une image d&apos;illustration générique sera utilisée en attendant.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-label-md font-bold text-on-surface">Localisation</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <select
            value={province}
            onChange={(event) => handleProvinceChange(event.target.value)}
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          >
            {GABON_GEOGRAPHY.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={ville}
            onChange={(event) => handleVilleChange(event.target.value)}
            className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
          >
            {villesForProvince.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        {hasQuartierData ? (
          <div className="flex flex-col gap-1.5">
            <select
              value={quartierSelect}
              onChange={(event) => setQuartierSelect(event.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
            >
              <option value="">Quartier (optionnel)</option>
              {quartiersForVille.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
              <option value={AUTRE_QUARTIER}>Autre (préciser)...</option>
            </select>
            {quartierSelect === AUTRE_QUARTIER && (
              <input
                type="text"
                value={quartierLibre}
                onChange={(event) => setQuartierLibre(event.target.value)}
                placeholder="Précisez le nom du quartier"
                className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              value={quartierLibre}
              onChange={(event) => setQuartierLibre(event.target.value)}
              placeholder="Quartier (optionnel)"
              className="bg-surface-container-low border border-outline-variant/40 px-space-md py-3 rounded-xl text-body-md focus:outline-none focus:border-ogooue-blue"
            />
            <span className="text-label-sm text-on-surface-variant">
              Aucune liste de quartiers vérifiée n&apos;est disponible pour {ville} dans nos
              sources officielles — précisez-le librement si besoin.
            </span>
          </div>
        )}
        <p className="text-label-sm text-on-surface-variant">
          Localisation enregistrée : <span className="font-bold text-on-surface">{location}</span>
        </p>
      </div>

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
          <Link
            href="/estimation"
            className="text-label-sm font-bold text-primary hover:underline w-fit"
          >
            Pas sûr du prix ? Essayez l&apos;estimateur
          </Link>
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
