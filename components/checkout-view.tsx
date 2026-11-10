"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { summarize } from "@/lib/cart";
import { cardBrand } from "@/lib/payment";
import { checkoutSchema, type CheckoutValues } from "@/lib/schemas";
import { selectCatalog, useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import type { Order } from "@/lib/types";

export function CheckoutView() {
  const hydrated = useStoreHydrated();
  const cart = useLuxStore((state) => state.cart);
  const user = useLuxStore((state) => state.user);
  const overrides = useLuxStore((state) => state.overrides);
  const customProducts = useLuxStore((state) => state.customProducts);
  const checkout = useLuxStore((state) => state.checkout);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const products = selectCatalog({ overrides, customProducts });
  const summary = summarize(hydrated ? cart : [], products);
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      address: "",
      city: "",
      country: "",
      cardName: user?.name ?? "",
      cardNumber: "",
      exp: "",
      cvc: "",
    },
  });

  if (order) {
    return (
      <div className="shell max-w-3xl">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Pedido {order.id}</p>
        <h1 className="mt-3 font-display text-5xl">El atelier anotó el pedido.</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-ink/75">
          El pago de la tarjeta terminada en {order.paymentLast4} es una simulación. No se ha
          enviado nada a una pasarela y no hay cargo. El total queda en el historial de esta cuenta
          si el correo coincide.
        </p>
        <p className="mt-6 text-2xl">
          <Money value={order.total} />
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/cuenta">Ver historial</Link>
          </Button>
          <Button asChild variant="quiet">
            <Link href="/catalogo">Seguir en el catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (hydrated && summary.lines.length === 0) {
    return (
      <div className="shell max-w-3xl">
        <h1 className="font-display text-5xl">No hay nada que pagar.</h1>
        <Button asChild className="mt-8">
          <Link href="/carrito">Volver al carrito</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit((values) => {
          const result = checkout(values);
          if (result.error) {
            setError(result.error);
            return;
          }
          setOrder(result.order ?? null);
        })}
      >
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Paso 1 de 2</p>
          <h1 className="mt-2 font-display text-5xl">Envío y pago simulado</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink/70">
            Usa 4242 4242 4242 4242, caducidad futura y cualquier CVC. La comprobación es local.
          </p>
        </div>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-display text-3xl">Envío</legend>
          <Field label="Nombre" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} />
          </Field>
          <Field label="Correo" error={form.formState.errors.email?.message}>
            <Input type="email" {...form.register("email")} />
          </Field>
          <Field label="Teléfono" error={form.formState.errors.phone?.message}>
            <Input {...form.register("phone")} />
          </Field>
          <Field label="Ciudad" error={form.formState.errors.city?.message}>
            <Input {...form.register("city")} />
          </Field>
          <Field
            label="Dirección"
            error={form.formState.errors.address?.message}
            className="sm:col-span-2"
          >
            <Input {...form.register("address")} />
          </Field>
          <Field label="País" error={form.formState.errors.country?.message}>
            <Input {...form.register("country")} />
          </Field>
        </fieldset>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-display text-3xl">Tarjeta de demostración</legend>
          <Field
            label="Nombre en la tarjeta"
            error={form.formState.errors.cardName?.message}
            className="sm:col-span-2"
          >
            <Input {...form.register("cardName")} />
          </Field>
          <Field
            label="Número"
            error={form.formState.errors.cardNumber?.message}
            className="sm:col-span-2"
          >
            <Input
              inputMode="numeric"
              autoComplete="off"
              placeholder="4242 4242 4242 4242"
              {...form.register("cardNumber")}
            />
          </Field>
          <Field label="Caducidad" error={form.formState.errors.exp?.message}>
            <Input placeholder="MM/AA" {...form.register("exp")} />
          </Field>
          <Field label="CVC" error={form.formState.errors.cvc?.message}>
            <Input inputMode="numeric" autoComplete="off" {...form.register("cvc")} />
          </Field>
        </fieldset>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit">Confirmar simulación · {cardBrand(form.watch("cardNumber"))}</Button>
      </form>
      <aside className="plate h-fit p-6">
        <h2 className="font-display text-3xl">A pagar</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {summary.lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-3">
              <span>
                {line.product.name}
                <span className="text-mute"> × {line.qty}</span>
              </span>
              <Money value={line.total} />
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line/20 pt-4">
          <span>Total</span>
          <Money value={summary.total} />
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
