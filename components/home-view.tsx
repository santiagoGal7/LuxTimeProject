"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
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

export function HomeView() {
  const [webgl, setWebgl] = useState(true);
  const featured = SEED_PRODUCTS.filter((product) => product.featured);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <div>
      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-page items-center gap-6 px-4 pb-16 pt-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:px-8">
        <div className="order-2 md:order-1">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            Atelier de Ginebra · desde 1940
          </p>
          <h1 className="mt-4 max-w-xl text-balance font-display text-5xl leading-[0.95] text-ivory sm:text-6xl lg:text-7xl">
            Relojes construidos para quedarse en la muñeca décadas.
          </h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-7 text-ivory/75">
            LuxTime fabrica calibres propios en series cortas. Cada referencia sale con certificado,
            reserva de marcha declarada y grabado opcional.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/catalogo">Explorar catálogo</Link>
            </Button>
            <Button asChild variant="quiet">
              <Link href="/historia">La historia del taller</Link>
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-gold/30 pt-4 text-sm sm:grid-cols-4">
            {[
              ["1940", "Fundación"],
              ["26", "Referencias"],
              ["36–44", "Milímetros"],
              ["10", "Sedes"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-mute">{label}</dt>
                <dd className="mt-1 font-display text-2xl text-ivory">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative order-1 h-[280px] w-full overflow-hidden sm:h-[420px] md:order-2 lg:h-[620px]">
          <div className="absolute inset-8 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),transparent_62%)]" />
          {webgl ? (
            <WatchScene />
          ) : (
            <Image
              src="/media/chrono.webp"
              alt="Cronógrafo de acero del atelier"
              fill
              className="object-contain"
              priority
            />
          )}
        </div>
      </section>

      <div className="overflow-hidden border-y border-gold/30 py-3">
        <div className="marquee-track flex w-max gap-10 text-[0.68rem] uppercase tracking-[0.22em] text-ivory/70">
          {Array.from({ length: 2 }).map((_, copy) => (
            <p key={copy} className="flex gap-10">
              {[
                "Ginebra",
                "Calibre propio",
                "Zafiro",
                "1940",
                "Diez sedes",
                "Grabado en taller",
                "Series cortas",
              ].map((item) => (
                <span key={`${copy}-${item}`}>{item}</span>
              ))}
            </p>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-page px-4 py-20 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl text-ivory md:text-5xl">Colecciones</h2>
            <Link href="/catalogo" className="text-[0.68rem] uppercase tracking-[0.16em] text-gold">
              Todas las piezas
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-px bg-gold/25 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.id}
              href={`/catalogo?coleccion=${collection.id}`}
              className="group relative min-h-72 bg-ink"
            >
              <Image
                src={collection.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-3xl">{collectionLabel[collection.id]}</h3>
                <p className="mt-1 text-sm text-ivory/75">{collection.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-page px-4 py-8 md:px-8">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">Piezas en vitrina</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-ivory/70">
            Las seis referencias que abrían la portada original, ahora con casa, calibre y stock.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-page items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
        <Reveal>
          <div className="relative aspect-[16/10]">
            <Image
              src="/media/atelier.webp"
              alt="Banco de trabajo del atelier con un calibre desmontado"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">Historia</p>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            De un banco en Ginebra a diez sedes.
          </h2>
          <p className="mt-4 text-sm leading-7 text-ivory/75">
            La misión sigue siendo la de 1940: piezas que perduren. La visión añade una fabricación
            más sobria y un catálogo que se puede leer entero.
          </p>
          <ol className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {TIMELINE.map((event) => (
              <li key={event.year} className="flex gap-4 py-3 text-sm">
                <span className="w-14 text-gold">{event.year}</span>
                <span>{event.title}</span>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-6">
            <Link href="/historia">Conocer más</Link>
          </Button>
        </Reveal>
      </section>

      <section className="border-y border-gold/30 bg-navy/40">
        <div className="mx-auto grid max-w-page gap-10 px-4 py-16 md:grid-cols-[1.4fr_0.8fr] md:px-8">
          <blockquote>
            <p className="text-balance font-display text-4xl leading-[1.05] md:text-6xl">
              “{TESTIMONIALS[0]?.quote}”
            </p>
            <footer className="mt-6 text-[0.68rem] uppercase tracking-[0.18em] text-gold">
              {TESTIMONIALS[0]?.name} · {TESTIMONIALS[0]?.detail}
            </footer>
          </blockquote>
          <ul className="space-y-6 border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            {TESTIMONIALS.slice(1).map((item) => (
              <li key={item.name}>
                <p className="text-sm leading-7 text-ivory/80">“{item.quote}”</p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.16em] text-mute">
                  {item.name} · {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-page gap-10 px-4 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">Cuaderno</p>
          <h2 className="mt-3 font-display text-4xl">Notas del taller</h2>
          <div className="relative mt-6 aspect-[4/3]">
            <Image
              src="/media/movement.webp"
              alt="Macro de un calibre con Côtes de Genève"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="grid gap-2 py-6 hover:text-gold md:grid-cols-[8rem_1fr]"
              >
                <span className="text-xs uppercase tracking-[0.16em] text-mute">
                  {formatPostDate(post.date)}
                </span>
                <span>
                  <span className="block font-display text-3xl text-ivory">{post.title}</span>
                  <span className="mt-2 block text-sm text-ivory/70">{post.excerpt}</span>
                  <span className="mt-2 block text-[0.68rem] uppercase tracking-[0.16em] text-gold">
                    {post.author}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-page px-4 pb-8 md:px-8">
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
