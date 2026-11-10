import type { Metadata } from "next";
import { AdminProducts } from "@/components/admin-panels";

export const metadata: Metadata = { title: "Piezas" };

export default function AdminProductsPage() {
  return <AdminProducts />;
}
