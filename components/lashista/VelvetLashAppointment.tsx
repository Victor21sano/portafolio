"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Eye, Check } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import type { NicheLayoutProps } from "@/components/niche/types";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const C = { ivory: "#FAF6EF", taupe: "#C8B8AA", espresso: "#3A2A24", nude: "#E7D2C4", champagne: "#D8B76A" };
const serif = "var(--font-fraunces)";

const EFFECTS = ["Natural", "Cat Eye", "Doll Eye", "Wispy", "Híbrido", "Volumen suave", "No sé, quiero asesoría"];

const EXTRA = [
  { name: "primera", label: "¿Primera vez con extensiones?", placeholder: "Selecciona", options: ["Sí", "No"] },
  { name: "sensibilidad", label: "¿Sensibilidad o alergias?", placeholder: "Selecciona", options: ["No", "Sí", "No estoy segura"] }
];

export function VelvetLashAppointment({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const root = useRef<HTMLDivElement>(null);
  const [effect, setEffect] = useState("");

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".vl-appt-head > *", { y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.ivory, color: C.espresso, fontFamily: "var(--font-inter)" }}>
      {/* Encabezado */}
      <header className="border-b border-black/5 px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href={`/${business.slug}`} className="text-lg tracking-[0.12em]" style={{ fontFamily: serif, color: C.espresso }}>
            VELVET <span style={{ color: C.champagne }}>LASH</span>
          </Link>
          <Link href={`/${business.slug}`} className="inline-flex items-center gap-2 text-sm transition hover:opacity-60" style={{ color: C.espresso }}>
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <div className="vl-appt-head mb-10 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: C.taupe }}>
            <Eye size={14} /> Reserva
          </p>
          <h1 className="text-4xl leading-tight sm:text-5xl" style={{ fontFamily: serif, color: C.espresso }}>Reserva tu diseño de mirada</h1>
          <p className="mt-3 text-lg" style={{ color: C.espresso }}>
            Cuéntanos qué efecto quieres lograr y selecciona el día ideal para tu cita.
          </p>
        </div>

        {/* Selector visual de estilo */}
        <div className="mb-10">
          <p className="label mb-3" style={{ color: C.taupe }}>Elige tu efecto</p>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {EFFECTS.map((e) => {
              const active = e === effect;
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEffect(active ? "" : e)}
                  className="flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition active:scale-95"
                  style={{
                    borderColor: active ? C.espresso : C.nude,
                    backgroundColor: active ? C.espresso : "#FFFFFF",
                    color: active ? "#FFFFFF" : C.espresso,
                    transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)"
                  }}
                >
                  {active ? <Check size={15} /> : null}
                  {e}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulario (reserva real) */}
        <BookingForm
          business={business}
          services={services}
          selectedService={selectedService}
          selectedDate={selectedDate}
          slots={slots}
          design={design}
          appointmentName={appointmentName}
          extraNote={effect ? `Efecto: ${effect}` : undefined}
          extraSelects={EXTRA}
          commentsField
        />
      </main>
    </div>
  );
}
