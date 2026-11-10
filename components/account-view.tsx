"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Money } from "@/components/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { statusLabel } from "@/lib/labels";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "@/lib/schemas";
import { useLuxStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export function AccountView() {
  const hydrated = useStoreHydrated();
  const user = useLuxStore((state) => state.user);
  const orders = useLuxStore((state) => state.orders);
  const login = useLuxStore((state) => state.login);
  const register = useLuxStore((state) => state.register);
  const logout = useLuxStore((state) => state.logout);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  if (!hydrated) {
    return <p className="px-4 py-24 text-sm text-mute">Abriendo la cuenta…</p>;
  }

  if (user) {
    const mine = orders.filter((order) => order.userEmail === user.email);
    return (
      <div className="shell">
        <div className="flex flex-col justify-between gap-4 border-b border-line/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">
              {user.role === "admin" ? "Atelier" : "Cliente"}
            </p>
            <h1 className="mt-2 font-display text-5xl">{user.name}</h1>
            <p className="mt-2 text-sm text-mute">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {user.role === "admin" ? (
              <Button asChild>
                <Link href="/admin">Panel</Link>
              </Button>
            ) : null}
            <Button variant="quiet" type="button" onClick={() => logout()}>
              Salir
            </Button>
          </div>
        </div>
        <h2 className="mt-10 font-display text-4xl">Pedidos</h2>
        {mine.length === 0 ? (
          <p className="mt-4 text-sm text-mute">Todavía no hay pedidos con este correo.</p>
        ) : (
          <ul className="mt-6 divide-y divide-line/20 border-y border-line/20">
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

  return (
    <div className="shell grid items-start gap-10 md:grid-cols-2">
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Cuenta</p>
        <h1 className="mt-2 font-display text-5xl">
          {mode === "login" ? "Entrar" : "Crear cuenta"}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
          La sesión vive en este navegador. No hay servidor de identidad: sirve para recorrer
          pedidos y el panel.
        </p>
        <div className="mt-8 border border-forest/30 p-5 text-sm leading-7">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-forest">
            Accesos de demostración
          </p>
          <p className="mt-2">Cliente: cliente@luxtime.com · atelier1940</p>
          <p>Atelier: atelier@luxtime.com · calibre1940</p>
        </div>
      </div>
      <div>
        <div className="mb-6 flex gap-4 text-[0.68rem] uppercase tracking-[0.16em]">
          <button
            type="button"
            className={mode === "login" ? "text-forest" : "text-mute"}
            onClick={() => setMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === "register" ? "text-forest" : "text-mute"}
            onClick={() => setMode("register")}
          >
            Registro
          </button>
        </div>
        {mode === "login" ? (
          <form
            className="space-y-4"
            onSubmit={loginForm.handleSubmit((values) =>
              setError(login(values.email, values.password)),
            )}
          >
            <Field label="Correo" error={loginForm.formState.errors.email?.message}>
              <Input type="email" {...loginForm.register("email")} />
            </Field>
            <Field label="Clave" error={loginForm.formState.errors.password?.message}>
              <Input type="password" {...loginForm.register("password")} />
            </Field>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit">Entrar</Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={registerForm.handleSubmit((values) =>
              setError(register(values.name, values.email, values.password)),
            )}
          >
            <Field label="Nombre" error={registerForm.formState.errors.name?.message}>
              <Input {...registerForm.register("name")} />
            </Field>
            <Field label="Correo" error={registerForm.formState.errors.email?.message}>
              <Input type="email" {...registerForm.register("email")} />
            </Field>
            <Field label="Clave" error={registerForm.formState.errors.password?.message}>
              <Input type="password" {...registerForm.register("password")} />
            </Field>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit">Crear cuenta</Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
