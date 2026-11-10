"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Money } from "@/components/money";
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

  return (
    <article className="group relative">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-forest/10">
          <Image
            src={product.images[0] ?? "/media/silver.webp"}
            alt={`${product.name} de ${product.brand}`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={priority}
          />
        </div>
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
        className="absolute right-3 top-3 bg-canvas/70 p-2 text-ink hover:text-forest"
      >
        <Heart className={cn("h-4 w-4", saved && "fill-forest text-forest")} />
      </button>
    </article>
  );
}
