import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data";
import { BlackFoldLanding } from "@/components/barberia/BlackFoldLanding";
import { LunaNailLanding } from "@/components/manicurista/LunaNailLanding";
import { VelvetLashLanding } from "@/components/lashista/VelvetLashLanding";
import { VitaliaLanding } from "@/components/medico/VitaliaLanding";
import { RaizTherapyLanding } from "@/components/terapeuta/RaizTherapyLanding";
import { RutaVivaLanding } from "@/components/viajes/RutaVivaLanding";

export const dynamic = "force-dynamic";

// Cada nicho tiene su landing dedicada; la reserva vive en /[slug]/agendar (o /reservar para viajes).
const LANDINGS: Record<string, (props: { slug: string }) => React.ReactNode> = {
  barberia: BlackFoldLanding,
  manicurista: LunaNailLanding,
  lashista: VelvetLashLanding,
  medico: VitaliaLanding,
  terapeuta: RaizTherapyLanding,
  viajes: RutaVivaLanding
};

export default async function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const Landing = LANDINGS[business.nicho];
  if (!Landing) notFound();

  return <Landing slug={business.slug} />;
}
