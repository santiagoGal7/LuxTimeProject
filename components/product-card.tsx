"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Money } from "@/components/money";
import { QuickView } from "@/components/quick-view";
import { useStoreHydrated } from "@/lib/use-hydrated";
import { materialLabel, movementLabel } from "@/lib/labels";
import { useLuxStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const hydrated = useStoreHydrated();
  const wished = useLuxStore((state) => state.wishlist.includes(product.id));
  const toggle = useLuxStore((state) => state.toggleWishlist);
  const saved = hydrated && wished;
  const [quick, setQuick] = useState(false);

  return (
    <article className="plate group relative p-3">
      <QuickView product={product} open={quick} onOpenChange={setQuick} />
      <div className="plate relative aspect-[4/5] overflow-hidden bg-forest/10">
        <Link href={`/producto/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          <Image
            src={product.images[0] ?? "/media/silver.webp"}
            alt={`${product.name} de ${product.brand}`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04] group-hover:opacity-0"
            priority={priority}
          />
          <Image
            src={product.images[1] ?? product.images[0] ?? "/media/movement.webp"}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
          />
        </Link>
        <button type="button" className="badge absolute bottom-3 left-3 z-10" onClick={() => setQuick(true)}>
          Vista rápida
        </button>
      </div>
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="mt-3 flex items-start justify-between gap-3 border-t border-line/20 pt-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-forest">
              {product.brand}
            </p>
            <h3 className="mt-1 font-display text-2xl leading-none text-ink">{product.name}</h3>
            <p className="mt-2 text-xs text-mute">
              {product.sizeMm} mm · {materialLabel[product.material]} ·{" "}
              {movementLabel[product.movement]}
            </p>
          </div>
          <div className="text-right">
            <Money value={product.price} className="text-sm text-ink" />
            <p
              className={cn(
                "mt-1 text-[0.65rem] uppercase tracking-[0.14em]",
                product.stock > 0 ? "text-forest" : "text-red-300",
              )}
            >
              {product.stock > 0 ? "En stock" : "Agotado"}
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-pressed={saved}
        aria-label={
          saved ? `Quitar ${product.name} de deseos` : `Guardar ${product.name} en deseos`
        }
        onClick={() => toggle(product.id)}
        className="plate absolute right-5 top-5 bg-canvas/80 p-2 text-ink hover:text-forest"
      >
        <Heart className={cn("h-4 w-4", saved && "fill-forest text-forest")} />
      </button>
    </article>
  );
}
