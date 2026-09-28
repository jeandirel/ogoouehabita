"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { stitchImage } from "@/data/image-manifest";

export interface MapPin {
  slug: string;
  priceShort: string;
  top: string;
  left: string;
  active: boolean;
}

const ZOOM_MIN = 0.75;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.25;

type Layer = "carte" | "satellite" | "cadastre";

const LAYERS: { key: Layer; label: string }[] = [
  { key: "carte", label: "Carte" },
  { key: "satellite", label: "Satellite" },
  { key: "cadastre", label: "Cadastre" },
];

// Real CSS-filter treatments of the one real map asset, not fabricated
// satellite/cadastral imagery — see STITCH_IMPLEMENTATION.md deviation entry.
const LAYER_FILTERS: Record<Layer, string> = {
  carte: "none",
  satellite: "saturate(1.35) contrast(1.15) brightness(0.92) hue-rotate(-6deg)",
  cadastre: "grayscale(1) contrast(1.25) brightness(1.05)",
};

type GeoStatus =
  | { state: "idle" }
  | { state: "locating" }
  | { state: "found"; lat: number; lng: number }
  | { state: "denied" }
  | { state: "unsupported" };

export function InteractiveMap({ pins }: { pins: readonly MapPin[] }) {
  const [zoom, setZoom] = useState(1);
  const [layer, setLayer] = useState<Layer>("carte");
  const [geo, setGeo] = useState<GeoStatus>({ state: "idle" });

  const handleLocate = () => {
    if (!("geolocation" in navigator)) {
      setGeo({ state: "unsupported" });
      return;
    }
    setGeo({ state: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeo({ state: "found", lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        setGeo({ state: error.code === error.PERMISSION_DENIED ? "denied" : "unsupported" });
      },
      { timeout: 10_000 },
    );
  };

  return (
    <div className="w-full h-[420px] lg:w-[58%] lg:h-full relative overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center relative transition-transform duration-300"
        style={{
          backgroundImage: `url('${stitchImage.misc_carte_illustrative_libreville.path}')`,
          filter: LAYER_FILTERS[layer],
          transform: `scale(${zoom})`,
        }}
        role="img"
        aria-label={stitchImage.misc_carte_illustrative_libreville.alt}
      >
        {layer === "cadastre" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 48px)",
            }}
          />
        )}

        {pins.map((pin) => (
          <Link
            key={pin.slug}
            href={`/bien/${pin.slug}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            style={{ top: pin.top, left: pin.left }}
          >
            <div
              className={`px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5 border-2 transition-transform group-hover:scale-110 ${
                pin.active
                  ? "bg-primary text-on-primary border-surface scale-105"
                  : "bg-surface text-on-surface border-outline-variant/30"
              }`}
            >
              {pin.active && (
                <Icon name="verified" filled className="text-[16px] text-primary-fixed" />
              )}
              <span className="font-label-md font-bold">{pin.priceShort}</span>
            </div>
            <div
              className={`w-3 h-3 rotate-45 mx-auto -mt-1.5 shadow-md ${
                pin.active ? "bg-primary" : "bg-surface"
              }`}
            />
          </Link>
        ))}

        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(ZOOM_MAX, Number((z + ZOOM_STEP).toFixed(2))))}
            disabled={zoom >= ZOOM_MAX}
            className="w-12 h-12 bg-surface text-on-surface rounded-2xl shadow-lg flex items-center justify-center hover:bg-surface-container transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Zoomer"
          >
            <Icon name="add" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(ZOOM_MIN, Number((z - ZOOM_STEP).toFixed(2))))}
            disabled={zoom <= ZOOM_MIN}
            className="w-12 h-12 bg-surface text-on-surface rounded-2xl shadow-lg flex items-center justify-center hover:bg-surface-container transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Dézoomer"
          >
            <Icon name="remove" />
          </button>
          <button
            type="button"
            onClick={handleLocate}
            className="w-12 h-12 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center hover:bg-forest-deep transition-all mt-2"
            aria-label="Me localiser"
          >
            <Icon name="my_location" />
          </button>
        </div>

        <div className="absolute top-6 right-6 bg-surface/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg flex items-center gap-1 z-30">
          {LAYERS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setLayer(option.key)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-label-sm transition-colors",
                layer === option.key
                  ? "font-bold bg-primary text-on-primary"
                  : "font-medium text-on-surface-variant hover:text-on-surface",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="absolute top-6 left-6 bg-surface/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 z-30">
          <Icon name="security" filled className="text-secondary" />
          <span className="text-label-sm font-bold text-on-surface">
            Registre Foncier National Synchronisé
          </span>
        </div>
      </div>

      {geo.state !== "idle" && (
        <div className="absolute bottom-6 left-6 z-40 max-w-xs bg-surface/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-3 text-body-sm text-on-surface">
          {geo.state === "locating" && "Localisation en cours..."}
          {geo.state === "found" &&
            `Position détectée : ${geo.lat.toFixed(4)}°, ${geo.lng.toFixed(4)}°. Cette carte illustrative n'est pas géoréférencée, comparez-la simplement au quartier affiché.`}
          {geo.state === "denied" &&
            "Localisation refusée. Autorisez l'accès à la position dans les réglages de votre navigateur pour utiliser cette fonctionnalité."}
          {geo.state === "unsupported" &&
            "La géolocalisation n'est pas disponible sur cet appareil ou ce navigateur."}
        </div>
      )}
    </div>
  );
}
