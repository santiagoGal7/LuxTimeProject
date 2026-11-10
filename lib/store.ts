"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_ACCOUNTS, matchAccount } from "@/lib/auth";
import { addLine, lineKey, removeLine, setLineQty, summarize } from "@/lib/cart";
import { unitPrice, variantOf } from "@/lib/pricing";
import { SEED_ORDERS, SEED_PRODUCTS } from "@/lib/seed";
import { slugify } from "@/lib/utils";
import type {
  Account,
  CartLine,
  ContactMessage,
  Engraving,
  Order,
  OrderStatus,
  Product,
  SessionUser,
} from "@/lib/types";
import type { CheckoutValues, ProductDraft } from "@/lib/schemas";
import { digitsOnly } from "@/lib/payment";

type Patch = Partial<Product>;

interface LuxState {
  overrides: Record<string, Patch>;
  customProducts: Product[];
  cart: CartLine[];
  wishlist: string[];
  user: SessionUser | null;
  accounts: Account[];
  orders: Order[];
  newsletter: string[];
  messages: ContactMessage[];
  notice: string | null;
  addToCart: (line: CartLine) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearNotice: () => void;
  toggleWishlist: (productId: string) => void;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  subscribe: (email: string) => void;
  sendMessage: (message: Omit<ContactMessage, "id" | "createdAt">) => void;
  checkout: (values: CheckoutValues) => { order?: Order; error?: string };
  updateProduct: (id: string, patch: Patch) => void;
  createProduct: (draft: ProductDraft) => string | null;
  setOrderStatus: (id: string, status: OrderStatus) => void;
}

function catalogFrom(state: Pick<LuxState, "overrides" | "customProducts">, includeHidden = false) {
  const seeded = SEED_PRODUCTS.map((product) => {
    const patch = state.overrides[product.id];
    return patch ? { ...product, ...patch } : product;
  });
  const all = [...seeded, ...state.customProducts];
  return includeHidden ? all : all.filter((product) => !product.hidden);
}

export function selectCatalog(state: Pick<LuxState, "overrides" | "customProducts">) {
  return catalogFrom(state, false);
}

export function selectAdminCatalog(state: Pick<LuxState, "overrides" | "customProducts">) {
  return catalogFrom(state, true);
}

function orderId(existing: Order[]) {
  const numeric = existing
    .map((order) => Number(order.id.replace("LT-", "")))
    .filter((value) => !Number.isNaN(value));
  const next = Math.max(24180, ...numeric) + 1;
  return `LT-${next}`;
}

export const useLuxStore = create<LuxState>()(
  persist(
    (set, get) => ({
      overrides: {},
      customProducts: [],
      cart: [],
      wishlist: [],
      user: null,
      accounts: [],
      orders: SEED_ORDERS,
      newsletter: [],
      messages: [],
      notice: null,
      clearNotice: () => set({ notice: null }),
      addToCart: (line) => {
        const products = selectCatalog(get());
        const product = products.find((item) => item.id === line.productId);
        if (!product) {
          set({ notice: "La pieza ya no está en el catálogo" });
          return;
        }
        const result = addLine(get().cart, line, product.stock);
        set({ cart: result.cart, notice: result.error ?? "Pieza añadida al pedido" });
      },
      updateQty: (key, qty) => {
        const products = selectCatalog(get());
        const current = get().cart.find((line) => lineKey(line) === key);
        const product = products.find((item) => item.id === current?.productId);
        const result = setLineQty(get().cart, key, qty, product?.stock ?? 0);
        set({ cart: result.cart, notice: result.error ?? null });
      },
      removeFromCart: (key) => set({ cart: removeLine(get().cart, key) }),
      toggleWishlist: (productId) => {
        const wishlist = get().wishlist.includes(productId)
          ? get().wishlist.filter((id) => id !== productId)
          : [...get().wishlist, productId];
        set({ wishlist });
      },
      login: (email, password) => {
        const account = matchAccount([...DEMO_ACCOUNTS, ...get().accounts], email, password);
        if (!account) return "Correo o clave incorrectos";
        set({
          user: { email: account.email, name: account.name, role: account.role },
          notice: null,
        });
        return null;
      },
      register: (name, email, password) => {
        const normalized = email.trim().toLowerCase();
        const exists = [...DEMO_ACCOUNTS, ...get().accounts].some(
          (account) => account.email === normalized,
        );
        if (exists) return "Ese correo ya tiene una cuenta en este navegador";
        const account: Account = {
          name: name.trim(),
          email: normalized,
          password,
          role: "customer",
        };
        set({
          accounts: [...get().accounts, account],
          user: { email: account.email, name: account.name, role: "customer" },
        });
        return null;
      },
      logout: () => set({ user: null }),
      subscribe: (email) => {
        const normalized = email.trim().toLowerCase();
        if (get().newsletter.includes(normalized)) return;
        set({
          newsletter: [...get().newsletter, normalized],
          notice: "Quedas en la lista del atelier",
        });
      },
      sendMessage: (message) => {
        const entry: ContactMessage = {
          ...message,
          id: `msg-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ messages: [entry, ...get().messages] });
      },
      checkout: (values) => {
        const products = selectCatalog(get());
        const summary = summarize(get().cart, products);
        if (!summary.lines.length) return { error: "El pedido está vacío" };
        for (const line of summary.lines) {
          if (line.qty > line.product.stock) {
            return { error: `${line.product.name} no tiene stock suficiente` };
          }
        }
        const order: Order = {
          id: orderId(get().orders),
          userEmail: values.email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
          status: "pagado",
          items: summary.lines.map((line) => ({
            productId: line.productId,
            name: line.product.name,
            brand: line.product.brand,
            collection: line.product.collection,
            image: line.product.images[0] ?? "/media/silver.webp",
            variantLabel: line.variantLabel,
            engraving: line.engraving,
            engravingText: line.engravingText,
            qty: line.qty,
            unitPrice: line.unitPrice,
          })),
          shipping: {
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            city: values.city,
            country: values.country,
          },
          paymentLast4: digitsOnly(values.cardNumber).slice(-4),
          subtotal: summary.subtotal,
          shippingCost: summary.shipping,
          total: summary.total,
        };
        const overrides = { ...get().overrides };
        const customProducts = get().customProducts.map((product) => ({ ...product }));
        for (const line of summary.lines) {
          const customIndex = customProducts.findIndex((product) => product.id === line.productId);
          if (customIndex >= 0) {
            const current = customProducts[customIndex];
            if (!current) continue;
            customProducts[customIndex] = {
              ...current,
              stock: Math.max(0, current.stock - line.qty),
            };
          } else {
            const current = products.find((product) => product.id === line.productId);
            overrides[line.productId] = {
              ...(overrides[line.productId] ?? {}),
              stock: Math.max(0, (current?.stock ?? 0) - line.qty),
            };
          }
        }
        set({
          orders: [order, ...get().orders],
          cart: [],
          overrides,
          customProducts,
          notice: null,
        });
        return { order };
      },
      updateProduct: (id, patch) => {
        if (get().customProducts.some((product) => product.id === id)) {
          set({
            customProducts: get().customProducts.map((product) =>
              product.id === id ? { ...product, ...patch } : product,
            ),
          });
          return;
        }
        set({
          overrides: {
            ...get().overrides,
            [id]: { ...(get().overrides[id] ?? {}), ...patch },
          },
        });
      },
      createProduct: (draft) => {
        const slug = slugify(draft.name);
        const products = selectAdminCatalog(get());
        if (products.some((product) => product.slug === slug))
          return "Ya existe una pieza con ese nombre";
        const product: Product = {
          id: slug,
          slug,
          name: draft.name.trim(),
          brand: draft.brand.trim(),
          collection: draft.collection,
          price: draft.price,
          material: draft.material,
          movement: draft.movement,
          sizeMm: draft.sizeMm,
          weightG: 110,
          waterResistance: "50 m",
          powerReserve: "42 h",
          calibre: "LT-NEW",
          stock: draft.stock,
          rating: 5,
          description: draft.description.trim(),
          story: "Referencia añadida desde el panel del atelier.",
          images: [draft.image, "/media/movement.webp", "/media/atelier.webp"],
          variants: [
            { id: "cuero", label: "Cuero negro", priceDelta: 0, stock: draft.stock },
            { id: "acero", label: "Brazalete de acero", priceDelta: 350, stock: draft.stock },
            { id: "marron", label: "Piel marrón", priceDelta: 120, stock: draft.stock },
          ],
          complications: ["Horas", "Minutos"],
          featured: false,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set({ customProducts: [product, ...get().customProducts] });
        return null;
      },
      setOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((order) => (order.id === id ? { ...order, status } : order)),
        });
      },
    }),
    {
      name: "luxtime-atelier",
      partialize: (state) => ({
        overrides: state.overrides,
        customProducts: state.customProducts,
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        accounts: state.accounts,
        orders: state.orders,
        newsletter: state.newsletter,
        messages: state.messages,
      }),
    },
  ),
);

export function priceOf(product: Product, variantId: string, engraving: Engraving) {
  return unitPrice(product, variantId, engraving);
}

export function variantLabel(product: Product, variantId: string) {
  return variantOf(product, variantId)?.label ?? "Correa de serie";
}
