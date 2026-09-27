"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { Property } from "@/lib/types";

export function ContactAgencyPanel({ property }: { property: Property }) {
  const [sent, setSent] = useState(false);
  const agencyName = property.agencyName ?? "notre équipe Ogooué Habitat";

  const requestContact = () => setSent(true);

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
      <div className="flex flex-col gap-space-sm pt-4 border-t border-outline-variant/30">
        {sent ? (
          <div className="flex items-center gap-2 bg-primary-fixed/40 text-primary p-space-md rounded-xl text-body-sm font-medium">
            <Icon name="check_circle" />
            Votre demande a été transmise à {agencyName}. Un conseiller vous recontactera sous 24h.
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={requestContact}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon name="calendar_month" className="text-[20px]" />
              Réserver une visite
            </button>
            <button
              type="button"
              onClick={requestContact}
              className="w-full bg-ogooue-blue text-on-secondary py-3 rounded-xl font-label-md hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon name="chat" className="text-[20px]" />
              Discuter sur WhatsApp
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={requestContact}
                className="bg-surface border border-outline-variant/40 py-2.5 rounded-xl text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              >
                <Icon name="call" className="text-[18px]" />
                Appeler
              </button>
              <button
                type="button"
                onClick={requestContact}
                className="bg-surface border border-outline-variant/40 py-2.5 rounded-xl text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              >
                <Icon name="mail" className="text-[18px]" />
                Message
              </button>
            </div>
          </>
        )}
      </div>
      {property.agencyInitials && (
        <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-primary">
            {property.agencyInitials}
          </div>
          <div>
            <div className="text-label-md font-bold text-on-surface">{agencyName}</div>
            <div className="text-body-sm text-on-surface-variant flex items-center gap-1">
              <Icon name="verified" className="text-[14px] text-secondary" /> Partenaire certifié
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
