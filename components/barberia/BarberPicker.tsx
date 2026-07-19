"use client";

import Image from "next/image";
import { Scissors } from "lucide-react";
import type { BarberInfo } from "@/lib/types";

const GOLD = "#C9A227";

/** Selector de barbero obligatorio. La cita se guarda con su staff_id. */
export function BarberPicker({ barbers, value, onChange }: { barbers: BarberInfo[]; value?: string; onChange: (id: string) => void }) {
  return (
    <section aria-label="Elige tu barbero" className="mb-8">
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A9A9A]">
        <Scissors size={14} style={{ color: GOLD }} /> Elige tu barbero
      </p>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:gap-4">
        {barbers.map((b) => {
          const active = value === b.id;
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(b.id)}
              className="group overflow-hidden rounded-xl border bg-[#141414] text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: active ? GOLD : "rgba(255,255,255,0.1)",
                boxShadow: active ? "0 0 0 1px #C9A227, 0 12px 30px rgba(0,0,0,0.5)" : "none",
                outlineColor: GOLD
              }}
            >
              <span className="relative block aspect-[4/5] w-full overflow-hidden bg-[#141414]">
                {/* Fallback visible si la foto no carga: el flujo nunca se bloquea. */}
                <span className="absolute inset-0 grid place-items-center text-white/15">
                  <Scissors size={28} />
                </span>
                <Image src={b.foto} alt={`Barbero ${b.nombre}`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
              </span>
              <span className="block px-2.5 py-2 sm:px-3.5 sm:py-3">
                <span
                  className="block truncate text-sm font-semibold uppercase sm:text-base"
                  style={{ fontFamily: "var(--font-oswald)", color: active ? GOLD : "#F5F5F5" }}
                >
                  {b.nombre}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-[#8A8A8A] sm:text-xs">{b.especialidad}</span>
              </span>
            </button>
          );
        })}
      </div>
      {!value ? (
        <p className="mt-4 text-center text-sm text-[#9A9A9A]">Elige a tu barbero para ver sus horarios disponibles.</p>
      ) : null}
    </section>
  );
}
