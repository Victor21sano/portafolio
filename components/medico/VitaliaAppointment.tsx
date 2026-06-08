"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowLeft, AlertCircle, Check, Plus, Sun, Moon, UserRound,
  Stethoscope, Baby, Flower2, ScanFace, HeartPulse, Bone, Salad, Brain, Smile, FlaskConical
} from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import type { NicheLayoutProps } from "@/components/niche/types";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const C = { petrol: "#0F4C5C", green: "#2A9D8F", white: "#FFFFFF", mist: "#F4F7F8", text: "#4A5560", deep: "#12343B", aqua: "#DFF5F2" };
const sans = "var(--font-sora)";

const SPECIALTIES = [
  { icon: Stethoscope, n: "Medicina general" },
  { icon: Baby, n: "Pediatría" },
  { icon: Flower2, n: "Ginecología" },
  { icon: ScanFace, n: "Dermatología" },
  { icon: HeartPulse, n: "Cardiología" },
  { icon: Bone, n: "Traumatología" },
  { icon: Salad, n: "Nutrición" },
  { icon: Brain, n: "Psicología" },
  { icon: Smile, n: "Odontología" },
  { icon: FlaskConical, n: "Laboratorio clínico" }
];

type Doctor = { name: string; shift: "am" | "pm" };

// 2 médicos por especialidad: uno matutino, uno vespertino.
const DOCTORS: Record<string, Doctor[]> = {
  "Medicina general": [{ name: "Dr. Raúl Ortega", shift: "am" }, { name: "Dra. Paula Ríos", shift: "pm" }],
  "Pediatría": [{ name: "Dra. Elena Martínez", shift: "am" }, { name: "Dr. Hugo Salas", shift: "pm" }],
  "Ginecología": [{ name: "Dra. Sofía Campos", shift: "am" }, { name: "Dra. Lucía Ferrer", shift: "pm" }],
  "Dermatología": [{ name: "Dra. Karina Lugo", shift: "am" }, { name: "Dr. Iván Beltrán", shift: "pm" }],
  "Cardiología": [{ name: "Dr. Luis Herrera", shift: "am" }, { name: "Dra. Mónica Vela", shift: "pm" }],
  "Traumatología": [{ name: "Dr. Andrés Molina", shift: "am" }, { name: "Dr. Óscar Pineda", shift: "pm" }],
  "Nutrición": [{ name: "Lic. Daniela Cruz", shift: "am" }, { name: "Lic. Mariana Soto", shift: "pm" }],
  "Psicología": [{ name: "Psic. Jorge Lara", shift: "am" }, { name: "Psic. Andrea Nava", shift: "pm" }],
  "Odontología": [{ name: "Dr. Felipe Cano", shift: "am" }, { name: "Dra. Renata Gil", shift: "pm" }],
  "Laboratorio clínico": [{ name: "QFB Carlos Méndez", shift: "am" }, { name: "QFB Laura Díaz", shift: "pm" }]
};

const SHIFT_LABEL = { am: "Matutino · 9:00–14:00", pm: "Vespertino · 14:00–17:00" } as const;

const EXTRA_INPUTS = [
  { name: "edad", label: "Edad", type: "number" as const, placeholder: "Ej. 35" },
  { name: "motivo", label: "Motivo de consulta", type: "textarea" as const, placeholder: "Describe brevemente el motivo de tu consulta" }
];

const EXTRA_SELECTS = [
  { name: "primera", label: "¿Primera vez en la clínica?", placeholder: "Selecciona", options: ["Sí", "No"] }
];

export function VitaliaAppointment({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const root = useRef<HTMLDivElement>(null);
  const [specialty, setSpecialty] = useState("");
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".vt-appt-head > *", { y: 22, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  function chooseSpecialty(name: string) {
    const active = name === specialty;
    setSpecialty(active ? "" : name);
    setDoctor(null); // al cambiar de especialidad, se resetea el médico
  }

  const note = specialty
    ? `Especialidad: ${specialty}${doctor ? ` · Médico: ${doctor.name} (${SHIFT_LABEL[doctor.shift].split(" ·")[0]})` : ""}`
    : undefined;

  return (
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.white, color: C.text, fontFamily: "var(--font-inter)" }}>
      {/* Encabezado */}
      <header className="border-b border-black/5 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href={`/${business.slug}`} className="flex items-center gap-2 text-lg font-bold" style={{ fontFamily: sans, color: C.petrol }}>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ backgroundColor: C.green }}><Plus size={18} /></span>
            CLÍNICA <span style={{ color: C.green }}>VITALIA</span>
          </Link>
          <Link href={`/${business.slug}`} className="inline-flex items-center gap-2 text-sm transition hover:text-[#0F4C5C]">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="vt-appt-head mb-6 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: sans, color: C.deep }}>Agenda tu cita médica</h1>
          <p className="mt-3 text-lg">
            Selecciona la especialidad, tu médico, fecha y horario. Nuestro equipo confirmará tu cita por teléfono o WhatsApp.
          </p>
        </div>

        <div className="vt-appt-head mb-10 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#F1E0C9", backgroundColor: "#FBF6EC", color: "#8A6D3B" }}>
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          En caso de emergencia médica, acude al servicio de urgencias más cercano.
        </div>

        {/* 1. Selector de especialidad */}
        <div className="mb-8">
          <p className="label mb-3" style={{ color: C.text }}>1 · Selecciona la especialidad</p>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
            {SPECIALTIES.map((s) => {
              const active = s.n === specialty;
              return (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => chooseSpecialty(s.n)}
                  className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center text-xs font-medium transition active:scale-95"
                  style={{
                    borderColor: active ? C.petrol : C.mist,
                    backgroundColor: active ? C.aqua : C.white,
                    color: active ? C.petrol : C.text,
                    transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)"
                  }}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: active ? C.petrol : C.mist, color: active ? C.white : C.petrol }}>
                    {active ? <Check size={18} /> : <s.icon size={18} />}
                  </span>
                  {s.n}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Selector de médico (según especialidad y turno) */}
        {specialty ? (
          <div className="mb-10 animate-fade-up">
            <p className="label mb-3" style={{ color: C.text }}>2 · Elige tu médico</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(DOCTORS[specialty] ?? []).map((d) => {
                const active = doctor?.name === d.name;
                const ShiftIcon = d.shift === "am" ? Sun : Moon;
                return (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setDoctor(active ? null : d)}
                    className="flex items-center gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.98]"
                    style={{
                      borderColor: active ? C.petrol : C.mist,
                      backgroundColor: active ? C.aqua : C.white,
                      transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)"
                    }}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ backgroundColor: active ? C.petrol : C.mist, color: active ? C.white : C.petrol }}>
                      {active ? <Check size={20} /> : <UserRound size={22} />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold" style={{ fontFamily: sans, color: C.deep }}>{d.name}</span>
                      <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: C.green }}>
                        <ShiftIcon size={13} /> {SHIFT_LABEL[d.shift]}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {doctor ? (
              <p className="mt-3 text-sm" style={{ color: C.text }}>
                Mostrando horarios del turno <strong>{doctor.shift === "am" ? "matutino" : "vespertino"}</strong> de {doctor.name}.
              </p>
            ) : (
              <p className="mt-3 text-sm" style={{ color: C.text }}>Elige un médico para ver sus horarios disponibles.</p>
            )}
          </div>
        ) : null}

        {/* 3. Formulario (reserva real) */}
        <p className="label mb-3" style={{ color: C.text }}>3 · Tus datos y horario</p>
        {doctor ? (
          <BookingForm
            business={business}
            services={services}
            selectedService={selectedService}
            selectedDate={selectedDate}
            slots={slots}
            design={design}
            appointmentName={appointmentName}
            extraNote={note}
            extraInputs={EXTRA_INPUTS}
            extraSelects={EXTRA_SELECTS}
            commentsField
            slotShift={doctor.shift}
          />
        ) : (
          <div className="card px-5 py-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: C.aqua, color: C.petrol }}>
              <UserRound size={22} />
            </div>
            <h2 className="mt-4 text-xl font-semibold" style={{ fontFamily: sans, color: C.deep }}>Elige un médico para continuar</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6" style={{ color: C.text }}>
              Al seleccionar médico mostraremos únicamente los horarios de su turno matutino o vespertino.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
