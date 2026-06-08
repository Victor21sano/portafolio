import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://portafolio2103aresdev.vercel.app"),
  title: {
    default: "Portafolio de apps de reservas",
    template: "%s · Portafolio de reservas"
  },
  description: "Demos visuales de landings y flujos de reserva para negocios de belleza, salud, terapia, barbería y viajes.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "Portafolio de apps de reservas",
    description: "6 demos visuales con identidad propia, landings y flujos de agenda listos para presentar.",
    url: "https://portafolio2103aresdev.vercel.app",
    siteName: "Portafolio de reservas",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Portafolio web de apps de reservas"
      }
    ],
    locale: "es_MX",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Portafolio de apps de reservas",
    description: "Demos visuales para negocios que necesitan agendar sin fricción.",
    images: ["/og-image.svg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
