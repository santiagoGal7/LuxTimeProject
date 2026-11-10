"use client";

import Image from "next/image";
import Link from "next/link";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { lineKey, summarize } from "@/lib/cart";
import { engravingLabel } from "@/lib/labels";
import { FREE_SHIPPING_FROM } from "@/lib/pricing";
import { selectCatalog, useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export function CartView() {
  const hydrated = useStoreHydrated();
  const cart = useLuxStore((state) => state.cart);
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const updateQty = useLuxStore((state) => state.updateQty);
  const removeFromCart = useLuxStore((state) => state.removeFromCart);
  const products = selectCatalog({ overrides, customProducts });
  const summary = summarize(hydrated ? cart : [], products);

  return (
    <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Pedido</p>
        <h1 className="mt-2 font-display text-5xl">Carrito</h1>
        {summary.lines.length === 0 ? (
          <div className="mt-10 border-t border-line/20 pt-8">
            <p className="text-sm text-ink/70">Todavía no hay piezas en el pedido.</p>
            <Button asChild className="mt-6">
              <Link href="/catalogo">Ir al catálogo</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-line/20 border-y border-line/20">
            {summary.lines.map((line) => (
              <li key={line.key} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 py-5">
                <div className="relative aspect-square bg-forest/10">
                  <Image
                    src={line.product.images[0] ?? "/media/silver.webp"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-forest">
                        {line.product.brand}
                      </p>
                      <Link
                        href={`/producto/${line.product.slug}`}
                        className="font-display text-3xl hover:text-forest"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-mute">
                        {line.variantLabel} · {engravingLabel[line.engraving]}
                        {line.engravingText ? ` · ${line.engravingText}` : ""}
                      </p>
                    </div>
                    <Money value={line.total} />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <label
                      className="text-xs uppercase tracking-[0.14em] text-mute"
                      htmlFor={`qty-${line.key}`}
                    >
                      Cantidad
                    </label>
                    <input
                      id={`qty-${line.key}`}
                      type="number"
                      min={1}
                      max={line.product.stock}
                      value={line.qty}
                      onChange={(event) => updateQty(lineKey(line), Number(event.target.value))}
                      className="h-10 w-20 border border-line/25 bg-transparent px-2"
                    />
                    <button
                      type="button"
                      className="text-xs uppercase tracking-[0.14em] text-mute hover:text-forest"
                      onClick={() => removeFromCart(line.key)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside className="plate h-fit p-6">
        <h2 className="font-display text-3xl">Resumen</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt>Piezas</dt>
            <dd>
              <Money value={summary.subtotal} />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Envío</dt>
            <dd>{summary.shipping === 0 ? "Incluido" : <Money value={summary.shipping} />}</dd>
          </div>
          <div className="flex justify-between border-t border-line/20 pt-3 text-base">
            <dt>Total</dt>
            <dd>
              <Money value={summary.total} />
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-mute">
          El envío queda en cero a partir de {FREE_SHIPPING_FROM.toLocaleString("es-ES")} USD. El
          pago del siguiente paso es una simulación.
        </p>
        <Button asChild className="mt-6 w-full" disabled={summary.lines.length === 0}>
          <Link href="/checkout" aria-disabled={summary.lines.length === 0}>
            Continuar al pago
          </Link>
        </Button>
      </aside>
    </div>
  );
}
