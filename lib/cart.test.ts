import { describe, expect, it } from "vitest";
import { addLine, cartCount, setLineQty, summarize } from "@/lib/cart";
import { SEED_PRODUCTS } from "@/lib/seed";
import type { CartLine } from "@/lib/types";

const classic = SEED_PRODUCTS.find((product) => product.slug === "reloj-clasico");

if (!classic) throw new Error("Falta la referencia clásica");

const line: CartLine = {
  productId: classic.id,
  variantId: "acero",
  engraving: "iniciales",
  engravingText: "SG",
  qty: 1,
};

describe("carrito", () => {
  it("une cantidades de la misma pieza, correa y grabado", () => {
    const first = addLine([], line, classic.stock);
    const second = addLine(first.cart, line, classic.stock);
    expect(second.error).toBeUndefined();
    expect(cartCount(second.cart)).toBe(2);
    expect(second.cart).toHaveLength(1);
  });

  it("no deja superar el stock", () => {
    const result = addLine([], { ...line, qty: classic.stock + 1 }, classic.stock);
    expect(result.error).toBeDefined();
    expect(result.cart).toHaveLength(0);
  });

  it("ajusta la cantidad y calcula grabado más correa", () => {
    const added = addLine([], line, classic.stock);
    const updated = setLineQty(added.cart, `${classic.id}:acero:iniciales:sg`, 2, classic.stock);
    const summary = summarize(updated.cart, [classic]);
    expect(summary.lines[0]?.unitPrice).toBe(2500 + 350 + 180);
    expect(summary.subtotal).toBe(6060);
    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(6060);
  });

  it("cobra envío por debajo del umbral", () => {
    const minimal = SEED_PRODUCTS.find((product) => product.slug === "reloj-minimal");
    if (!minimal) throw new Error("Falta Minimal");
    const added = addLine(
      [],
      {
        productId: minimal.id,
        variantId: "cuero",
        engraving: "ninguno",
        engravingText: "",
        qty: 1,
      },
      minimal.stock,
    );
    const summary = summarize(added.cart, [minimal]);
    expect(summary.subtotal).toBe(1500);
    expect(summary.shipping).toBe(80);
    expect(summary.total).toBe(1580);
  });
});
