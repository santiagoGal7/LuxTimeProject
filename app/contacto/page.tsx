import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacto del atelier LuxTime en Ginebra.",
};

export default function ContactPage() {
  return (
    <div className="shell grid gap-12 md:grid-cols-2">
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Mostrador</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Escríbenos antes de encargar.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/75">
          El formulario guarda el mensaje en este navegador para que el panel del atelier pueda
          leerlo. No sale un correo.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-mute">Correo</dt>
            <dd>
              <a className="hover:text-forest" href="mailto:contacto@luxtime.com">
                contacto@luxtime.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-mute">Teléfono</dt>
            <dd>
              <a className="hover:text-forest" href="tel:+1234567890">
                +1 (234) 567-890
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-mute">Redes</dt>
            <dd className="flex gap-4">
              <a className="hover:text-forest" href="https://instagram.com/luxtime">
                Instagram
              </a>
              <a className="hover:text-forest" href="https://x.com/luxtime">
                X
              </a>
            </dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </div>
  );
}
