"use client";

import { useMemo } from "react";
import { ProductView } from "@/components/product-view";
import { selectCatalog, useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export function ClientProduct({ slug }: { slug: string }) {
  const hydrated = useStoreHydrated();
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const product = useMemo(() => {
    if (!hydrated) return null;
    return selectCatalog({ overrides, customProducts }).find((item) => item.slug === slug) ?? null;
  }, [hydrated, overrides, customProducts, slug]);

  if (!hydrated) {
    return <p className="px-4 py-24 text-sm text-mute">Abriendo la ficha…</p>;
  }

  return <ProductView initial={product} slug={slug} />;
}
