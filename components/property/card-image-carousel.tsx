"use client";

import { useState, type MouseEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { StitchImage } from "@/lib/types";

export function CardImageCarousel({ images, imageClassName }: { images: StitchImage[]; imageClassName?: string }) {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const current = images[index] ?? images[0];
  const step = (delta: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIndex((previous) => (previous + delta + images.length) % images.length);
  };

  return <>
    <div className={cn("absolute inset-0 bg-cover bg-center transition-transform duration-500", imageClassName)} style={{ backgroundImage: `url('${current.path}')` }} role="img" aria-label={current.alt} />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-anthracite/25 via-transparent to-transparent" />
    {hasMultiple && <>
      <button type="button" onClick={step(-1)} aria-label="Photo précédente" className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-on-surface shadow-md transition-all hover:bg-surface sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"><Icon name="chevron_left" className="text-[19px]" /></button>
      <button type="button" onClick={step(1)} aria-label="Photo suivante" className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-on-surface shadow-md transition-all hover:bg-surface sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"><Icon name="chevron_right" className="text-[19px]" /></button>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-anthracite/30 px-2 py-1 backdrop-blur-sm">{images.map((image, imageIndex) => <span key={image.path} className={cn("h-1.5 rounded-full bg-surface/70 transition-all", imageIndex === index ? "w-4 bg-surface" : "w-1.5")} />)}</div>
    </>}
  </>;
}