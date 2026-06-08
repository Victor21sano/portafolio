import { notFound, redirect } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data";
import { RutaVivaReserva } from "@/components/viajes/RutaVivaReserva";

export const dynamic = "force-dynamic";

export default async function ReservarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  // La reserva tipo viaje solo aplica al nicho de viajes; el resto reserva en /[slug]/agendar.
  if (business.nicho !== "viajes") {
    redirect(`/${slug}`);
  }

  // Paleta viajera para los inputs (.field usa --brand).
  const styleVars = {
    "--brand": "0 119 182",
    "--accent": "244 180 0",
    "--ink": "16 42 67",
    "--paper": "255 253 247",
    "--font-display": "var(--font-space)",
    "--font-body": "var(--font-inter)",
    "--radius": "14px"
  } as React.CSSProperties;

  return (
    <main style={styleVars}>
      <RutaVivaReserva slug={business.slug} />
    </main>
  );
}
