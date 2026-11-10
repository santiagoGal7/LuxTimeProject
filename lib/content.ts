import type { BlogPost } from "@/lib/types";

export const POSTS: BlogPost[] = [
  {
    slug: "llegada-al-atelier",
    title: "Llegada al atelier",
    author: "Santiago Gallo",
    date: "2025-05-16",
    image: "/media/atelier.webp",
    excerpt:
      "Entran en el taller las referencias de acero y oro de la serie de mayo. Los pedidos se abren el lunes 19.",
    body: [
      "El taller de Ginebra recibió esta semana las cajas terminadas de la serie de mayo. No es mercancía de una marca ajena: son calibres LT regulados en el banco de Marlowe y encajados por Atelier Vesper.",
      "Las fichas de Reloj Clásico, Chronos y Luna quedan con stock visible en el catálogo. Quien quiera grabado debe indicarlo en el pedido; el taller no lo añade después del envío.",
      "Los pedidos de esta tanda se confirman a partir del lunes 19 de mayo de 2025. El pago de esta plataforma es una simulación y no reserva una pieza real.",
    ],
  },
  {
    slug: "distribucion-de-clasicos",
    title: "Distribución de relojes clásicos",
    author: "Héctor Lumbarde",
    date: "2025-06-26",
    image: "/media/alps.webp",
    excerpt:
      "Las sedes de Europa reciben primero la colección clásica. Heritage viaja en una segunda caja, con cadena y estuche.",
    body: [
      "La distribución de junio separa dos cajas. La primera lleva la colección clásica —Clásico, Classic, Silver, Minimal— hacia las diez sedes. La segunda, más lenta, lleva Heritage y Vintage con su estuche de nogal.",
      "Héctor Lumbarde coordina la salida desde Ginebra. Cada pieza viaja con el número de serie que luego aparece en el certificado del atelier.",
      "Si una referencia figura como agotada, la sede no la tiene en vitrina. La ficha permanece para consulta.",
    ],
  },
  {
    slug: "edicion-limitada-solenne",
    title: "Edición limitada Solenne",
    author: "Santiago Gallo",
    date: "2025-08-04",
    image: "/media/gold.webp",
    excerpt:
      "Maison Solenne cierra una serie corta de Aether y Gold. No habrá reposición este año.",
    body: [
      "La edición de agosto reduce Aether a cuatro unidades y Gold a tres. El calibre es el mismo LT de la casa; cambia el metal y el tamaño.",
      "No utilizamos nombres de manufacturas ajenas para esta serie. Solenne es una casa del catálogo de LuxTime, escrita para este proyecto.",
      "Quien ya tenga un pedido en preparación puede seguirlo en el historial de la cuenta. El estado lo actualiza el panel del atelier.",
    ],
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "LuxTime no solo mide el tiempo, lo eterniza.",
    name: "Cliente del atelier",
    detail: "Desde 1990",
  },
  {
    quote:
      "Pedí el Clásico con iniciales y el certificado llegó en la misma caja. El grabado estaba donde dije, no donde quedaba bien en la foto.",
    name: "Clara Moreau",
    detail: "Ginebra",
  },
  {
    quote:
      "Fui por un cronógrafo y salí con la ficha de Vortex impresa. Me gustó que el stock dijera dos, no «últimas unidades».",
    name: "Andrés Vidal",
    detail: "Madrid",
  },
];

export interface TimelineEvent {
  year: string;
  title: string;
  text: string;
  image: string;
}

export const TIMELINE: TimelineEvent[] = [
  {
    year: "1940",
    title: "Fundación en Ginebra",
    text: "Un taller pequeño empieza a armar relojes de cuerda con componentes propios. El primer banco sigue en la sede del Ródano.",
    image: "/media/atelier.webp",
  },
  {
    year: "1980",
    title: "Salida de Suiza",
    text: "La casa abre mostrador en otras ciudades. La regulación de la marcha no se delega: las piezas vuelven a Ginebra para el ajuste final.",
    image: "/media/alps.webp",
  },
  {
    year: "2000",
    title: "Calibres de serie corta",
    text: "El taller numera los calibres LT y publica reserva de marcha y hermeticidad en cada ficha, no solo en el folleto.",
    image: "/media/movement.webp",
  },
  {
    year: "2020",
    title: "Taller más sobrio",
    text: "Certificación de gestión ambiental y menos embalaje. El estuche de nogal se reserva para Heritage.",
    image: "/media/pocket.webp",
  },
  {
    year: "2025",
    title: "Catálogo abierto",
    text: "Diez sedes y esta plataforma. El objetivo declarado es el mismo: piezas que se puedan leer, filtrar y encargar sin letra pequeña.",
    image: "/media/chrono.webp",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "¿El pago cobra una tarjeta de verdad?",
    answer:
      "No. El checkout valida el número con el algoritmo de Luhn y guarda un pedido local en este navegador. No hay pasarela, no hay cargo y los datos de la tarjeta no salen del dispositivo: solo se conserva los últimos cuatro dígitos.",
  },
  {
    question: "¿Puedo grabar la pieza?",
    answer:
      "Sí. En la ficha se elige sin grabado, iniciales o una fecha. El grabado suma 180 USD al precio de la referencia y queda escrito en la línea del carrito.",
  },
  {
    question: "¿Qué pasa si la referencia está agotada?",
    answer:
      "La ficha sigue visible y el botón de compra se desactiva. El stock lo actualiza el panel del atelier. Elegance, Diamante, Premier y Luxury abren el catálogo en cero a propósito.",
  },
  {
    question: "¿Dónde se guardan el carrito y los pedidos?",
    answer:
      "En el almacenamiento local del navegador. Sirve para recorrer la tienda sin un servicio de pago. Una cuenta real, más adelante, puede sustituir esta capa por una base como Supabase sin cambiar las pantallas.",
  },
  {
    question: "¿Las casas del catálogo existen?",
    answer:
      "No. Atelier Vesper, Maison Solenne, Nordhelm, Calibre Orbis, Lumen Atelier y Marlowe & Fils son nombres de este proyecto. Las esferas no llevan marcas de manufacturas reales.",
  },
];

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
