"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowLeft, Leaf, Check, Lock, Home, Monitor, Compass, RefreshCw } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import type { NicheLayoutProps } from "@/components/niche/types";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const C = { beige: "#F5EFE6", sage: "#9CAF88", deep: "#4F6F52", coffee: "#8B6F5A", bone: "#FFFDF8", warm: "#6E6A63", terra: "#C9826B" };
const serif = "var(--font-fraunces)";

const MODALITIES = [
  { icon: Home, t: "Presencial", dur: "50 min", desc: "Sesión en consultorio, ambiente tranquilo y privado." },
  { icon: Monitor, t: "En línea", dur: "50 min", desc: "Por videollamada desde un espacio cómodo para ti." },
  { icon: Compass, t: "Primera orientación", dur: "40 min", desc: "Sesión inicial para conocer tu motivo y resolver dudas." },
  { icon: RefreshCw, t: "Seguimiento", dur: "50 min", desc: "Continuidad de tu proceso terapéutico." }
];

const EXTRA_SELECTS = [
  { name: "primera", label: "¿Es tu primera vez en terapia?", placeholder: "Selecciona", options: ["Sí", "No", "Prefiero no decirlo"] },
  { name: "motivo", label: "Motivo principal de consulta", placeholder: "Selecciona (opcional)", options: ["Ansiedad o estrés", "Autoestima", "Relaciones personales", "Duelo o pérdida", "Cambios importantes", "Gestión emocional", "Otro", "Prefiero comentarlo en sesión"] },
  { name: "preferencia", label: "Preferencia de sesión", placeholder: "Selecciona", options: ["Presencial", "En línea", "Cualquiera"] }
];

export function RaizTherapyAppointment({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const root = useRef<HTMLDivElement>(null);
  const [modality, setModality] = useState("");

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".rz-appt-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.12 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.beige, color: C.warm, fontFamily: "var(--font-nunito)" }}>
      {/* Encabezado sereno */}
      <header className="border-b border-black/5 px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href={`/${business.slug}`} className="inline-flex items-center gap-2 text-xl" style={{ fontFamily: serif, color: C.deep }}>
            <Leaf size={20} style={{ color: C.sage }} /> Raíz <span style={{ color: C.terra }}>Terapia</span>
          </Link>
          <Link href={`/${business.slug}`} className="inline-flex items-center gap-2 text-sm transition hover:text-[#4F6F52]" style={{ color: C.deep }}>
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <div className="rz-appt-head mb-10 text-center">
          <h1 className="text-4xl leading-tight sm:text-5xl" style={{ fontFamily: serif, color: C.deep }}>Agenda tu primera sesión</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg">
            Elige la modalidad y horario que mejor se adapte a ti. Tu información será tratada con confidencialidad.
          </p>
          <p className="mt-2 text-sm italic" style={{ color: C.coffee }}>
            Puedes compartir solo lo que te sientas cómodo compartiendo.
          </p>
        </div>

        {/* Selector de modalidad */}
        <div className="mb-10">
          <p className="label mb-3" style={{ color: C.warm }}>Elige tu modalidad</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODALITIES.map((m) => {
              const active = m.t === modality;
              return (
                <button
                  key={m.t}
                  type="button"
                  onClick={() => setModality(active ? "" : m.t)}
                  className="flex flex-col gap-2 rounded-2xl border p-5 text-left transition active:scale-[0.98]"
                  style={{
                    borderColor: active ? C.deep : "#E7E0D3",
                    backgroundColor: active ? "#EEF2E8" : C.bone,
                    transitionTimingFunction: "cubic-bezier(0.33,1,0.68,1)"
                  }}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: active ? C.deep : C.beige, color: active ? "white" : C.deep }}>
                    {active ? <Check size={18} /> : <m.icon size={18} />}
                  </span>
                  <span className="font-bold" style={{ color: C.deep }}>{m.t}</span>
                  <span className="text-xs" style={{ color: C.sage }}>{m.dur}</span>
                  <span className="text-xs leading-5">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nota de privacidad (antes del formulario/botón) */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm leading-6" style={{ borderColor: "#D6E0CC", backgroundColor: "#EEF2E8", color: C.deep }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ backgroundColor: C.sage, color: "white" }}><Lock size={16} /></span>
          Tu información será utilizada únicamente para coordinar tu sesión. No es necesario compartir detalles sensibles en este formulario; podrás hablarlo durante la consulta si lo deseas.
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
          extraNote={modality ? `Modalidad: ${modality}` : undefined}
          extraSelects={EXTRA_SELECTS}
          commentsField
        />
      </main>
    </div>
  );
}
