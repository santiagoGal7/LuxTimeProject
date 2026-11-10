import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">404</p>
      <h1 className="mt-3 font-display text-5xl">Esa página no está en el atelier.</h1>
      <Button asChild className="mt-8">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
