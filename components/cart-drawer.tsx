"use client";

import Image from "next/image";
import Link from "next/link";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { summarize } from "@/lib/cart";
import { selectCatalog, useLuxStore } from "@/lib/store";

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const cart = useLuxStore((state) => state.cart);
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const summary = summarize(cart, selectCatalog({ overrides, customProducts }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-4 top-20 max-h-[80vh] w-[min(100%-2rem,24rem)] translate-x-0 translate-y-0 overflow-auto">
        <DialogTitle>Pedido</DialogTitle>
        {summary.lines.length === 0 ? (
          <p className="mt-6 text-sm text-mute">El pedido está vacío.</p>
        ) : (
          <ul className="mt-6 divide-y divide-line/20">
            {summary.lines.map((line) => (
              <li key={line.key} className="flex gap-3 py-3">
                <div className="relative h-16 w-16 shrink-0 bg-forest/10">
                  <Image src={line.product.images[0] ?? "/media/silver.webp"} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-2xl">{line.product.name}</p>
                  <p className="text-xs text-mute">× {line.qty}</p>
                </div>
                <Money value={line.total} className="ml-auto text-sm" />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 flex justify-between border-t border-line/20 pt-3 text-sm">
          <span>Total</span>
          <Money value={summary.total} />
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild variant="quiet" onClick={() => onOpenChange(false)}>
            <Link href="/carrito">Ver el carrito</Link>
          </Button>
          <Button asChild onClick={() => onOpenChange(false)}>
            <Link href="/checkout">Ir al pago</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
