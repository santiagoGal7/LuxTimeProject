export type Material = "acero" | "oro" | "titanio" | "ceramica" | "platino";
export type Movement = "automatico" | "manual" | "cuarzo" | "tourbillon";
export type Collection = "clasica" | "sport" | "alta" | "heritage";
export type Engraving = "ninguno" | "iniciales" | "fecha";
export type OrderStatus = "pagado" | "preparacion" | "enviado" | "entregado";
export type Role = "customer" | "admin";
export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "newest";

export interface Variant {
  id: string;
  label: string;
  priceDelta: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  collection: Collection;
  price: number;
  material: Material;
  movement: Movement;
  sizeMm: number;
  weightG: number;
  waterResistance: string;
  powerReserve: string;
  calibre: string;
  stock: number;
  rating: number;
  description: string;
  story: string;
  images: string[];
  variants: Variant[];
  complications: string[];
  featured: boolean;
  createdAt: string;
  hidden?: boolean;
}

export interface CartLine {
  productId: string;
  variantId: string;
  engraving: Engraving;
  engravingText: string;
  qty: number;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  collection: Collection;
  image: string;
  variantLabel: string;
  engraving: Engraving;
  engravingText: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userEmail: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: ShippingDetails;
  paymentLast4: string;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export interface SessionUser {
  email: string;
  name: string;
  role: Role;
}

export interface Account {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface CatalogQuery {
  q?: string;
  brands?: string[];
  materials?: Material[];
  movements?: Movement[];
  sizes?: number[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
  inStock?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  body: string[];
}
