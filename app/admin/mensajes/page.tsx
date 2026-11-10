import type { Metadata } from "next";
import { AdminMessages } from "@/components/admin-panels";

export const metadata: Metadata = { title: "Mensajes" };

export default function AdminMessagesPage() {
  return <AdminMessages />;
}
