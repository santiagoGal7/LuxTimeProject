import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const base = "http://127.0.0.1:3000";
const out = path.resolve("docs/capturas");
await mkdir(out, { recursive: true });

const atelier = {
  state: {
    overrides: {},
    customProducts: [],
    cart: [
      {
        productId: "reloj-clasico",
        variantId: "cuero",
        engraving: "iniciales",
        engravingText: "SG",
        qty: 1,
      },
    ],
    wishlist: ["chronos"],
    user: { email: "atelier@luxtime.com", name: "Santiago Gallo", role: "admin" },
    accounts: [],
    orders: [
      {
        id: "LT-24091",
        userEmail: "atelier@luxtime.com",
        createdAt: "2026-02-11T15:04:00.000Z",
        status: "entregado",
        items: [
          {
            productId: "reloj-clasico",
            name: "Reloj Clásico",
            brand: "Atelier Vesper",
            collection: "clasica",
            image: "/media/silver.webp",
            variantLabel: "Cuero negro",
            engraving: "iniciales",
            engravingText: "CM",
            qty: 1,
            unitPrice: 2680,
          },
        ],
        shipping: {
          name: "Santiago Gallo",
          email: "atelier@luxtime.com",
          phone: "+41 22 000 1940",
          address: "Rue du Rhône 12",
          city: "Ginebra",
          country: "Suiza",
        },
        paymentLast4: "4242",
        subtotal: 2680,
        shippingCost: 80,
        total: 2760,
      },
      {
        id: "LT-24110",
        userEmail: "cliente@luxtime.com",
        createdAt: "2026-04-02T10:20:00.000Z",
        status: "enviado",
        items: [
          {
            productId: "chronos",
            name: "Chronos",
            brand: "Nordhelm",
            collection: "sport",
            image: "/media/chrono.webp",
            variantLabel: "Brazalete de acero",
            engraving: "ninguno",
            engravingText: "",
            qty: 1,
            unitPrice: 7550,
          },
        ],
        shipping: {
          name: "Clara Moreau",
          email: "cliente@luxtime.com",
          phone: "+41 22 000 1940",
          address: "Rue du Rhône 12",
          city: "Ginebra",
          country: "Suiza",
        },
        paymentLast4: "1881",
        subtotal: 7550,
        shippingCost: 0,
        total: 7550,
      },
      {
        id: "LT-24144",
        userEmail: "invitado@correo.com",
        createdAt: "2026-06-19T18:41:00.000Z",
        status: "preparacion",
        items: [
          {
            productId: "reloj-vintage",
            name: "Reloj Vintage",
            brand: "Marlowe & Fils",
            collection: "heritage",
            image: "/media/pocket.webp",
            variantLabel: "Piel marrón",
            engraving: "fecha",
            engravingText: "1940",
            qty: 1,
            unitPrice: 3100,
          },
        ],
        shipping: {
          name: "Andrés Vidal",
          email: "invitado@correo.com",
          phone: "+34 600 000 000",
          address: "Calle del Prado 8",
          city: "Madrid",
          country: "España",
        },
        paymentLast4: "4444",
        subtotal: 3100,
        shippingCost: 80,
        total: 3180,
      },
      {
        id: "LT-24180",
        userEmail: "coleccion@correo.com",
        createdAt: "2026-09-01T09:12:00.000Z",
        status: "pagado",
        items: [
          {
            productId: "solaris",
            name: "Solaris",
            brand: "Atelier Vesper",
            collection: "alta",
            image: "/media/rose.webp",
            variantLabel: "Cuero negro",
            engraving: "ninguno",
            engravingText: "",
            qty: 1,
            unitPrice: 6500,
          },
        ],
        shipping: {
          name: "Inés Kalman",
          email: "coleccion@correo.com",
          phone: "+49 30 000 000",
          address: "Linienstraße 40",
          city: "Berlín",
          country: "Alemania",
        },
        paymentLast4: "5100",
        subtotal: 6500,
        shippingCost: 0,
        total: 6500,
      },
    ],
    newsletter: [],
    messages: [],
  },
  version: 0,
};

const shots = [
  ["home", "/"],
  ["catalogo", "/catalogo"],
  ["producto", "/producto/reloj-clasico"],
  ["carrito", "/carrito"],
  ["checkout", "/checkout"],
  ["cuenta", "/cuenta"],
  ["pedidos", "/pedidos"],
  ["deseos", "/deseos"],
  ["admin", "/admin"],
  ["historia", "/historia"],
  ["contacto", "/contacto"],
  ["faq", "/faq"],
  ["blog", "/blog"],
];

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.evaluateOnNewDocument((payload) => {
  localStorage.setItem("luxtime-atelier", payload);
  sessionStorage.setItem("luxtime-loader", "1");
}, JSON.stringify(atelier));

for (const width of [360, 768, 1024, 1440, 1920]) {
  await page.setViewport({ width, height: width < 700 ? 800 : 900, deviceScaleFactor: 1 });
  for (const [name, route] of shots) {
    if (![360, 1440].includes(width) && !["home", "catalogo", "producto"].includes(name)) continue;
    await page.goto(`${base}${route}`, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, name === "home" ? 900 : 250));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) console.log("OVERFLOW", width, name, overflow);
    if (width === 360 || width === 1440) {
      const file = path.join(out, `${name}-${width}.png`);
      await page.screenshot({ path: file });
      console.log(file);
    }
  }
}

await browser.close();
