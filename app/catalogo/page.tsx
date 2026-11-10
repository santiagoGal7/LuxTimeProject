import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/catalog-browser";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Catálogo de LuxTime con filtros de casa, precio, material, movimiento y tamaño.",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<p className="px-4 py-24 text-sm text-mute">Abriendo el catálogo…</p>}>
      <CatalogBrowser />
    </Suspense>
  );
}
