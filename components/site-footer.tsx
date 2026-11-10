"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 bg-forest text-canvas">
      <div className="rule" />
      <p className="overflow-hidden px-4 pt-8 text-center font-display text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-[-0.04em] text-canvas/15">
        LUXTIME
      </p>
      <div className="mx-auto grid max-w-page gap-12 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="text-sm tracking-[0.32em]">
            LUX<span className="text-brass">TIME</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-canvas/75">
            Taller de Ginebra desde 1940. Calibres propios, series cortas y un catálogo que dice el
            stock en voz alta.
          </p>
          <NewsletterForm />
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-brass">Casa</p>
          <ul className="mt-4 space-y-2 text-sm text-canvas/85">
            <li>
              <Link href="/catalogo" className="hover:text-brass">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/historia" className="hover:text-brass">
                Historia
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brass">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-brass">
                Preguntas
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-brass">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/cuenta" className="hover:text-brass">
                Cuenta
              </Link>
            </li>
            <li>
              <Link href="/pedidos" className="hover:text-brass">
                Pedidos
              </Link>
            </li>
            <li>
              <Link href="/deseos" className="hover:text-brass">
                Deseos
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brass">
                Panel del atelier
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-brass">Contacto</p>
          <ul className="mt-4 space-y-2 text-sm text-canvas/85">
            <li>
              <a href="mailto:contacto@luxtime.com" className="hover:text-brass">
                contacto@luxtime.com
              </a>
            </li>
            <li>
              <a href="tel:+1234567890" className="hover:text-brass">
                +1 (234) 567-890
              </a>
            </li>
            <li>Rue du Rhône 12, Ginebra</li>
            <li className="pt-4 text-canvas/70">
              Desarrollo:{" "}
              <a
                href="https://github.com/santiagoGal7"
                className="text-canvas hover:text-brass"
                target="_blank"
                rel="noreferrer"
              >
                Santiago Gallo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-canvas/20">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-4 text-xs text-canvas/60 md:flex-row md:justify-between md:px-8">
          <span>© {new Date().getFullYear()} LuxTime</span>
          <span>Pago simulado. Ninguna tarjeta se envía a una pasarela.</span>
        </div>
      </div>
    </footer>
  );
}
