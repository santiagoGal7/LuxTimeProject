import { describe, expect, it } from "vitest";
import { luhnValid } from "@/lib/payment";
import { shippingCost, unitPrice } from "@/lib/pricing";
import { SEED_PRODUCTS } from "@/lib/seed";

describe("precio", () => {
  it("suma la referencia, la correa y el grabado", () => {
    const product = SEED_PRODUCTS.find((item) => item.slug === "reloj-gold");
    if (!product) throw new Error("Falta Gold");
    expect(unitPrice(product, "marron", "fecha")).toBe(4200 + 120 + 180);
    expect(unitPrice(product, "cuero", "ninguno")).toBe(4200);
  });

  it("exime el envío desde 5000", () => {
    expect(shippingCost(4999)).toBe(80);
    expect(shippingCost(5000)).toBe(0);
    expect(shippingCost(0)).toBe(0);
  });

  it("acepta una tarjeta de demostración y rechaza un dígito cambiado", () => {
    expect(luhnValid("4242 4242 4242 4242")).toBe(true);
    expect(luhnValid("4242424242424241")).toBe(false);
    expect(luhnValid("4242")).toBe(false);
  });
});
