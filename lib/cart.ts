import { shippingCost, unitPrice, variantOf } from "@/lib/pricing";
import type { CartLine, Product } from "@/lib/types";

export function lineKey(
  line: Pick<CartLine, "productId" | "variantId" | "engraving" | "engravingText">,
) {
  return [
    line.productId,
    line.variantId,
    line.engraving,
    line.engravingText.trim().toLowerCase(),
  ].join(":");
}

export function addLine(
  cart: CartLine[],
  line: CartLine,
  stock: number,
): { cart: CartLine[]; error?: string } {
  if (line.qty < 1) return { cart, error: "La cantidad no es válida" };
  const key = lineKey(line);
  const existing = cart.find((item) => lineKey(item) === key);
  const nextQty = (existing?.qty ?? 0) + line.qty;
  if (nextQty > stock) return { cart, error: "No hay suficientes unidades en el atelier" };
  if (!existing) return { cart: [...cart, { ...line, engravingText: line.engravingText.trim() }] };
  return {
    cart: cart.map((item) => (lineKey(item) === key ? { ...item, qty: nextQty } : item)),
  };
}

export function setLineQty(cart: CartLine[], key: string, qty: number, stock: number) {
  if (qty < 1) return { cart: cart.filter((item) => lineKey(item) !== key) };
  const clamped = Math.min(qty, stock);
  return {
    cart: cart.map((item) => (lineKey(item) === key ? { ...item, qty: clamped } : item)),
    error: qty > stock ? "La cantidad se ajustó al stock disponible" : undefined,
  };
}

export function removeLine(cart: CartLine[], key: string) {
  return cart.filter((item) => lineKey(item) !== key);
}

export function cartCount(cart: CartLine[]) {
  return cart.reduce((total, line) => total + line.qty, 0);
}

export interface PricedLine extends CartLine {
  key: string;
  product: Product;
  variantLabel: string;
  unitPrice: number;
  total: number;
}

export function summarize(cart: CartLine[], products: Product[]) {
  const lines: PricedLine[] = [];
  for (const line of cart) {
    const product = products.find((item) => item.id === line.productId);
    if (!product || product.hidden) continue;
    const variant = variantOf(product, line.variantId);
    const price = unitPrice(product, line.variantId, line.engraving);
    lines.push({
      ...line,
      key: lineKey(line),
      product,
      variantLabel: variant?.label ?? "Correa de serie",
      unitPrice: price,
      total: price * line.qty,
    });
  }
  const subtotal = lines.reduce((total, line) => total + line.total, 0);
  const shipping = shippingCost(subtotal);
  return { lines, subtotal, shipping, total: subtotal + shipping };
}
