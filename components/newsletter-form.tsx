"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema } from "@/lib/schemas";
import { useLuxStore } from "@/lib/store";

export function NewsletterForm() {
  const subscribe = useLuxStore((state) => state.subscribe);
  const form = useForm<{ email: string }>({ resolver: zodResolver(newsletterSchema) });
  const done = form.formState.isSubmitSuccessful;

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={form.handleSubmit((values) => {
        subscribe(values.email);
      })}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Correo para el boletín
      </label>
      <Input
        id="newsletter-email"
        type="email"
        placeholder="tu@correo.com"
        {...form.register("email")}
      />
      <Button type="submit">{done ? "Anotado" : "Boletín"}</Button>
      {form.formState.errors.email ? (
        <p className="text-xs text-red-300 sm:basis-full">{form.formState.errors.email.message}</p>
      ) : null}
    </form>
  );
}
