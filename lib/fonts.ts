import { Inter, Oswald, Playfair_Display, Quicksand, Sora, Fraunces, Nunito, Space_Grotesk } from "next/font/google";

// Body default
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Display fonts, one personality per niche
export const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" }); // barbería: industrial, condensada
export const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" }); // lashista: elegante, glam
export const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand", display: "swap" }); // manicurista: redonda, divertida
export const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" }); // médico: limpia, confiable
export const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" }); // terapeuta: cálida, serena
export const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" }); // cuerpo suave
export const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" }); // viajes: moderno, energético

/** Todas las variables de fuente para aplicar en <body>. */
export const fontVariables = [
  inter.variable,
  oswald.variable,
  playfair.variable,
  quicksand.variable,
  sora.variable,
  fraunces.variable,
  nunito.variable,
  spaceGrotesk.variable
].join(" ");
