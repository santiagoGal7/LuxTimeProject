"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const BEATS = [
  {
    kicker: "01",
    title: "La caja",
    text: "Oro, acero o platino. El diámetro se declara en milímetros, no en adjetivos.",
    image: "/media/gold.webp",
  },
  {
    kicker: "02",
    title: "El calibre",
    text: "Cada LT se regula en Ginebra. La reserva de marcha va escrita en la ficha.",
    image: "/media/movement.webp",
  },
  {
    kicker: "03",
    title: "La muñeca",
    text: "Correa, grabado y certificado salen en la misma caja. El stock no se disfraza.",
    image: "/media/minimal.webp",
  },
];

export function StoryScrub() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    if (reduce || narrow || !root.current || !track.current) return;

    let revert = () => {};
    let alive = true;

    void import("gsap").then(async ({ default: gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!alive || !root.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const tween = gsap.to(track.current, {
        xPercent: (-100 * (BEATS.length - 1)) / BEATS.length,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (BEATS.length - 1)}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      revert = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      alive = false;
      revert();
    };
  }, []);

  return (
    <section ref={root} className="relative bg-forest text-canvas">
      <div className="overflow-hidden">
        <div ref={track} className="flex w-full flex-col md:w-[300%] md:flex-row">
          {BEATS.map((beat) => (
            <article
              key={beat.kicker}
              className="grid min-h-[70vh] items-center gap-8 px-4 py-16 md:min-h-screen md:w-1/3 md:grid-cols-2 md:px-10"
            >
              <div className="mx-auto w-full max-w-xl">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brass">
                  {beat.kicker}
                </p>
                <h2 className="mt-3 font-display text-5xl md:text-7xl">{beat.title}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-canvas/80">{beat.text}</p>
              </div>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden">
                <Image
                  src={beat.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
