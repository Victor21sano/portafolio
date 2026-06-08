"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowLeft, Clock3, Image as ImageIcon, Sparkles } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { NAIL_IMAGES } from "@/lib/visual-assets";
import type { NicheLayoutProps } from "@/components/niche/types";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const C = { rose: "#E8B7C8", cream: "#FFF7F2", wine: "#7A3045", mauve: "#B76E79", warm: "#6F5E62", gold: "#D6B56D" };
const serif = "var(--font-playfair)";

const REMINDERS = [
  { icon: Clock3, t: "Llega 5 minutos antes de tu cita." },
  { icon: ImageIcon, t: "Si traes diseño de referencia, puedes mencionarlo." },
  { icon: Sparkles, t: "Para diseños complejos, considera más tiempo." }
];

const EXTRA = [
  { name: "tipo", label: "Tipo de diseño", placeholder: "Elige un estilo", options: ["Liso", "French", "Minimalista", "Chrome", "Glitter", "Pedrería sutil", "Diseño personalizado"] },
  { name: "largo", label: "Largo deseado", placeholder: "Elige el largo", options: ["Corto", "Medio", "Largo", "XL"] },
  { name: "referencia", label: "¿Traes referencia?", placeholder: "Selecciona", options: ["Sí", "No", "Quiero asesoría"] }
];

export function LunaNailAppointment({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const root = useRef<HTMLDivElement>(null);

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".ln-appt-panel", { x: -40, opacity: 0, duration: 0.9, ease: "power3.out" });
      gsap.from(".ln-appt-form", { x: 40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.cream, color: C.warm, fontFamily: "var(--font-inter)" }}>
      <header className="border-b border-black/5 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href={`/${business.slug}`} className="text-xl" style={{ fontFamily: serif, color: C.wine }}>
            Luna <span style={{ color: C.mauve }}>Nail Studio</span>
          </Link>
          <Link href={`/${business.slug}`} className="inline-flex items-center gap-2 text-sm transition hover:opacity-70" style={{ color: C.wine }}>
            <ArrowLeft size={16} /> Volver a inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Panel visual */}
        <aside className="ln-appt-panel">
          <span className="mb-4 block h-px w-16" style={{ background: `linear-gradient(90deg, ${C.gold}, transparent)` }} />
          <h1 className="text-4xl leading-tight sm:text-5xl" style={{ fontFamily: serif, color: C.wine }}>Reserva tu momento</h1>
          <p className="mt-4 max-w-sm text-lg leading-8">
            Elige tu servicio, fecha y horario. Tu cita será confirmada por mensaje.
          </p>

          <ul className="mt-7 space-y-3">
            {REMINDERS.map((r) => (
              <li key={r.t} className="flex items-start gap-3 text-sm">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: C.mauve }}>
                  <r.icon size={15} />
                </span>
                <span className="pt-1.5" style={{ color: C.wine }}>{r.t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white shadow-lg">
              <Image src={NAIL_IMAGES.appointment[0]} alt="Manicura profesional" fill unoptimized className="object-cover" />
            </div>
            <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white shadow-lg">
              <Image src={NAIL_IMAGES.appointment[1]} alt="Nail art en estudio" fill unoptimized className="object-cover" />
            </div>
          </div>
        </aside>

        {/* Formulario */}
        <div className="ln-appt-form">
          <BookingForm
            business={business}
            services={services}
            selectedService={selectedService}
            selectedDate={selectedDate}
            slots={slots}
            design={design}
            appointmentName={appointmentName}
            extraSelects={EXTRA}
            commentsField
          />
        </div>
      </main>
    </div>
  );
}
