"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Money } from "@/components/money";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { relatedProducts } from "@/lib/catalog";
import { engravingLabel, materialLabel, movementLabel } from "@/lib/labels";
import { ENGRAVING_FEE, unitPrice } from "@/lib/pricing";
import { selectCatalog, useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import type { Engraving, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const ENGRAVINGS: Engraving[] = ["ninguno", "iniciales", "fecha"];

export function ProductView({ initial, slug }: { initial: Product | null; slug: string }) {
  const hydrated = useStoreHydrated();
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const products = useMemo(
    () => selectCatalog({ overrides, customProducts }),
    [overrides, customProducts],
  );
  const live = useMemo(() => {
    if (!hydrated) return initial;
    return products.find((product) => product.slug === slug) ?? initial;
  }, [hydrated, products, initial, slug]);

  if (!live) {
    return (
      <div className="mx-auto max-w-page px-4 py-24 md:px-8">
        <h1 className="font-display text-5xl">Esta referencia no está en el catálogo.</h1>
        <Button asChild className="mt-8">
          <Link href="/catalogo">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  return <ProductDetail product={live} catalog={hydrated ? products : products} />;
}

function ProductDetail({ product, catalog }: { product: Product; catalog: Product[] }) {
  const [image, setImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "cuero");
  const [engraving, setEngraving] = useState<Engraving>("ninguno");
  const [engravingText, setEngravingText] = useState("");
  const addToCart = useLuxStore((state) => state.addToCart);
  const toggleWishlist = useLuxStore((state) => state.toggleWishlist);
  const wished = useLuxStore((state) => state.wishlist.includes(product.id));
  const notice = useLuxStore((state) => state.notice);
  const price = unitPrice(product, variantId, engraving);
  const related = relatedProducts(catalog.length ? catalog : [product], product);
  const current = product.images[image] ?? product.images[0];

  return (
    <article className="mx-auto max-w-page px-4 py-10 md:px-8">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-mute">
        <Link href="/catalogo" className="hover:text-gold">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        {product.brand}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <button
            type="button"
            className="relative block aspect-square w-full bg-navy"
            onClick={() => setZoom(true)}
          >
            {current ? (
              <Image
                src={current}
                alt={`${product.name}, vista ${image + 1}`}
                fill
                className="object-cover"
                priority
              />
            ) : null}
            <span className="absolute bottom-3 right-3 bg-ink/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em]">
              Ampliar
            </span>
          </button>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {product.images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Ver imagen ${index + 1}`}
                onClick={() => setImage(index)}
                className={cn(
                  "relative aspect-square bg-navy",
                  index === image && "outline outline-1 outline-gold",
                )}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">{product.brand}</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 text-2xl">
            <Money value={price} />
          </p>
          <p
            className={cn(
              "mt-2 text-[0.68rem] uppercase tracking-[0.16em]",
              product.stock > 0 ? "text-gold" : "text-red-300",
            )}
          >
            {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
          </p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/75">{product.description}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ivory/60">{product.story}</p>

          <fieldset className="mt-8">
            <legend className="text-[0.68rem] uppercase tracking-[0.16em] text-gold">Correa</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={variantId === variant.id}
                  onClick={() => setVariantId(variant.id)}
                  className={cn(
                    "border px-3 py-2 text-left text-xs uppercase tracking-[0.12em]",
                    variantId === variant.id ? "border-gold text-gold" : "border-white/15",
                  )}
                >
                  {variant.label}
                  <span className="mt-1 block normal-case tracking-normal text-mute">
                    {variant.priceDelta > 0 ? `+${variant.priceDelta} USD` : "Incluida"}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-[0.68rem] uppercase tracking-[0.16em] text-gold">
              Grabado
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {ENGRAVINGS.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={engraving === option}
                  onClick={() => setEngraving(option)}
                  className={cn(
                    "border px-3 py-2 text-xs uppercase tracking-[0.12em]",
                    engraving === option ? "border-gold text-gold" : "border-white/15",
                  )}
                >
                  {engravingLabel[option]}
                </button>
              ))}
            </div>
            {engraving !== "ninguno" ? (
              <label className="mt-3 block text-sm text-mute">
                Texto del grabado
                <input
                  value={engravingText}
                  maxLength={18}
                  onChange={(event) => setEngravingText(event.target.value)}
                  className="mt-2 h-12 w-full border border-white/15 bg-transparent px-3 text-ivory"
                />
                <span className="mt-1 block">Suplemento de {ENGRAVING_FEE} USD</span>
              </label>
            ) : null}
          </fieldset>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={product.stock < 1}
              onClick={() =>
                addToCart({
                  productId: product.id,
                  variantId,
                  engraving,
                  engravingText: engraving === "ninguno" ? "" : engravingText,
                  qty: 1,
                })
              }
            >
              Añadir al pedido
            </Button>
            <Button
              variant="quiet"
              aria-pressed={wished}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} />
              {wished ? "En deseos" : "Guardar"}
            </Button>
          </div>
          {notice ? <p className="mt-3 text-sm text-gold">{notice}</p> : null}

          <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-6 text-sm">
            {[
              ["Calibre", product.calibre],
              ["Movimiento", movementLabel[product.movement]],
              ["Material", materialLabel[product.material]],
              ["Diámetro", `${product.sizeMm} mm`],
              ["Peso", `${product.weightG} g`],
              ["Hermeticidad", product.waterResistance],
              ["Reserva", product.powerReserve],
              ["Complicaciones", product.complications.join(", ")],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-white/10 pb-3">
                <dt className="text-[0.65rem] uppercase tracking-[0.14em] text-mute">{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-4xl">Piezas cercanas</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="w-[min(100%-1.5rem,64rem)]">
          <DialogTitle className="sr-only">{product.name} ampliado</DialogTitle>
          <div className="relative mt-6 aspect-square">
            {current ? (
              <Image
                src={current}
                alt={`${product.name} ampliado`}
                fill
                className="object-contain"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
