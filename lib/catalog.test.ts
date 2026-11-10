import { describe, expect, it } from "vitest";
import { filterProducts } from "@/lib/catalog";
import { SEED_PRODUCTS } from "@/lib/seed";

describe("filtros del catálogo", () => {
  it("filtra por casa, material, movimiento, tamaño y precio", () => {
    const result = filterProducts(SEED_PRODUCTS, {
      brands: ["Nordhelm"],
      materials: ["ceramica"],
      movements: ["automatico"],
      sizes: [44],
      minPrice: 8000,
      maxPrice: 9000,
    });
    expect(result.map((product) => product.slug)).toEqual(["vortex"]);
  });

  it("busca por nombre y ordena por precio ascendente", () => {
    const result = filterProducts(SEED_PRODUCTS, { q: "reloj", sort: "price-asc" });
    const prices = result.map((product) => product.price);
    expect(prices.length).toBeGreaterThan(5);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(result.some((product) => product.slug === "aether")).toBe(false);
  });

  it("oculta las piezas marcadas", () => {
    const hidden = { ...SEED_PRODUCTS[0], hidden: true };
    if (!hidden) throw new Error("sin semilla");
    const result = filterProducts([hidden], {});
    expect(result).toHaveLength(0);
  });
});
