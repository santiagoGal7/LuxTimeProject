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
        userEmail: "cliente@luxtime.com",
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
          name: "Clara Moreau",
          email: "cliente@luxtime.com",
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
    newsletter: ["clara@correo.com"],
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
  ["admin", "/admin"],
];

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const [width, height, suffix] of [
  [1440, 900, "1440"],
  [360, 800, "360"],
]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument((payload) => {
    localStorage.setItem("luxtime-atelier", payload);
  }, JSON.stringify(atelier));
  for (const [name, route] of shots) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, name === "home" ? 1200 : 400));
    const file = path.join(out, `${name}-${suffix}.png`);
    await page.screenshot({ path: file });
    console.log(file);
  }
  await page.close();
}

await browser.close();
