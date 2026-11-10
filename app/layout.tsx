import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/fraunces/latin-500.css";
import "@fontsource/fraunces/latin-600.css";
import { SiteFrame } from "@/components/site-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LuxTime",
    template: "%s · LuxTime",
  },
  description:
    "LuxTime es el atelier de relojería de Ginebra. Catálogo, fichas técnicas, pedido simulado y panel de taller.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('luxtime-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
