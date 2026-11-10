"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || pathname.startsWith("/admin")) return;

    let lenis: Lenis | null = null;
    let frame = 0;
    let ticker: ((time: number) => void) | null = null;
    let cancelled = false;

    void import("gsap").then(async ({ default: gsap }) => {
      if (cancelled) return;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ lerp: 0.085 });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    });

    const fallback = window.setTimeout(() => {
      if (lenis || cancelled) return;
      const local = new Lenis({ lerp: 0.085 });
      lenis = local;
      const loop = (time: number) => {
        local.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
      if (ticker) {
        void import("gsap").then(({ default: gsap }) => {
          gsap.ticker.remove(ticker!);
        });
      }
      lenis?.destroy();
    };
  }, [pathname]);

  return null;
}
