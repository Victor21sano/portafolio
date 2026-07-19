import { notFound, redirect } from "next/navigation";
import { getAvailableSlots, getBusinessBySlug, getBusinessServices } from "@/lib/data";
import { todayInTz } from "@/lib/format";
import { nicheDesign } from "@/lib/niche-design";
import { BlackFoldAppointment } from "@/components/barberia/BlackFoldAppointment";
import { LunaNailAppointment } from "@/components/manicurista/LunaNailAppointment";
import { VelvetLashAppointment } from "@/components/lashista/VelvetLashAppointment";
import { VitaliaAppointment } from "@/components/medico/VitaliaAppointment";
import { RaizTherapyAppointment } from "@/components/terapeuta/RaizTherapyAppointment";
import type { BarberInfo } from "@/lib/types";
import type { NicheLayoutProps } from "@/components/niche/types";

export const dynamic = "force-dynamic";

// Nichos con página de agenda dedicada y su paleta de marca.
const APPTS: Record<
  string,
  { Component: (p: NicheLayoutProps) => React.ReactNode; styleVars: React.CSSProperties }
> = {
  barberia: {
    Component: BlackFoldAppointment,
    styleVars: {
      "--brand": "201 162 39",
      "--accent": "201 162 39",
      "--ink": "245 245 245",
      "--paper": "11 11 11",
      "--font-display": "var(--font-oswald)",
      "--font-body": "var(--font-inter)",
      "--radius": "6px"
    } as React.CSSProperties
  },
  manicurista: {
    Component: LunaNailAppointment,
    styleVars: {
      "--brand": "122 48 69",
      "--accent": "214 181 109",
      "--ink": "111 94 98",
      "--paper": "255 247 242",
      "--font-display": "var(--font-playfair)",
      "--font-body": "var(--font-inter)",
      "--radius": "16px"
    } as React.CSSProperties
  },
  lashista: {
    Component: VelvetLashAppointment,
    styleVars: {
      "--brand": "58 42 36",
      "--accent": "216 183 106",
      "--ink": "58 42 36",
      "--paper": "250 246 239",
      "--font-display": "var(--font-fraunces)",
      "--font-body": "var(--font-inter)",
      "--radius": "14px"
    } as React.CSSProperties
  },
  medico: {
    Component: VitaliaAppointment,
    styleVars: {
      "--brand": "15 76 92",
      "--accent": "42 157 143",
      "--ink": "74 85 96",
      "--paper": "255 255 255",
      "--font-display": "var(--font-sora)",
      "--font-body": "var(--font-inter)",
      "--radius": "10px"
    } as React.CSSProperties
  },
  terapeuta: {
    Component: RaizTherapyAppointment,
    styleVars: {
      "--brand": "79 111 82",
      "--accent": "201 130 107",
      "--ink": "110 106 99",
      "--paper": "245 239 230",
      "--font-display": "var(--font-fraunces)",
      "--font-body": "var(--font-nunito)",
      "--radius": "18px"
    } as React.CSSProperties
  }
};

export default async function AgendarPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string; date?: string; barbero?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const appt = APPTS[business.nicho];
  // Los nichos sin agenda dedicada reservan directo en /[slug].
  if (!appt) {
    redirect(`/${slug}`);
  }

  const services = await getBusinessServices(business.id);
  const selectedService = services.find((service) => service.id === query.service) ?? services[0] ?? null;
  const selectedDate = query.date ?? todayInTz(business.timezone);
  const barbers: BarberInfo[] = business.branding_json?.barberos ?? [];
  const selectedBarber = barbers.find((b) => b.id === query.barbero)?.id;
  const needsBarber = barbers.length > 0 && !selectedBarber;
  const slots =
    selectedService && !needsBarber
      ? await getAvailableSlots(business, selectedService, selectedDate, selectedBarber)
      : [];
  const design = nicheDesign(business.nicho);
  const appointmentName = business.branding_json?.appointmentName ?? "cita";

  const { Component, styleVars } = appt;

  return (
    <main style={styleVars}>
      <Component
        business={business}
        services={services}
        selectedService={selectedService}
        selectedDate={selectedDate}
        slots={slots}
        design={design}
        appointmentName={appointmentName}
        barbers={barbers}
        selectedBarber={selectedBarber}
      />
    </main>
  );
}

