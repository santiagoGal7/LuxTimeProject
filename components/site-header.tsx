"use client";

import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cartCount } from "@/lib/cart";
import { filterProducts } from "@/lib/catalog";
import { selectCatalog, useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/historia", label: "Historia" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const cart = useLuxStore((state) => state.cart);
  const wishlist = useLuxStore((state) => state.wishlist);
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = hydrated ? cartCount(cart) : 0;
  const wishes = hydrated ? wishlist.length : 0;
  const products = useMemo(
    () => selectCatalog({ overrides, customProducts }),
    [overrides, customProducts],
  );
  const results = query.trim() ? filterProducts(products, { q: query }).slice(0, 6) : [];

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-gold/30 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-page items-center gap-4 px-4 md:px-8">
        <button
          type="button"
          className="p-2 md:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="font-sans text-sm tracking-[0.32em] text-ivory">
          LUX<span className="text-gold">TIME</span>
        </Link>
        <nav aria-label="Principal" className="ml-8 hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[0.68rem] uppercase tracking-[0.18em] text-ivory/70 hover:text-gold",
                pathname.startsWith(link.href) && "text-gold",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="p-2 hover:text-gold"
            aria-label="Buscar"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/deseos"
            className="relative p-2 hover:text-gold"
            aria-label={`Lista de deseos, ${wishes} piezas`}
          >
            <Heart className="h-4 w-4" />
            {wishes > 0 ? (
              <span className="absolute right-0 top-0 text-[0.6rem] text-gold">{wishes}</span>
            ) : null}
          </Link>
          <Link
            href="/carrito"
            className="relative p-2 hover:text-gold"
            aria-label={`Carrito, ${count} piezas`}
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 ? (
              <span className="absolute right-0 top-0 text-[0.6rem] text-gold">{count}</span>
            ) : null}
          </Link>
          <Link href="/cuenta" className="p-2 hover:text-gold" aria-label="Cuenta">
            <UserRound className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-ink px-6 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <p className="tracking-[0.32em]">LUXTIME</p>
            <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-12 flex flex-col gap-6" aria-label="Móvil">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-5xl text-ivory"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogTitle>Buscar en el atelier</DialogTitle>
          <form
            className="mt-6"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchOpen(false);
              router.push(
                query.trim() ? `/catalogo?q=${encodeURIComponent(query.trim())}` : "/catalogo",
              );
            }}
          >
            <label htmlFor="site-search" className="sr-only">
              Nombre, casa o calibre
            </label>
            <Input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Clásico, Nordhelm, LT-720"
              autoFocus
            />
          </form>
          <ul className="mt-4 divide-y divide-white/10">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/producto/${product.slug}`}
                  className="flex items-center justify-between py-3 hover:text-gold"
                  onClick={() => setSearchOpen(false)}
                >
                  <span>
                    {product.name}
                    <span className="ml-2 text-xs uppercase tracking-[0.14em] text-mute">
                      {product.brand}
                    </span>
                  </span>
                  <span className="text-sm">{product.sizeMm} mm</span>
                </Link>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  );
}
