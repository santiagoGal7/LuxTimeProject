import type { Collection, Engraving, Material, Movement, OrderStatus } from "@/lib/types";

export const materialLabel: Record<Material, string> = {
  acero: "Acero",
  oro: "Oro",
  titanio: "Titanio",
  ceramica: "Cerámica",
  platino: "Platino",
};

export const movementLabel: Record<Movement, string> = {
  automatico: "Automático",
  manual: "Manual",
  cuarzo: "Cuarzo",
  tourbillon: "Tourbillon",
};

export const collectionLabel: Record<Collection, string> = {
  clasica: "Clásica",
  sport: "Sport",
  alta: "Alta relojería",
  heritage: "Heritage",
};

export const engravingLabel: Record<Engraving, string> = {
  ninguno: "Sin grabado",
  iniciales: "Iniciales",
  fecha: "Fecha especial",
};

export const statusLabel: Record<OrderStatus, string> = {
  pagado: "Pagado",
  preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
};

export const MATERIALS = Object.keys(materialLabel) as Material[];
export const MOVEMENTS = Object.keys(movementLabel) as Movement[];
export const COLLECTIONS = Object.keys(collectionLabel) as Collection[];
export const SIZES = [36, 38, 40, 41, 42, 44];
export const ORDER_STATUSES = Object.keys(statusLabel) as OrderStatus[];
