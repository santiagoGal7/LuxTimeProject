"use client";

import Link from "next/link";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/labels";
import { useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export function OrdersView() {
  const hydrated = useStoreHydrated();
  const user = useLuxStore((state) => state.user);
  const orders = useLuxStore((state) => state.orders);

  if (!hydrated) return <p className="shell text-sm text-mute">Abriendo los pedidos…</p>;

  if (!user) {
    return (
      <div className="shell max-w-3xl">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Cuenta</p>
        <h1 className="mt-3 font-display text-5xl">Pedidos</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
          Entra para ver los encargos asociados a tu correo. La sesión vive en este navegador.
        </p>
        <Button asChild className="mt-8">
          <Link href="/cuenta">Ir a la cuenta</Link>
        </Button>
      </div>
    );
  }

  const mine = orders.filter((order) => order.userEmail === user.email);

  return (
    <div className="shell">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Cuenta</p>
      <h1 className="mt-3 font-display text-5xl">Pedidos</h1>
      <p className="mt-3 text-sm text-mute">{user.email}</p>
      {mine.length === 0 ? (
        <p className="mt-8 text-sm text-ink/70">Todavía no hay encargos con este correo.</p>
      ) : (
        <ul className="mt-8 divide-y divide-line/20 border-y border-line/20">
          {mine.map((order) => (
            <li
              key={order.id}
              className="grid gap-2 py-5 md:grid-cols-[8rem_1fr_auto] md:items-center"
            >
              <span className="text-forest">{order.id}</span>
              <span>
                <span className="block">{order.items.map((item) => item.name).join(", ")}</span>
                <span className="text-xs uppercase tracking-[0.14em] text-mute">
                  {statusLabel[order.status]} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString("es-ES")}
                </span>
              </span>
              <Money value={order.total} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
