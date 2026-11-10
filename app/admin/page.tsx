import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-panels";

export const metadata: Metadata = { title: "Panel" };

export default function AdminPage() {
  return <AdminDashboard />;
}
