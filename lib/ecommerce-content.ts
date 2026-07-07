import { unsplash } from "./visual-assets";

export type EcommerceProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  badge: string;
  stock: number;
};

export type EcommercePaymentMethod = {
  id: string;
  name: string;
  description: string;
  detail: string;
};

export type EcommerceDemo = {
  slug: string;
  name: string;
  category: string;
  layout: "editorial" | "tech" | "market";
  headline: string;
  subheadline: string;
  cta: string;
  heroImage: string;
  cardImage: string;
  primary: string;
  accent: string;
  ink: string;
  paper: string;
  displayFont: string;
  metrics: { label: string; value: string }[];
  products: EcommerceProduct[];
  paymentMethods: EcommercePaymentMethod[];
};

export const ecommerceDemos: EcommerceDemo[] = [
  {
    slug: "atelier-musa",
    name: "Atelier Musa",
    category: "Moda editorial",
    layout: "editorial",
    headline: "Colecciones cápsula con compra guiada y estética de revista",
    subheadline: "Una boutique digital para prendas seleccionadas, looks armados y checkout claro para clientas que compran desde el celular.",
    cta: "Explorar colección",
    heroImage: unsplash("1496747611176-843222e1e57c", 1800),
    cardImage: unsplash("1483985988355-763728e1935b", 1000),
    primary: "128 55 72",
    accent: "17 94 89",
    ink: "32 28 31",
    paper: "252 248 244",
    displayFont: "var(--font-playfair)",
    metrics: [
      { label: "Looks listos", value: "24" },
      { label: "Ticket prom.", value: "$1,890" },
      { label: "Entrega local", value: "24h" }
    ],
    products: [
      {
        id: "am-blazer-lino",
        name: "Blazer lino humo",
        category: "Sastrería",
        price: 1890,
        description: "Corte relajado, forro ligero y hombro limpio para oficina o cena.",
        image: unsplash("1487412720507-e7ab37603c6f", 900),
        badge: "Nuevo drop",
        stock: 8
      },
      {
        id: "am-vestido-seda",
        name: "Vestido seda oliva",
        category: "Vestidos",
        price: 2240,
        description: "Silueta fluida con caída suave y espalda minimalista.",
        image: unsplash("1539008835657-9e8e9680c956", 900),
        badge: "Más pedido",
        stock: 5
      },
      {
        id: "am-bolso-arco",
        name: "Bolso arco cacao",
        category: "Accesorios",
        price: 980,
        description: "Piel texturizada, asa corta y espacio para básicos diarios.",
        image: unsplash("1584917865442-de89df76afd3", 900),
        badge: "Edición limitada",
        stock: 11
      },
      {
        id: "am-camisa-cruda",
        name: "Camisa cruda oversize",
        category: "Camisas",
        price: 1120,
        description: "Popelina suave, cuello amplio y caída oversized.",
        image: unsplash("1520975916090-3105956dac38", 900),
        badge: "Básico premium",
        stock: 14
      }
    ],
    paymentMethods: [
      { id: "card", name: "Tarjeta bancaria", description: "Pago inmediato con tarjeta de débito o crédito.", detail: "Meses sin intereses disponibles desde $1,500." },
      { id: "transfer", name: "Transferencia SPEI", description: "Reserva el pedido y envía comprobante.", detail: "Vigencia de apartado: 6 horas." },
      { id: "store", name: "Pago en showroom", description: "Paga al recoger en tienda física.", detail: "Disponible para entregas locales." }
    ]
  },
  {
    slug: "voltix-lab",
    name: "Voltix Lab",
    category: "Electrónica y gadgets",
    layout: "tech",
    headline: "Dashboard de compra para gadgets, kits y accesorios de alto desempeño",
    subheadline: "Un ecommerce técnico con fichas densas, comparación rápida, carrito persistente y pagos pensados para equipos de trabajo.",
    cta: "Abrir tablero",
    heroImage: unsplash("1518770660439-4636190af475", 1800),
    cardImage: unsplash("1550009158-9ebf69173e03", 1000),
    primary: "16 185 129",
    accent: "245 158 11",
    ink: "235 247 245",
    paper: "9 16 24",
    displayFont: "var(--font-space)",
    metrics: [
      { label: "SKU activos", value: "86" },
      { label: "Envío tech", value: "48h" },
      { label: "Garantía", value: "12m" }
    ],
    products: [
      {
        id: "vl-keyboard",
        name: "Teclado Nova 75",
        category: "Setup",
        price: 2690,
        description: "Switches hot-swap, cuerpo de aluminio y conectividad tri-mode.",
        image: unsplash("1587829741301-dc798b83add3", 900),
        badge: "Hot swap",
        stock: 16
      },
      {
        id: "vl-monitor",
        name: "Monitor Pulse 27",
        category: "Pantallas",
        price: 6890,
        description: "Panel QHD 165 Hz con brazo compacto para escritorio híbrido.",
        image: unsplash("1527443224154-c4a3942d3acf", 900),
        badge: "QHD",
        stock: 7
      },
      {
        id: "vl-hub",
        name: "Hub Dock USB-C",
        category: "Conectividad",
        price: 1290,
        description: "Carga 100 W, HDMI, lector SD y Ethernet en cuerpo metálico.",
        image: unsplash("1625842268584-8f3296236761", 900),
        badge: "100 W",
        stock: 22
      },
      {
        id: "vl-audio",
        name: "Audio Beam Pro",
        category: "Audio",
        price: 3450,
        description: "Audífonos inalámbricos con cancelación activa y modo baja latencia.",
        image: unsplash("1505740420928-5e560c06d30e", 900),
        badge: "ANC",
        stock: 10
      }
    ],
    paymentMethods: [
      { id: "card", name: "Tarjeta corporativa", description: "Compra directa para equipos y oficinas.", detail: "Factura automática después del pago." },
      { id: "paypal", name: "PayPal", description: "Pago protegido para compras remotas.", detail: "Confirmación inmediata del pedido." },
      { id: "quote", name: "Orden de compra", description: "Genera pedido para autorización interna.", detail: "Vigencia de cotización: 72 horas." }
    ]
  },
  {
    slug: "mercado-raiz",
    name: "Mercado Raíz",
    category: "Artesanal y gourmet",
    layout: "market",
    headline: "Mercado digital para canastas, productos artesanales y compra por lote",
    subheadline: "Una tienda cálida y práctica para productores locales: selección rápida, carrito visible y métodos de pago flexibles.",
    cta: "Armar canasta",
    heroImage: unsplash("1542838132-92c53300491e", 1800),
    cardImage: unsplash("1488459716781-31db52582fe9", 1000),
    primary: "43 101 75",
    accent: "196 82 43",
    ink: "35 38 32",
    paper: "255 252 241",
    displayFont: "var(--font-fraunces)",
    metrics: [
      { label: "Productores", value: "18" },
      { label: "Canastas", value: "3" },
      { label: "Corte", value: "Jueves" }
    ],
    products: [
      {
        id: "mr-canasta",
        name: "Canasta de temporada",
        category: "Canastas",
        price: 540,
        description: "Fruta, verdura y hojas frescas seleccionadas por disponibilidad semanal.",
        image: unsplash("1488459716781-31db52582fe9", 900),
        badge: "Semanal",
        stock: 24
      },
      {
        id: "mr-cafe",
        name: "Café de altura",
        category: "Gourmet",
        price: 260,
        description: "Grano tostado medio con notas de cacao y cítricos.",
        image: unsplash("1442512595331-e89e73853f31", 900),
        badge: "Chiapas",
        stock: 30
      },
      {
        id: "mr-miel",
        name: "Miel cruda multifloral",
        category: "Despensa",
        price: 185,
        description: "Miel sin pasteurizar en frasco reutilizable de 500 g.",
        image: unsplash("1587049352851-8d4e89133924", 900),
        badge: "Natural",
        stock: 18
      },
      {
        id: "mr-pan",
        name: "Pan masa madre",
        category: "Panadería",
        price: 145,
        description: "Hogaza fermentada 24 horas, corteza dorada y miga abierta.",
        image: unsplash("1509440159596-0249088772ff", 900),
        badge: "Horno local",
        stock: 12
      }
    ],
    paymentMethods: [
      { id: "transfer", name: "Transferencia", description: "Confirma tu canasta con SPEI.", detail: "Ideal para pedidos de entrega semanal." },
      { id: "cash", name: "Efectivo al recibir", description: "Pago contra entrega en rutas locales.", detail: "Disponible en zonas cubiertas por reparto." },
      { id: "subscription", name: "Suscripción mensual", description: "Cargo recurrente para canastas fijas.", detail: "Puedes pausar antes del corte semanal." }
    ]
  }
];

export function getEcommerceDemo(slug: string) {
  return ecommerceDemos.find((demo) => demo.slug === slug) ?? null;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}
