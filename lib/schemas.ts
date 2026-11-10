import { z } from "zod";
import { expiryValid, luhnValid } from "@/lib/payment";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre"),
  email: z.string().trim().email("El correo no es válido"),
  phone: z.string().trim().min(6, "El teléfono es demasiado corto"),
  message: z.string().trim().min(12, "Cuéntanos un poco más"),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("El correo no es válido"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("El correo no es válido"),
  password: z.string().min(6, "La clave tiene al menos 6 caracteres"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Escribe tu nombre"),
});

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Escribe el nombre de envío"),
  email: z.string().trim().email("El correo no es válido"),
  phone: z.string().trim().min(6, "El teléfono es demasiado corto"),
  address: z.string().trim().min(4, "Falta la dirección"),
  city: z.string().trim().min(2, "Falta la ciudad"),
  country: z.string().trim().min(2, "Falta el país"),
  cardName: z.string().trim().min(2, "Nombre en la tarjeta"),
  cardNumber: z.string().trim().refine(luhnValid, "El número no supera la comprobación"),
  exp: z
    .string()
    .trim()
    .refine((value) => expiryValid(value), "La caducidad no es válida"),
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "El CVC tiene 3 o 4 dígitos"),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export const productDraftSchema = z.object({
  name: z.string().trim().min(2),
  brand: z.string().trim().min(2),
  price: z.coerce.number().int().positive(),
  stock: z.coerce.number().int().min(0),
  sizeMm: z.coerce.number().int().min(30).max(50),
  material: z.enum(["acero", "oro", "titanio", "ceramica", "platino"]),
  movement: z.enum(["automatico", "manual", "cuarzo", "tourbillon"]),
  collection: z.enum(["clasica", "sport", "alta", "heritage"]),
  description: z.string().trim().min(12),
  image: z.string().min(1),
});

export type ProductDraft = z.infer<typeof productDraftSchema>;
