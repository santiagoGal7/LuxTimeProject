import type { Metadata } from "next";
import { HomeView } from "@/components/home-view";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Portada de LuxTime: colecciones, piezas en vitrina e historia del atelier de Ginebra.",
};

export default function HomePage() {
  return <HomeView />;
}
