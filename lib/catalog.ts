import type { CatalogQuery, Product } from "@/lib/types";

export function filterProducts(products: Product[], query: CatalogQuery = {}) {
  const text = query.q?.trim().toLowerCase() ?? "";
  let list = products.filter((product) => !product.hidden);

  if (text) {
    list = list.filter((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.calibre,
        product.collection,
        product.material,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(text);
    });
  }
  if (query.brands?.length) list = list.filter((product) => query.brands?.includes(product.brand));
  if (query.materials?.length) {
    list = list.filter((product) => query.materials?.includes(product.material));
  }
  if (query.movements?.length) {
    list = list.filter((product) => query.movements?.includes(product.movement));
  }
  if (query.sizes?.length) list = list.filter((product) => query.sizes?.includes(product.sizeMm));
  if (query.minPrice != null)
    list = list.filter((product) => product.price >= (query.minPrice ?? 0));
  if (query.maxPrice != null)
    list = list.filter((product) => product.price <= (query.maxPrice ?? 0));
  if (query.inStock) list = list.filter((product) => product.stock > 0);

  const sorted = [...list];
  switch (query.sort ?? "featured") {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    default:
      sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, "es"),
      );
  }
  return sorted;
}

export function relatedProducts(products: Product[], product: Product, limit = 4) {
  const sameCollection = products.filter(
    (item) => item.id !== product.id && !item.hidden && item.collection === product.collection,
  );
  const sameBrand = products.filter(
    (item) =>
      item.id !== product.id &&
      !item.hidden &&
      item.brand === product.brand &&
      item.collection !== product.collection,
  );
  return [...sameCollection, ...sameBrand].slice(0, limit);
}

export function brandsOf(products: Product[]) {
  return [
    ...new Set(products.filter((product) => !product.hidden).map((product) => product.brand)),
  ].sort((a, b) => a.localeCompare(b, "es"));
}
