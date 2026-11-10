"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { brandsOf, filterProducts } from "@/lib/catalog";
import {
  COLLECTIONS,
  MATERIALS,
  MOVEMENTS,
  SIZES,
  collectionLabel,
  materialLabel,
  movementLabel,
} from "@/lib/labels";
import { selectCatalog, useLuxStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { CatalogQuery, Collection, SortKey } from "@/lib/types";

function toggle<T>(list: T[] | undefined, value: T) {
  const current = list ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export function CatalogBrowser() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const initialCollection = params.get("coleccion") as Collection | null;
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const products = useMemo(
    () => selectCatalog({ overrides, customProducts }),
    [overrides, customProducts],
  );
  const brands = useMemo(() => brandsOf(products), [products]);
  const [query, setQuery] = useState<CatalogQuery>({
    q: initialQuery,
    sort: "featured",
  });
  const [collection, setCollection] = useState<Collection | "">(
    initialCollection && COLLECTIONS.includes(initialCollection) ? initialCollection : "",
  );
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const filtered = useMemo(() => {
    const list = filterProducts(products, query);
    return collection ? list.filter((product) => product.collection === collection) : list;
  }, [products, query, collection]);
  useEffect(() => {
    setPage(1);
  }, [query, collection]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const filters = (
    <div className="space-y-6 text-sm">
      <FilterGroup title="Casa">
        {brands.map((brand) => (
          <FilterChip
            key={brand}
            pressed={query.brands?.includes(brand) ?? false}
            onClick={() =>
              setQuery((current) => ({ ...current, brands: toggle(current.brands, brand) }))
            }
          >
            {brand}
          </FilterChip>
        ))}
      </FilterGroup>
      <FilterGroup title="Material">
        {MATERIALS.map((material) => (
          <FilterChip
            key={material}
            pressed={query.materials?.includes(material) ?? false}
            onClick={() =>
              setQuery((current) => ({
                ...current,
                materials: toggle(current.materials, material),
              }))
            }
          >
            {materialLabel[material]}
          </FilterChip>
        ))}
      </FilterGroup>
      <FilterGroup title="Movimiento">
        {MOVEMENTS.map((movement) => (
          <FilterChip
            key={movement}
            pressed={query.movements?.includes(movement) ?? false}
            onClick={() =>
              setQuery((current) => ({
                ...current,
                movements: toggle(current.movements, movement),
              }))
            }
          >
            {movementLabel[movement]}
          </FilterChip>
        ))}
      </FilterGroup>
      <FilterGroup title="Tamaño">
        {SIZES.map((size) => (
          <FilterChip
            key={size}
            pressed={query.sizes?.includes(size) ?? false}
            onClick={() =>
              setQuery((current) => ({ ...current, sizes: toggle(current.sizes, size) }))
            }
          >
            {size} mm
          </FilterChip>
        ))}
      </FilterGroup>
      <FilterGroup title="Colección">
        <FilterChip pressed={collection === ""} onClick={() => setCollection("")}>
          Todas
        </FilterChip>
        {COLLECTIONS.map((item) => (
          <FilterChip key={item} pressed={collection === item} onClick={() => setCollection(item)}>
            {collectionLabel[item]}
          </FilterChip>
        ))}
      </FilterGroup>
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.16em] text-forest">Precio</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            inputMode="numeric"
            aria-label="Precio mínimo"
            placeholder="Mín"
            value={query.minPrice ?? ""}
            onChange={(event) =>
              setQuery((current) => ({
                ...current,
                minPrice: event.target.value ? Number(event.target.value) : undefined,
              }))
            }
          />
          <Input
            inputMode="numeric"
            aria-label="Precio máximo"
            placeholder="Máx"
            value={query.maxPrice ?? ""}
            onChange={(event) =>
              setQuery((current) => ({
                ...current,
                maxPrice: event.target.value ? Number(event.target.value) : undefined,
              }))
            }
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={Boolean(query.inStock)}
          onChange={(event) =>
            setQuery((current) => ({ ...current, inStock: event.target.checked }))
          }
        />
        Solo en stock
      </label>
      <Button
        variant="quiet"
        size="sm"
        type="button"
        onClick={() => {
          setQuery({ sort: query.sort ?? "featured" });
          setCollection("");
        }}
      >
        Limpiar
      </Button>
    </div>
  );

  return (
    <div className="shell grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">{filters}</aside>
      <div>
        <div className="flex flex-col gap-4 border-b border-line/20 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Catálogo</p>
            <h1 className="mt-2 font-display text-5xl">Nuestro catálogo</h1>
            <p className="mt-2 text-sm text-mute">{filtered.length} referencias</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="catalog-search">
              Buscar
            </label>
            <Input
              id="catalog-search"
              value={query.q ?? ""}
              placeholder="Buscar pieza o casa"
              onChange={(event) => setQuery((current) => ({ ...current, q: event.target.value }))}
            />
            <label className="sr-only" htmlFor="catalog-sort">
              Ordenar
            </label>
            <select
              id="catalog-sort"
              className="field"
              value={query.sort ?? "featured"}
              onChange={(event) =>
                setQuery((current) => ({ ...current, sort: event.target.value as SortKey }))
              }
            >
              <option value="featured">Destacadas</option>
              <option value="price-asc">Precio, menor</option>
              <option value="price-desc">Precio, mayor</option>
              <option value="name">Nombre</option>
              <option value="newest">Más recientes</option>
            </select>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="quiet" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-auto">
                <DialogTitle>Filtros</DialogTitle>
                <div className="mt-6">{filters}</div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="py-16 text-sm text-mute">Ninguna referencia coincide con esos filtros.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {pages > 1 ? (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Páginas">
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                className={cn("chip", number === safePage && "text-canvas")}
                aria-current={number === safePage ? "page" : undefined}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-forest">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn("chip", pressed && "text-canvas")}
    >
      {children}
    </button>
  );
}
