"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");

  return (
    <>
      <SmoothScroll />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-3 focus:py-2 focus:text-navy"
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
