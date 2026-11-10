import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "Sistema" };

export default function SystemPage() {
  return (
    <div className="shell max-w-3xl">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-brass">Sistema</p>
      <h1 className="mt-3 font-display text-5xl">Botones y campos</h1>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button>Primario</Button>
        <Button variant="quiet">Secundario</Button>
        <Button variant="ghost">Fantasma</Button>
        <Button size="icon" aria-label="Icono">
          +
        </Button>
        <Button loading>Cargando</Button>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <button type="button" className="chip">
          Acero
        </button>
        <button type="button" className="chip" aria-pressed="true">
          Oro
        </button>
        <span className="badge">En stock</span>
      </div>
      <label className="mt-8 block text-[0.68rem] uppercase tracking-[0.16em] text-mute">
        Correo
        <Input className="mt-2" placeholder="tu@correo.com" />
      </label>
    </div>
  );
}
