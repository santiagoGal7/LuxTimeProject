"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactValues } from "@/lib/schemas";
import { useLuxStore } from "@/lib/store";

export function ContactForm() {
  const sendMessage = useLuxStore((state) => state.sendMessage);
  const form = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  if (form.formState.isSubmitSuccessful) {
    return (
      <p className="border border-forest/40 p-6 text-sm leading-7">
        Mensaje guardado en este navegador. El atelier lo ve en el panel, sin servidor de correo.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        sendMessage(values);
      })}
    >
      <Field label="Nombre" error={form.formState.errors.name?.message}>
        <Input id="name" {...form.register("name")} />
      </Field>
      <Field label="Correo" error={form.formState.errors.email?.message}>
        <Input id="email" type="email" {...form.register("email")} />
      </Field>
      <Field label="Teléfono" error={form.formState.errors.phone?.message}>
        <Input id="phone" {...form.register("phone")} />
      </Field>
      <Field label="Mensaje" error={form.formState.errors.message?.message}>
        <Textarea id="message" {...form.register("message")} />
      </Field>
      <Button type="submit">Enviar</Button>
    </form>
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
