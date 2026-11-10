import { getSeedProduct, SEED_PRODUCTS } from "@/lib/seed";
import type { Product } from "@/lib/types";

/**
 * Contrato de catálogo. La implementación local lee la semilla.
 * Una futura implementación puede llamar a Supabase con la misma firma.
 */
export interface CatalogRepository {
  list(): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
}

export const localCatalogRepository: CatalogRepository = {
  async list() {
    return SEED_PRODUCTS;
  },
  async getBySlug(slug: string) {
    return getSeedProduct(slug);
  },
};
