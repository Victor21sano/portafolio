"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Scissors } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import type { NicheLayoutProps } from "@/components/niche/types";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const GOLD = "#C9A227";

export function BlackFoldAppointment({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const card = useRef<HTMLDivElement>(null);

  useIso(() => {
    if (!card.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(card.current, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.1 });
      gsap.from(".bf-appt-head > *", { y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Header consistente con la landing */}
      <header className="border-b border-white/5 bg-[#0B0B0B]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href={`/${business.slug}`} className="flex items-center gap-2 text-lg font-bold tracking-widest" style={{ fontFamily: "var(--font-oswald)" }}>
            <Scissors size={20} style={{ color: GOLD }} /> BLACK<span style={{ color: GOLD }}>FOLD</span>
          </Link>
          <Link href={`/${business.slug}`} className="inline-flex items-center gap-2 text-sm text-[#B9B9B9] transition hover:text-white">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </header>

      {/* Línea dorada decorativa */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A227]/60 to-transparent" />

      <main className="mx-auto max-w-5xl px-5 py-14">
        <div className="bf-appt-head mb-10 text-center">
          <span className="mx-auto mb-4 block h-px w-16 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
          <h1 className="text-4xl font-bold uppercase sm:text-5xl" style={{ fontFamily: "var(--font-oswald)" }}>
            Agenda tu <span style={{ color: GOLD }}>cita</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[#9A9A9A]">
            Selecciona tu servicio, fecha y horario. Nosotros nos encargamos del resto.
          </p>
        </div>

        <div ref={card}>
          <BookingForm
            business={business}
            services={services}
            selectedService={selectedService}
            selectedDate={selectedDate}
            slots={slots}
            design={design}
            appointmentName={appointmentName}
            dark
            extraSelects={[{ name: "barbero", label: "Barbero de preferencia", options: ["Carlos", "Miguel", "Andrés"] }]}
            commentsField
          />
        </div>

        <p className="mt-10 text-center text-sm text-[#6A6A6A]">
          <Link href={`/${business.slug}`} className="transition hover:text-white" style={{ color: GOLD }}>
            ← Volver a BLACK FOLD BARBER
          </Link>
        </p>
      </main>
    </div>
  );
}
