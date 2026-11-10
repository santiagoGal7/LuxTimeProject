import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/catalog.html", destination: "/catalogo", permanent: true },
      { source: "/history.html", destination: "/historia", permanent: true },
      { source: "/contact.html", destination: "/contacto", permanent: true },
      { source: "/blog.html", destination: "/blog", permanent: true },
      { source: "/detail-classic.html", destination: "/producto/reloj-clasico", permanent: true },
      { source: "/detail-elegance.html", destination: "/producto/reloj-elegance", permanent: true },
      { source: "/about", destination: "/historia", permanent: false },
      { source: "/nosotros", destination: "/historia", permanent: false },
    ];
  },
};

export default nextConfig;
