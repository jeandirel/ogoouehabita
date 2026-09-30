"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PhotoPendingBadge } from "@/components/ui/photo-pending-badge";
import type { GalleryImage } from "@/lib/types";

export function PropertyGallery({
  images,
  hasRealPhoto,
}: {
  images: GalleryImage[];
  hasRealPhoto?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const main = images[0];
  const second = images[1];
  const third = images[2];

  useEffect(() => {
    if (openIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (event.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex, images.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:h-[500px]">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="lg:col-span-2 h-72 sm:h-96 lg:h-full rounded-xl overflow-hidden shadow-sm relative bg-cover bg-center text-left cursor-zoom-in group"
          style={{ backgroundImage: `url('${main.image.path}')` }}
          aria-label={main.image.alt}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-anthracite/60 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-5 left-5 text-on-primary">
            <span className="bg-primary/85 backdrop-blur-md px-3 py-1 rounded-full text-label-sm font-bold">
              Vue principale
            </span>
            <div className="font-headline-lg mt-2">{main.caption}</div>
          </div>
          {hasRealPhoto === false && <PhotoPendingBadge className="absolute top-6 right-6" />}
        </button>
        {images.length > 1 && (
          <div className="hidden lg:grid grid-rows-2 gap-space-md h-full">
            <button
              type="button"
              onClick={() => setOpenIndex(1)}
              className="rounded-xl overflow-hidden shadow-sm relative bg-cover bg-center text-left cursor-zoom-in"
              style={{ backgroundImage: `url('${second.image.path}')` }}
              aria-label={second.image.alt}
            >
              <div className="absolute bottom-4 left-4 text-on-primary">
                <span className="text-label-sm font-bold">{second.caption}</span>
              </div>
            </button>
            {third && (
              <button
                type="button"
                onClick={() => setOpenIndex(2)}
                className="rounded-xl overflow-hidden shadow-sm relative bg-cover bg-center text-left cursor-zoom-in"
                style={{ backgroundImage: `url('${third.image.path}')` }}
                aria-label={third.image.alt}
              >
                <div className="absolute inset-0 bg-anthracite/30 flex items-center justify-center">
                  <span className="bg-surface/90 text-on-surface px-space-md py-space-sm rounded-xl font-label-md backdrop-blur-md shadow-lg flex items-center gap-2">
                    <Icon name="grid_view" />
                    Voir les {images.length} photos
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden no-scrollbar">
          {images.map((image, index) => (
            <button key={image.image.path} type="button" onClick={() => setOpenIndex(index)} className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-cover bg-center" style={{ backgroundImage: `url('${image.image.path}')` }} aria-label={`Voir la photo ${index + 1}`}>
              <span className="absolute inset-0 bg-primary/10" />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div className="fixed inset-0 z-50 bg-anthracite/95 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Fermer la galerie"
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-surface/10 text-surface flex items-center justify-center hover:bg-surface/20 transition-all"
          >
            <Icon name="close" className="text-[24px]" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
                aria-label="Photo précédente"
                className="absolute left-4 lg:left-8 w-12 h-12 rounded-full bg-surface/10 text-surface flex items-center justify-center hover:bg-surface/20 transition-all"
              >
                <Icon name="chevron_left" className="text-[28px]" />
              </button>
              <button
                type="button"
                onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
                aria-label="Photo suivante"
                className="absolute right-4 lg:right-8 w-12 h-12 rounded-full bg-surface/10 text-surface flex items-center justify-center hover:bg-surface/20 transition-all"
              >
                <Icon name="chevron_right" className="text-[28px]" />
              </button>
            </>
          )}

          <div className="max-w-5xl w-full px-space-lg flex flex-col items-center gap-space-md">
            <div
              className="w-full h-[60vh] rounded-xl bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${images[openIndex].image.path}')` }}
              role="img"
              aria-label={images[openIndex].image.alt}
            />
            <div className="text-surface text-center">
              <div className="font-label-md font-bold">{images[openIndex].caption}</div>
              {images.length > 1 && (
                <div className="text-label-sm text-surface-variant mt-1">
                  Photo {openIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
