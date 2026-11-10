import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/content";
import { SEED_PRODUCTS } from "@/lib/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/catalogo",
    "/historia",
    "/contacto",
    "/blog",
    "/faq",
    "/carrito",
    "/cuenta",
  ].map((path) => ({
    url: `https://luxtime.example${path}`,
    lastModified: new Date("2026-11-10"),
  }));
  const products = SEED_PRODUCTS.map((product) => ({
    url: `https://luxtime.example/producto/${product.slug}`,
    lastModified: new Date(product.createdAt),
  }));
  const posts = POSTS.map((post) => ({
    url: `https://luxtime.example/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));
  return [...staticRoutes, ...products, ...posts];
}
