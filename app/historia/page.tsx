import type { Metadata } from "next";
import Image from "next/image";
import { TIMELINE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Historia",
  description: "Historia de LuxTime, del taller de Ginebra en 1940 a las diez sedes actuales.",
};

export default function HistoryPage() {
  return (
    <article className="shell">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Desde 1940</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight md:text-7xl">
        Un taller que sigue regulando la marcha en Ginebra.
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-ink/75">
        LuxTime nació como banco de relojero y hoy tiene diez sedes. La misión es hacer piezas que
        duren. La visión es una fabricación más sobria, con el número de serie y la reserva de
        marcha escritos en la ficha.
      </p>
      <div className="relative mt-10 aspect-[16/8]">
        <Image
          src="/media/alps.webp"
          alt="Valle alpino cerca del origen suizo del taller"
          fill
          className="object-cover"
          priority
        />
      </div>
      <ol className="mt-16 space-y-16">
        {TIMELINE.map((event) => (
          <li key={event.year} className="grid items-center gap-6 md:grid-cols-[8rem_1fr_1fr]">
            <p className="font-display text-5xl text-forest">{event.year}</p>
            <div>
              <h2 className="font-display text-4xl">{event.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/75">{event.text}</p>
            </div>
            <div className="relative aspect-[4/3]">
              <Image src={event.image} alt="" fill className="object-cover" />
            </div>
          </li>
        ))}
      </ol>
      <section className="mt-20 grid gap-10 border-t border-forest/30 pt-10 md:grid-cols-3">
        <div>
          <h2 className="font-display text-3xl">Misión</h2>
          <p className="mt-3 text-sm leading-7 text-ink/75">
            Crear relojes que perduren, con la excelencia del banco y no con un eslogan.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl">Visión</h2>
          <p className="mt-3 text-sm leading-7 text-ink/75">
            Seguir en la alta relojería con menos embalaje, menos ruido y más ficha técnica.
          </p>
        </div>
        <div>
          <h2 className="font-display text-3xl">Valores</h2>
          <p className="mt-3 text-sm leading-7 text-ink/75">
            Artesanía, integridad e innovación. Premio de diseño 2023 y certificación ambiental del
            taller.
          </p>
        </div>
      </section>
      <blockquote className="mt-16 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
        “LuxTime no solo mide el tiempo, lo eterniza.”
        <footer className="mt-4 text-sm tracking-[0.16em] text-forest">Cliente desde 1990</footer>
      </blockquote>
    </article>
  );
}
