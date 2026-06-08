import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Reservas · Portafolio de apps de citas",
  description: "Apps de reservas con personalidad para barberías, lashistas, manicuristas, médicos y terapeutas."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
