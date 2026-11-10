"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function EmblaRow({ label, children }: { label: string; children: ReactNode }) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });

  return (
    <div className="min-w-0">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          className="border border-line/30 p-2 hover:border-forest hover:text-forest"
          aria-label={`Anterior en ${label}`}
          onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="border border-line/30 p-2 hover:border-forest hover:text-forest"
          aria-label={`Siguiente en ${label}`}
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="min-w-0 overflow-x-clip" ref={ref} aria-roledescription="carrusel" aria-label={label}>
        <div className="flex min-w-0 gap-4">{children}</div>
      </div>
    </div>
  );
}
