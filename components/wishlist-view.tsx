"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { selectCatalog, useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export function WishlistView() {
  const hydrated = useStoreHydrated();
  const wishlist = useLuxStore((state) => state.wishlist);
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const products = useMemo(() => {
    const catalog = selectCatalog({ overrides, customProducts });
    if (!hydrated) return [];
    return catalog.filter((product) => wishlist.includes(product.id));
  }, [hydrated, overrides, customProducts, wishlist]);

  return (
    <div className="mx-auto max-w-page px-4 py-10 md:px-8">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">Guardadas</p>
      <h1 className="mt-2 font-display text-5xl">Lista de deseos</h1>
      {products.length === 0 ? (
        <div className="mt-8">
          <p className="text-sm text-ivory/70">No hay piezas guardadas en este navegador.</p>
          <Button asChild className="mt-6">
            <Link href="/catalogo">Ver el catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
