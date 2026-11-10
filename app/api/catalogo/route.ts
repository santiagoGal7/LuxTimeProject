import { NextResponse } from "next/server";
import { localCatalogRepository } from "@/lib/repository";

export async function GET() {
  const products = await localCatalogRepository.list();
  return NextResponse.json({
    source: "local-seed",
    products,
  });
}
