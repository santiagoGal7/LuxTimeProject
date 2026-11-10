"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmblaRow } from "@/components/embla-row";
import { Magnetic } from "@/components/magnetic";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/split-text";
import { StoryScrub } from "@/components/story-scrub";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQ, POSTS, TESTIMONIALS, TIMELINE, formatPostDate } from "@/lib/content";
import { collectionLabel } from "@/lib/labels";
import { SEED_PRODUCTS } from "@/lib/seed";
import type { Collection } from "@/lib/types";

const WatchScene = dynamic(() => import("@/components/watch-scene").then((mod) => mod.WatchScene), {
  ssr: false,
});

const COLLECTIONS: { id: Collection; image: string; text: string }[] = [
  { id: "clasica", image: "/media/silver.webp", text: "36 a 42 mm, para la manga y la cena." },
  { id: "sport", image: "/media/sport.webp", text: "Acero, titanio y cerámica hasta 300 m." },
  { id: "alta", image: "/media/gold.webp", text: "Oro, platino y los dos tourbillons." },
  { id: "heritage", image: "/media/pocket.webp", text: "Cuerda manual y la caja de 1940." },
];

const MARQUEE = [
  "Ginebra",
  "Calibre propio",
  "Zafiro",
  "1940",
  "Diez sedes",
  "Grabado en taller",
  "Series cortas",
];

export function HomeView() {
  const [webgl, setWebgl] = useState(false);
  const featured = SEED_PRODUCTS.filter((product) => product.featured);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    try {
      const canvas = document.createElement("canvas");
      setWebgl(
        !narrow && Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
      );
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <div>
      <section className="relative -mt-16 min-h-[100svh] overflow-hidden bg-canvas text-ink">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_320px_at_80%_40%,rgb(var(--metal)/0.18),transparent_70%)]" />
        <div className="relative mx-auto grid min-h-[100svh] w-full max-w-page items-center gap-10 px-4 pb-16 pt-28 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:px-8 xl:px-10">
          <div className="max-w-xl">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brass">
              Atelier de Ginebra · desde 1940
            </p>
            <SplitText
              as="h1"
              text="Relojes construidos para quedarse en la muñeca décadas."
              className="mt-4 text-balance font-display text-[2.5rem] leading-[0.95] text-ink sm:text-6xl lg:text-7xl"
            />
            <p className="mt-6 max-w-md text-pretty text-base leading-7 text-ink/75">
              LuxTime fabrica calibres propios en series cortas. Cada referencia sale con
              certificado, reserva de marcha declarada y grabado opcional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Magnetic>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/catalogo">Explorar catálogo</Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild variant="quiet" className="w-full sm:w-auto">
                  <Link href="/historia">La historia del taller</Link>
                </Button>
              </Magnetic>
            </div>
          </div>
          <div className="plate relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-canvas-2">
            <Image
              src="/media/gold.webp"
              alt="Reloj de oro del salón, sobre marfil"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
        <dl className="relative mx-auto grid w-full max-w-page grid-cols-2 gap-4 border-t border-brass/40 px-4 py-5 sm:px-6 md:grid-cols-4 md:px-8 xl:px-10">
          {[
            ["1940", "Fundación"],
            ["26", "Referencias"],
            ["36–44", "Milímetros"],
            ["10", "Sedes"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-mute">{label}</dt>
              <dd className="mt-1 font-display text-3xl text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell grid items-center gap-8 overflow-hidden md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-brass">Objeto</p>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">Un calibre que se puede mirar de frente.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-ink/75">
            El reloj del salón está modelado en el navegador: caja, bisel de latón y agujas que marcan la hora real.
            En el teléfono se queda la fotografía, para no cargar el lienzo.
          </p>
        </div>
        <div className="relative mx-auto h-[320px] w-full max-w-xl overflow-hidden bg-canvas-2 sm:h-[420px]">
          {webgl ? (
            <WatchScene />
          ) : (
            <Image src="/media/chrono.webp" alt="Cronógrafo de acero del atelier" fill className="object-cover" />
          )}
        </div>
      </section>

      <div className="w-full max-w-[100vw] overflow-x-clip border-y border-line/20 bg-canvas-2 py-3">
        <div className="marquee-track flex w-max gap-10 text-[0.68rem] uppercase tracking-[0.22em] text-ink/70">
          {[0, 1].map((copy) => (
            <p key={copy} className="flex gap-10">
              {MARQUEE.map((item) => (
                <span key={`${copy}-${item}`}>{item}</span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <section className="shell">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl md:text-5xl">Colecciones</h2>
            <Link
              href="/catalogo"
              className="text-[0.68rem] uppercase tracking-[0.16em] text-forest"
            >
              Todas las piezas
            </Link>
          </div>
        </Reveal>
        <div className="mt-8">
          <EmblaRow label="Colecciones">
            {COLLECTIONS.map((collection) => (
              <div
                key={collection.id}
                className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_48%] lg:flex-[0_0_32%]"
              >
                <Link
                  href={`/catalogo?coleccion=${collection.id}`}
                  className="group relative block min-h-80 overflow-hidden bg-canvas-2"
                >
                  <Image
                    src={collection.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 86vw, 32vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10211c] via-[#10211c]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-[#f4efe6]">
                    <h3 className="font-display text-3xl">{collectionLabel[collection.id]}</h3>
                    <p className="mt-1 text-sm text-[#f4efe6]/80">{collection.text}</p>
                  </div>
                </Link>
              </div>
            ))}
          </EmblaRow>
        </div>
      </section>

      <StoryScrub />

      <section className="shell">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">Piezas en vitrina</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-ink/70">
            Las seis referencias de la portada original, con casa, calibre y stock.
          </p>
        </Reveal>
        <div className="mt-8">
          <EmblaRow label="Piezas en vitrina">
            {featured.map((product) => (
              <div
                key={product.id}
                className="min-w-0 flex-[0_0_78%] sm:flex-[0_0_46%] lg:flex-[0_0_32%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </EmblaRow>
        </div>
      </section>

      <section className="shell grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src="/media/atelier.webp"
              alt="Banco de trabajo del atelier con un calibre desmontado"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Historia</p>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            De un banco en Ginebra a diez sedes.
          </h2>
          <ol className="mt-6 divide-y divide-line/20 border-y border-line/20">
            {TIMELINE.map((event) => (
              <li key={event.year} className="flex gap-4 py-3 text-sm">
                <span className="w-14 text-brass">{event.year}</span>
                <span>{event.title}</span>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-6">
            <Link href="/historia">Conocer más</Link>
          </Button>
        </Reveal>
      </section>

      <section className="border-y border-line/20 bg-canvas-2">
        <div className="shell grid gap-10 md:grid-cols-[1.3fr_0.7fr]">
          <EmblaRow label="Testimonios">
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.name}
                className="min-w-0 flex-[0_0_100%] pr-2 md:flex-[0_0_88%]"
              >
                <p className="text-balance font-display text-4xl leading-[1.05] md:text-5xl">
                  “{item.quote}”
                </p>
                <footer className="mt-6 text-[0.68rem] uppercase tracking-[0.18em] text-forest">
                  {item.name} · {item.detail}
                </footer>
              </blockquote>
            ))}
          </EmblaRow>
          <p className="text-sm leading-7 text-ink/70 md:border-l md:border-line/20 md:pl-8">
            Tres voces del mostrador. El grabado llega donde se pidió, y el stock se escribe con un
            número.
          </p>
        </div>
      </section>

      <section className="shell grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Cuaderno</p>
          <h2 className="mt-3 font-display text-4xl">Notas del taller</h2>
          <div className="relative mt-6 aspect-[4/3] overflow-hidden">
            <Image
              src="/media/movement.webp"
              alt="Macro de un calibre con Côtes de Genève"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <ul className="divide-y divide-line/20 border-y border-line/20">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="grid gap-2 py-6 hover:text-forest md:grid-cols-[8rem_1fr]"
              >
                <span className="text-xs uppercase tracking-[0.16em] text-mute">
                  {formatPostDate(post.date)}
                </span>
                <span>
                  <span className="block font-display text-3xl text-ink">{post.title}</span>
                  <span className="mt-2 block text-sm text-ink/70">{post.excerpt}</span>
                  <span className="mt-2 block text-[0.68rem] uppercase tracking-[0.16em] text-brass">
                    {post.author}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell !pt-0">
        <h2 className="font-display text-4xl">Preguntas de mostrador</h2>
        <Accordion type="single" collapsible className="mt-6">
          {FAQ.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
