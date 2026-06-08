/**
 * Diseño por nicho: capa de PERSONALIDAD sobre el branding_json (color).
 * No toca lógica de reservas; solo apariencia y carácter visual de cada página.
 */

export type NicheDesign = {
  /** Variable CSS de la fuente de títulos */
  displayFont: string;
  /** Variable CSS de la fuente de cuerpo */
  bodyFont: string;
  /** Radio de esquinas dominante: sharp (barbería) … pill (manicure) */
  radius: string;
  /** Palabra/etiqueta de carácter mostrada como kicker */
  vibe: string;
  /** Estilo de fondo del hero (gradiente/textura) usando los colores de marca */
  heroBackground: string;
  /** Patrón decorativo SVG (data-uri) en baja opacidad sobre el hero */
  pattern: string;
  /** Emoji/símbolo de acento del rubro */
  glyph: string;
  /** Curva de personalidad de animación */
  ease: string;
  /** Letra-spacing de títulos */
  tracking: string;
  /** ¿títulos en mayúsculas? */
  uppercase: boolean;
  /** Estilo visual de los botones de horario */
  slot: "ticket" | "pill" | "bubble" | "grid" | "soft";
};

const stripes =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M-10 10 L10 -10 M0 40 L40 0 M30 50 L50 30' stroke='white' stroke-width='6' opacity='0.5'/%3E%3C/svg%3E\")";
const dots =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='2.5' fill='white' opacity='0.6'/%3E%3C/svg%3E\")";
const sparkles =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 18 L33 27 L42 30 L33 33 L30 42 L27 33 L18 30 L27 27 Z' fill='white' opacity='0.5'/%3E%3C/svg%3E\")";
const grid =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M0 0 H32 M0 0 V32' stroke='white' stroke-width='1' opacity='0.4'/%3E%3C/svg%3E\")";
const waves =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='20'%3E%3Cpath d='M0 10 Q20 0 40 10 T80 10' fill='none' stroke='white' stroke-width='2' opacity='0.5'/%3E%3C/svg%3E\")";

const DESIGNS: Record<string, NicheDesign> = {
  barberia: {
    displayFont: "var(--font-oswald)",
    bodyFont: "var(--font-inter)",
    radius: "4px",
    vibe: "Estilo & precisión",
    heroBackground: "linear-gradient(160deg, #18181b 0%, rgb(var(--brand)) 120%)",
    pattern: stripes,
    glyph: "✂",
    ease: "cubic-bezier(0.23, 1, 0.32, 1)",
    tracking: "0.04em",
    uppercase: true,
    slot: "ticket"
  },
  lashista: {
    displayFont: "var(--font-playfair)",
    bodyFont: "var(--font-inter)",
    radius: "16px",
    vibe: "Mirada que enamora",
    heroBackground: "linear-gradient(150deg, rgb(var(--brand)) 0%, #1f1115 70%, rgb(var(--accent)) 160%)",
    pattern: sparkles,
    glyph: "✦",
    ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    tracking: "0.01em",
    uppercase: false,
    slot: "pill"
  },
  manicurista: {
    displayFont: "var(--font-quicksand)",
    bodyFont: "var(--font-nunito)",
    radius: "9999px",
    vibe: "Color en tus manos",
    heroBackground: "linear-gradient(135deg, rgb(var(--brand)) 0%, rgb(var(--accent)) 100%)",
    pattern: dots,
    glyph: "❀",
    ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    tracking: "0em",
    uppercase: false,
    slot: "bubble"
  },
  medico: {
    displayFont: "var(--font-sora)",
    bodyFont: "var(--font-inter)",
    radius: "10px",
    vibe: "Cuidado a tiempo",
    heroBackground: "linear-gradient(165deg, rgb(var(--brand)) 0%, #0b3b46 130%)",
    pattern: grid,
    glyph: "✚",
    ease: "cubic-bezier(0.23, 1, 0.32, 1)",
    tracking: "-0.01em",
    uppercase: false,
    slot: "grid"
  },
  terapeuta: {
    displayFont: "var(--font-fraunces)",
    bodyFont: "var(--font-nunito)",
    radius: "20px",
    vibe: "Tu espacio, tu calma",
    heroBackground: "linear-gradient(160deg, rgb(var(--brand)) 0%, #2a2546 120%)",
    pattern: waves,
    glyph: "❋",
    ease: "cubic-bezier(0.33, 1, 0.68, 1)",
    tracking: "0em",
    uppercase: false,
    slot: "soft"
  },
  viajes: {
    displayFont: "var(--font-space)",
    bodyFont: "var(--font-inter)",
    radius: "16px",
    vibe: "Aventura por México",
    heroBackground: "linear-gradient(150deg, rgb(var(--brand)) 0%, rgb(var(--accent)) 130%)",
    pattern: waves,
    glyph: "⛰",
    ease: "cubic-bezier(0.23, 1, 0.32, 1)",
    tracking: "-0.01em",
    uppercase: false,
    slot: "grid"
  }
};

const FALLBACK: NicheDesign = DESIGNS.medico;

export function nicheDesign(nicho: string): NicheDesign {
  return DESIGNS[nicho] ?? FALLBACK;
}
