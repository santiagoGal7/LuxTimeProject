import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";

export const metadata: Metadata = { title: "Pago simulado" };

export default function CheckoutPage() {
  return <CheckoutView />;
}
