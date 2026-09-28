"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { agencyByInitials } from "@/data/agencies";
import { insertLead } from "@/data/local/leads-store";
import { toWhatsAppDigits } from "@/lib/format";
import type { Property } from "@/lib/types";

const REQUEST_TYPE_LABELS = {
  visite: "Réservation de visite",
  whatsapp: "Discussion WhatsApp",
  appel: "Demande d'appel",
  message: "Message",
} as const;

const VISIT_SLOTS = ["Matin (9h-12h)", "Après-midi (14h-17h)", "Soir (17h-19h)"];

function formatVisitDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ContactAgencyPanel({ property }: { property: Property }) {
  const [sent, setSent] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState(VISIT_SLOTS[0]);
  const agency = property.agencyInitials ? agencyByInitials(property.agencyInitials) : undefined;
  const displayName = agency?.name ?? property.agencyName ?? "notre équipe Ogooué Habitat";
  const phone = property.contactPhone ?? agency?.phone;
  const todayIso = new Date().toISOString().slice(0, 10);

  const requestContact = (type: keyof typeof REQUEST_TYPE_LABELS, extra?: Record<string, string>) => {
    setSent(true);
    insertLead("contact-bien", property.title, {
      slug: property.slug,
      agence: displayName,
      type: REQUEST_TYPE_LABELS[type],
      ...extra,
    });
  };

  const submitVisit = (event: FormEvent) => {
    event.preventDefault();
    if (!visitDate) return;
    requestContact("visite", {
      dateSouhaitee: formatVisitDate(visitDate),
      creneau: visitSlot,
    });
  };

  return (
    <div className="sticky top-28 bg-surface-container-low p-space-lg rounded-xl shadow-lg flex flex-col gap-space-md">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-headline-lg text-primary font-bold">{property.priceLabel}</div>
          {property.priceSecondaryLabel && (
            <div className="text-body-sm text-on-surface-variant">{property.priceSecondaryLabel}</div>
          )}
        </div>
        <span className="bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full text-label-sm font-bold">
          Disponible
        </span>
      </div>
      {property.transactionType === "location" && property.cautionLabel && (
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant bg-surface-container rounded-lg px-3 py-2">
          <Icon name="savings" className="text-secondary text-[16px]" />
          {property.cautionLabel}
        </div>
      )}
      <div className="flex flex-col gap-space-sm pt-4 border-t border-outline-variant/30">
        {sent && (
          <div className="flex items-center gap-2 bg-primary-fixed/40 text-primary p-space-md rounded-xl text-body-sm font-medium">
            <Icon name="check_circle" />
            Votre demande a été transmise à {displayName}. Un conseiller vous recontactera sous 24h.
          </div>
        )}
        {!sent && !showVisitForm && (
          <button
            type="button"
            onClick={() => setShowVisitForm(true)}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon name="calendar_month" className="text-[20px]" />
            Réserver une visite
          </button>
        )}
        {!sent && showVisitForm && (
          <form
            onSubmit={submitVisit}
            className="bg-surface border border-outline-variant/40 rounded-xl p-space-md flex flex-col gap-space-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-label-md font-bold text-on-surface">Choisir une date</span>
              <button
                type="button"
                onClick={() => setShowVisitForm(false)}
                aria-label="Annuler"
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>
            <input
              type="date"
              required
              min={todayIso}
              value={visitDate}
              onChange={(event) => setVisitDate(event.target.value)}
              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-body-md text-on-surface"
            />
            <select
              value={visitSlot}
              onChange={(event) => setVisitSlot(event.target.value)}
              className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-body-md text-on-surface"
            >
              {VISIT_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-2.5 rounded-xl font-label-md hover:bg-forest-deep transition-all"
            >
              Confirmer la demande de visite
            </button>
          </form>
        )}
        {phone ? (
          <a
            href={`https://wa.me/${toWhatsAppDigits(phone)}?text=${encodeURIComponent(
              `Bonjour, je suis intéressé(e) par "${property.title}" sur Ogooué Habitat.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-ogooue-blue text-on-secondary py-3 rounded-xl font-label-md hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon name="chat" className="text-[20px]" />
            Discuter sur WhatsApp
          </a>
        ) : (
          !sent && (
            <button
              type="button"
              onClick={() => requestContact("whatsapp")}
              className="w-full bg-ogooue-blue text-on-secondary py-3 rounded-xl font-label-md hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon name="chat" className="text-[20px]" />
              Discuter sur WhatsApp
            </button>
          )
        )}
        {!sent && (
          <div className="grid grid-cols-2 gap-2">
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="bg-surface border border-outline-variant/40 py-2.5 rounded-xl text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              >
                <Icon name="call" className="text-[18px]" />
                Appeler
              </a>
            ) : (
              <button
                type="button"
                onClick={() => requestContact("appel")}
                className="bg-surface border border-outline-variant/40 py-2.5 rounded-xl text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              >
                <Icon name="call" className="text-[18px]" />
                Appeler
              </button>
            )}
            <button
              type="button"
              onClick={() => requestContact("message")}
              className="bg-surface border border-outline-variant/40 py-2.5 rounded-xl text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
            >
              <Icon name="mail" className="text-[18px]" />
              Message
            </button>
          </div>
        )}
      </div>
      {property.agencyInitials ? (
        <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-primary">
            {property.agencyInitials}
          </div>
          <div>
            <div className="text-label-md font-bold text-on-surface">{displayName}</div>
            {agency?.rccmNumber ? (
              <div className="text-body-sm text-on-surface-variant flex items-center gap-1">
                <Icon name="verified" className="text-[14px] text-secondary" /> Partenaire certifié —{" "}
                {agency.rccmNumber}
              </div>
            ) : (
              <div className="text-body-sm text-on-surface-variant">Agence partenaire</div>
            )}
          </div>
        </div>
      ) : (
        property.source === "local" && (
          <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="person" className="text-on-surface-variant" />
            </div>
            <div>
              <div className="text-label-md font-bold text-on-surface">{displayName}</div>
              <div className="text-body-sm text-on-surface-variant">
                Vendeur particulier — annonce en cours de vérification
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
