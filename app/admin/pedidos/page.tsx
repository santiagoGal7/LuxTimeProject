import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin-panels";

export const metadata: Metadata = { title: "Pedidos" };

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
