import type { Engraving, Product } from "@/lib/types";

export const ENGRAVING_FEE = 180;
export const FREE_SHIPPING_FROM = 5000;
export const SHIPPING_FEE = 80;

export function variantOf(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];
}

export function unitPrice(product: Product, variantId: string, engraving: Engraving) {
  const variant = variantOf(product, variantId);
  const fee = engraving === "ninguno" ? 0 : ENGRAVING_FEE;
  return product.price + (variant?.priceDelta ?? 0) + fee;
}

export function shippingCost(subtotal: number) {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_FROM) return 0;
  return SHIPPING_FEE;
}
