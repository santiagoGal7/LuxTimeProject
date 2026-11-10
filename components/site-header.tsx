"use client";

import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { ThemeToggle } from "@/components/theme-toggle";
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
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const count = hydrated ? cartCount(cart) : 0;
  const wishes = hydrated ? wishlist.length : 0;
  const products = useMemo(
    () => selectCatalog({ overrides, customProducts }),
    [overrides, customProducts],
  );
  const results = query.trim() ? filterProducts(products, { q: query }).slice(0, 6) : [];
  const overFilm = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-colors duration-300",
        overFilm
          ? "border-transparent bg-transparent text-[#f4efe6]"
          : "border-line/25 bg-canvas/90 text-ink",
      )}
    >
      <div className="mx-auto flex h-16 max-w-page items-center gap-4 px-4 sm:px-6 md:px-8 xl:px-10">
        <button
          type="button"
          className="p-2 md:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="font-sans text-sm tracking-[0.32em]">
          LUX<span className="text-brass">TIME</span>
        </Link>
        <nav aria-label="Principal" className="ml-8 hidden items-center gap-6 md:flex">
          {LINKS.map((link) =>
            link.href === "/catalogo" ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setMega(true)}
                onMouseLeave={() => setMega(false)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-[0.68rem] uppercase tracking-[0.18em]",
                    overFilm ? "text-[#f4efe6]/80 hover:text-[#e7d7c1]" : "text-ink/70 hover:text-forest",
                    pathname.startsWith(link.href) && (overFilm ? "text-[#e7d7c1]" : "text-forest"),
                  )}
                  aria-expanded={mega}
                >
                  {link.label}
                </Link>
                {mega ? (
                  <div className="absolute left-0 top-full z-50 w-[28rem] bg-canvas p-4 text-ink shadow-line">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-brass">Colecciones</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        ["clasica", "Clásica"],
                        ["sport", "Sport"],
                        ["alta", "Alta relojería"],
                        ["heritage", "Heritage"],
                      ].map(([id, label]) => (
                        <Link
                          key={id}
                          href={`/catalogo?coleccion=${id}`}
                          className="border border-line/20 px-3 py-3 text-sm hover:border-forest hover:text-forest"
                          onClick={() => setMega(false)}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[0.68rem] uppercase tracking-[0.18em]",
                  overFilm ? "text-[#f4efe6]/80 hover:text-[#e7d7c1]" : "text-ink/70 hover:text-forest",
                  pathname.startsWith(link.href) && (overFilm ? "text-[#e7d7c1]" : "text-forest"),
                )}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="p-2 hover:text-forest"
            aria-label="Buscar"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/deseos"
            className="relative p-2 hover:text-forest"
            aria-label={`Lista de deseos, ${wishes} piezas`}
          >
            <Heart className="h-4 w-4" />
            {wishes > 0 ? (
              <span className="absolute right-0 top-0 text-[0.6rem] text-forest">{wishes}</span>
            ) : null}
          </Link>
          <button
            type="button"
            className="relative p-2 hover:text-forest"
            aria-label={`Abrir pedido, ${count} piezas`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 ? (
              <span className="absolute right-0 top-0 text-[0.6rem] text-forest">{count}</span>
            ) : null}
          </button>
          <Link href="/cuenta" className="p-2 hover:text-forest" aria-label="Cuenta">
            <UserRound className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-canvas px-6 py-6 md:hidden">
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
                className="font-display text-5xl text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
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
          <ul className="mt-4 divide-y divide-line/20">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/producto/${product.slug}`}
                  className="flex items-center justify-between py-3 hover:text-forest"
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
