"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  collectionLabel,
  materialLabel,
  movementLabel,
  statusLabel,
  MATERIALS,
  MOVEMENTS,
  COLLECTIONS,
  ORDER_STATUSES,
} from "@/lib/labels";
import { productDraftSchema, type ProductDraft } from "@/lib/schemas";
import { selectAdminCatalog, useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import type { OrderStatus, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/productos", label: "Piezas" },
  { href: "/admin/inventario", label: "Inventario" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/mensajes", label: "Mensajes" },
];

const IMAGES = [
  "/media/chrono.webp",
  "/media/gold.webp",
  "/media/sport.webp",
  "/media/minimal.webp",
  "/media/rose.webp",
  "/media/silver.webp",
  "/media/pocket.webp",
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hydrated = useStoreHydrated();
  const user = useLuxStore((state) => state.user);

  if (!hydrated) return <p className="px-4 py-24 text-sm text-mute">Abriendo el panel…</p>;

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <h1 className="font-display text-5xl">El panel es del atelier.</h1>
        <p className="mt-4 text-sm leading-7 text-ivory/70">
          Entra con atelier@luxtime.com y la clave calibre1940.
        </p>
        <Button asChild className="mt-6">
          <Link href="/cuenta">Ir a la cuenta</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-page gap-8 px-4 py-8 md:px-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">Atelier</p>
        <p className="mt-2 font-display text-3xl">{user.name}</p>
        <nav className="mt-6 flex flex-col gap-2" aria-label="Panel">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm uppercase tracking-[0.14em]",
                  active ? "text-gold" : "text-ivory/70 hover:text-ivory",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="mt-6 text-xs uppercase tracking-[0.14em] text-mute hover:text-gold"
          >
            Volver a la tienda
          </Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}

export function AdminDashboard() {
  const orders = useLuxStore((state) => state.orders);
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const products = selectAdminCatalog({ overrides, customProducts }).filter(
    (product) => !product.hidden,
  );
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const units = products.reduce((total, product) => total + product.stock, 0);
  const low = products.filter((product) => product.stock > 0 && product.stock <= 2);
  const soldOut = products.filter((product) => product.stock === 0);

  return (
    <div>
      <h1 className="font-display text-5xl">Tablero</h1>
      <dl className="mt-8 grid gap-px bg-gold/30 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pedidos", String(orders.length)],
          ["Importe anotado", revenue.toLocaleString("es-ES") + " USD"],
          ["Unidades", String(units)],
          ["Agotadas", String(soldOut.length)],
        ].map(([label, value]) => (
          <div key={label} className="bg-ink p-5">
            <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-mute">{label}</dt>
            <dd className="mt-2 font-display text-4xl">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <SalesChart orders={orders} />
        <div>
          <h2 className="font-display text-3xl">Stock corto</h2>
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/10 text-sm">
            {low.length === 0 ? (
              <li className="py-3 text-mute">Ninguna referencia está en dos unidades o menos.</li>
            ) : null}
            {low.map((product) => (
              <li key={product.id} className="flex justify-between py-3">
                <span>{product.name}</span>
                <span className="text-gold">{product.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SalesChart({
  orders,
}: {
  orders: { items: { collection: Product["collection"]; unitPrice: number; qty: number }[] }[];
}) {
  const rows = useMemo(() => {
    const totals = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        const label = collectionLabel[item.collection];
        totals.set(label, (totals.get(label) ?? 0) + item.unitPrice * item.qty);
      }
    }
    return [...totals.entries()];
  }, [orders]);
  const max = Math.max(...rows.map(([, value]) => value), 1);

  return (
    <div>
      <h2 className="font-display text-3xl">Importe por colección</h2>
      <div
        className="mt-6 flex h-56 items-end gap-3"
        role="img"
        aria-label="Gráfico de importe por colección"
      >
        {rows.map(([label, value]) => (
          <div key={label} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <div className="bg-gold" style={{ height: `${Math.max(8, (value / max) * 100)}%` }} />
            <p className="mt-2 truncate text-center text-[0.65rem] uppercase tracking-[0.12em] text-mute">
              {label}
            </p>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Importe por colección</caption>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value} USD</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminProducts() {
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const updateProduct = useLuxStore((state) => state.updateProduct);
  const createProduct = useLuxStore((state) => state.createProduct);
  const products = selectAdminCatalog({ overrides, customProducts });
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft>({
    name: "",
    brand: "Atelier Vesper",
    price: 2500,
    stock: 1,
    sizeMm: 40,
    material: "acero",
    movement: "automatico",
    collection: "clasica",
    description: "Referencia nueva del atelier, con ficha pendiente de pulir.",
    image: IMAGES[0] ?? "/media/silver.webp",
  });

  return (
    <div>
      <h1 className="font-display text-5xl">Piezas</h1>
      <form
        className="mt-8 grid gap-3 border border-gold/30 p-4 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = productDraftSchema.safeParse(draft);
          if (!parsed.success) {
            setError("Revisa nombre, precio y descripción");
            return;
          }
          const message = createProduct(parsed.data);
          setError(message);
          if (!message) setDraft((current) => ({ ...current, name: "" }));
        }}
      >
        <Field label="Nombre">
          <Input
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          />
        </Field>
        <Field label="Casa">
          <Input
            value={draft.brand}
            onChange={(event) => setDraft({ ...draft, brand: event.target.value })}
          />
        </Field>
        <Field label="Precio">
          <Input
            type="number"
            value={draft.price}
            onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
          />
        </Field>
        <Field label="Stock">
          <Input
            type="number"
            value={draft.stock}
            onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })}
          />
        </Field>
        <Field label="Material">
          <Select
            value={draft.material}
            onChange={(value) =>
              setDraft({ ...draft, material: value as ProductDraft["material"] })
            }
            options={MATERIALS.map((item) => [item, materialLabel[item]])}
          />
        </Field>
        <Field label="Movimiento">
          <Select
            value={draft.movement}
            onChange={(value) =>
              setDraft({ ...draft, movement: value as ProductDraft["movement"] })
            }
            options={MOVEMENTS.map((item) => [item, movementLabel[item]])}
          />
        </Field>
        <Field label="Colección">
          <Select
            value={draft.collection}
            onChange={(value) =>
              setDraft({ ...draft, collection: value as ProductDraft["collection"] })
            }
            options={COLLECTIONS.map((item) => [item, collectionLabel[item]])}
          />
        </Field>
        <Field label="Imagen">
          <Select
            value={draft.image}
            onChange={(value) => setDraft({ ...draft, image: value })}
            options={IMAGES.map((item) => [item, item.replace("/media/", "")])}
          />
        </Field>
        <div className="md:col-span-4">
          <Label>Descripción</Label>
          <Textarea
            className="mt-2"
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          />
        </div>
        {error ? <p className="text-sm text-red-300 md:col-span-4">{error}</p> : null}
        <Button type="submit">Añadir pieza</Button>
      </form>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[0.65rem] uppercase tracking-[0.14em] text-mute">
            <tr>
              <th className="py-2">Pieza</th>
              <th>Precio</th>
              <th>Visible</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onChange={(patch) => updateProduct(product.id, patch)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onChange,
}: {
  product: Product;
  onChange: (patch: Partial<Product>) => void;
}) {
  return (
    <tr className="border-t border-white/10">
      <td className="py-3">
        <span className="block">{product.name}</span>
        <span className="text-xs text-mute">{product.brand}</span>
      </td>
      <td>
        <Input
          className="h-10 w-28"
          type="number"
          defaultValue={product.price}
          onBlur={(event) => onChange({ price: Number(event.target.value) })}
        />
      </td>
      <td>
        <button
          type="button"
          className="text-xs uppercase tracking-[0.14em] text-gold"
          onClick={() => onChange({ hidden: !product.hidden })}
        >
          {product.hidden ? "Oculta" : "Visible"}
        </button>
      </td>
    </tr>
  );
}

export function AdminInventory() {
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const updateProduct = useLuxStore((state) => state.updateProduct);
  const products = selectAdminCatalog({ overrides, customProducts }).filter(
    (product) => !product.hidden,
  );

  return (
    <div>
      <h1 className="font-display text-5xl">Inventario</h1>
      <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p>{product.name}</p>
              <p className="text-xs text-mute">{product.calibre}</p>
            </div>
            <label className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-mute">
              Unidades
              <Input
                className="h-10 w-24"
                type="number"
                min={0}
                defaultValue={product.stock}
                onBlur={(event) =>
                  updateProduct(product.id, { stock: Math.max(0, Number(event.target.value)) })
                }
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminOrders() {
  const orders = useLuxStore((state) => state.orders);
  const setOrderStatus = useLuxStore((state) => state.setOrderStatus);

  return (
    <div>
      <h1 className="font-display text-5xl">Pedidos</h1>
      <ul className="mt-8 space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border border-white/10 p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-gold">{order.id}</p>
                <p className="mt-1">{order.shipping.name}</p>
                <p className="text-xs text-mute">
                  {order.items.map((item) => `${item.name} × ${item.qty}`).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Money value={order.total} />
                <label className="sr-only" htmlFor={`status-${order.id}`}>
                  Estado de {order.id}
                </label>
                <select
                  id={`status-${order.id}`}
                  className="h-10 border border-white/15 bg-ink px-2 text-sm"
                  value={order.status}
                  onChange={(event) => setOrderStatus(order.id, event.target.value as OrderStatus)}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminMessages() {
  const messages = useLuxStore((state) => state.messages);
  const newsletter = useLuxStore((state) => state.newsletter);
  return (
    <div>
      <h1 className="font-display text-5xl">Mensajes</h1>
      <ul className="mt-8 space-y-4">
        {messages.length === 0 ? (
          <li className="text-sm text-mute">El formulario de contacto aún no dejó notas.</li>
        ) : null}
        {messages.map((message) => (
          <li key={message.id} className="border border-white/10 p-4">
            <p className="text-gold">{message.name}</p>
            <p className="text-xs text-mute">
              {message.email} · {message.phone}
            </p>
            <p className="mt-3 text-sm leading-7">{message.message}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-display text-3xl">Boletín</h2>
      <ul className="mt-4 text-sm text-ivory/80">
        {newsletter.length === 0 ? (
          <li>Nadie se ha apuntado todavía.</li>
        ) : (
          newsletter.map((email) => <li key={email}>{email}</li>)
        )}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      className="h-12 w-full border border-white/15 bg-ink px-3 text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map(([option, label]) => (
        <option key={option} value={option}>
          {label}
        </option>
      ))}
    </select>
  );
}
