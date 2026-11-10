"use client";

import Image from "next/image";
import Link from "next/link";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { materialLabel } from "@/lib/labels";
import { useLuxStore } from "@/lib/store";
import type { Product } from "@/lib/types";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const add = useLuxStore((state) => state.addToCart);
  if (!product) return null;
  const variant = product.variants[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="plate relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] ?? "/media/silver.webp"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="256px"
          />
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-brass">{product.brand}</p>
          <DialogTitle className="mt-2">{product.name}</DialogTitle>
          <p className="mt-3 text-sm leading-6 text-ink/75">{product.description}</p>
          <p className="mt-4 text-2xl">
            <Money value={product.price} />
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-mute">
            {product.sizeMm} mm · {materialLabel[product.material]} ·{" "}
            {product.stock > 0 ? "En stock" : "Agotado"}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button
              disabled={product.stock < 1 || !variant}
              onClick={() => {
                if (!variant) return;
                add({
                  productId: product.id,
                  variantId: variant.id,
                  engraving: "ninguno",
                  engravingText: "",
                  qty: 1,
                });
                onOpenChange(false);
              }}
            >
              Añadir al pedido
            </Button>
            <Button asChild variant="quiet" onClick={() => onOpenChange(false)}>
              <Link href={`/producto/${product.slug}`}>Ficha completa</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
