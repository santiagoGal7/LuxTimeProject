import type { Metadata } from "next";
import { AdminInventory } from "@/components/admin-panels";

export const metadata: Metadata = { title: "Inventario" };

export default function AdminInventoryPage() {
  return <AdminInventory />;
}
