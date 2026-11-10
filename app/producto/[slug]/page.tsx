import type { Metadata } from "next";
import { ClientProduct } from "@/components/client-product";
import { ProductView } from "@/components/product-view";
import { getSeedProduct, SEED_PRODUCTS } from "@/lib/seed";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEED_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getSeedProduct(slug);
  if (!product) return { title: "Pieza" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getSeedProduct(slug);
  if (!product) return <ClientProduct slug={slug} />;
  return <ProductView initial={product} slug={slug} />;
}
