"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AtelierLoader } from "@/components/atelier-loader";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");

  return (
    <>
      <AtelierLoader />
      <SmoothScroll />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-forest focus:px-3 focus:py-2 focus:text-canvas"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className={admin ? "min-h-screen" : "min-h-screen pt-16"}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
