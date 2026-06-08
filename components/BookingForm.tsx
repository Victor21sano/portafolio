"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Clock, Loader2, CalendarDays, Sparkles } from "lucide-react";
import { createBooking } from "@/app/actions";
import { money } from "@/lib/format";
import type { Business, Service, Slot } from "@/lib/types";
import type { NicheDesign } from "@/lib/niche-design";

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nextDays(count: number) {
  const out: { value: string; weekday: string; day: string }[] = [];
  const base = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push({
      value: ymd(d),
      weekday: i === 0 ? "Hoy" : d.toLocaleDateString("es-MX", { weekday: "short" }),
      day: d.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
    });
  }
  return out;
}

export function BookingForm({
  business,
  services,
  selectedService,
  selectedDate,
  slots,
  design,
  appointmentName,
  dark = false,
  extraSelects,
  extraInputs,
  commentsField = false,
  extraNote,
  slotShift
}: {
  business: Business;
  services: Service[];
  selectedService: Service | null;
  selectedDate: string;
  slots: Slot[];
  design: NicheDesign;
  appointmentName: string;
  /** Superficie oscura (negro/gris) para temas premium tipo BlackFold */
  dark?: boolean;
  /** Selects extra por nicho (barbero, tipo de diseño, largo…). Se guardan en notas. */
  extraSelects?: { name: string; label: string; options: string[]; placeholder?: string }[];
  /** Inputs de texto extra (edad, motivo…). Se guardan en notas. */
  extraInputs?: { name: string; label: string; type?: "text" | "number" | "tel" | "textarea"; placeholder?: string; full?: boolean }[];
  /** Mostrar campo de comentarios */
  commentsField?: boolean;
  /** Nota inyectada desde fuera (ej. efecto elegido en un selector visual). */
  extraNote?: string;
  /** Filtra horarios por turno: "am" (antes de 14:00) o "pm" (14:00+). Para elegir médico por turno. */
  slotShift?: "am" | "pm";
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [comentarios, setComentarios] = useState("");

  // Agrega los campos extra (barbero, tipo de diseño, etc.) + comentarios en una sola nota.
  const notasValue = [
    extraNote?.trim() || null,
    ...(extraInputs ?? [])
      .map((f) => (extras[f.name]?.trim() ? `${f.label}: ${extras[f.name].trim()}` : null))
      .filter(Boolean),
    ...(extraSelects ?? [])
      .map((f) => (extras[f.name] ? `${f.label}: ${extras[f.name]}` : null))
      .filter(Boolean),
    comentarios.trim() ? `Comentarios: ${comentarios.trim()}` : null
  ]
    .filter(Boolean)
    .join(" · ");
  const [state, action, pending] = useActionState(createBooking, { ok: true, message: "" });
  const [navPending, startNav] = useTransition();
  const days = nextDays(10);
  const radius = design.radius;

  // Superficies según tema (claro por defecto, oscuro para BlackFold).
  const surface = dark ? "rgb(24 24 27)" : "white";
  const surfaceActive = dark ? "rgb(var(--brand) / 0.16)" : "rgb(var(--brand) / 0.06)";
  const borderIdle = dark ? "rgb(63 63 70)" : "rgb(228 228 231)";
  const textMain = dark ? "rgb(244 244 245)" : "rgb(24 24 27)";
  const textSub = dark ? "rgb(161 161 170)" : "rgb(113 113 122)";

  // Estilo de horario por nicho — cada rubro tiene su forma propia.
  function slotStyle(active: boolean): React.CSSProperties {
    const base: React.CSSProperties = {
      transition:
        "background-color 160ms var(--ease-out), color 160ms var(--ease-out), box-shadow 220ms var(--ease-out), border-color 160ms var(--ease-out)"
    };
    const brand = "rgb(var(--brand))";
    switch (design.slot) {
      case "ticket": // barbería: ficha angular, números tabulares
        return {
          ...base,
          fontFamily: "var(--font-oswald)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.04em",
          borderRadius: 2,
          border: active ? `2px solid ${brand}` : "2px solid rgb(63 63 70)",
          backgroundColor: active ? brand : "rgb(24 24 27)",
          color: "white"
        };
      case "pill": // lashista: pastilla elegante
        return {
          ...base,
          borderRadius: 9999,
          border: active ? "1px solid transparent" : "1px solid rgb(228 228 231)",
          backgroundColor: active ? brand : "white",
          color: active ? "white" : "rgb(63 63 70)",
          boxShadow: active ? "0 10px 24px rgb(var(--brand) / 0.28)" : "none"
        };
      case "bubble": // manicurista: burbuja juguetona
        return {
          ...base,
          borderRadius: 18,
          border: "2px solid",
          borderColor: active ? "transparent" : "rgb(var(--brand) / 0.25)",
          backgroundColor: active ? brand : "rgb(var(--brand) / 0.06)",
          color: active ? "white" : "rgb(39 39 42)",
          boxShadow: active ? "0 12px 26px rgb(var(--brand) / 0.32)" : "none"
        };
      case "grid": // médico: cuadrícula pulcra y mínima
        return {
          ...base,
          borderRadius: 8,
          border: active ? `1px solid ${brand}` : "1px solid rgb(226 232 240)",
          backgroundColor: active ? brand : "rgb(248 250 252)",
          color: active ? "white" : "rgb(51 65 85)"
        };
      case "soft": // terapeuta: suave y calmo
      default:
        return {
          ...base,
          borderRadius: 14,
          border: "1px solid transparent",
          backgroundColor: active ? brand : "rgb(var(--brand) / 0.07)",
          color: active ? "white" : "rgb(63 63 70)"
        };
    }
  }

  // Al cambiar de servicio, fecha o turno, los horarios cambian: limpia la selección.
  useEffect(() => {
    setSelectedSlot("");
  }, [selectedService?.id, selectedDate, slotShift]);

  function navigate(next: { service?: string; date?: string }) {
    const params = new URLSearchParams();
    params.set("service", next.service ?? selectedService?.id ?? "");
    params.set("date", next.date ?? selectedDate);
    startNav(() => router.push(`?${params.toString()}`, { scroll: false }));
  }

  const slotsBusy = navPending;

  // Filtra por turno del médico elegido: matutino (<14:00) o vespertino (14:00+).
  const visibleSlots = slotShift
    ? slots.filter((s) => {
        const hour = Number(s.label.slice(0, 2));
        return slotShift === "am" ? hour < 14 : hour >= 14;
      })
    : slots;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]" data-theme={dark ? "dark" : undefined}>
      {/* ----- Columna izquierda: servicio + resumen ----- */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="card p-4">
          <p className="label mb-3 flex items-center gap-2">
            <Sparkles size={14} /> Servicio
          </p>
          <div className="space-y-2">
            {services.map((service) => {
              const active = service.id === selectedService?.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => navigate({ service: service.id })}
                  className="group flex w-full items-center justify-between gap-3 border p-3 text-left"
                  style={{
                    borderRadius: radius,
                    borderColor: active ? "rgb(var(--brand))" : borderIdle,
                    backgroundColor: active ? surfaceActive : surface,
                    transition: "border-color 180ms var(--ease-out), background-color 180ms var(--ease-out)"
                  }}
                >
                  <span>
                    <span className="block text-sm font-semibold" style={{ color: textMain }}>{service.nombre}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: textSub }}>
                      <Clock size={12} /> {service.duracion_min} min
                    </span>
                  </span>
                  <span className="text-sm font-bold" style={{ color: "rgb(var(--brand))" }}>
                    {money(service.precio)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedService ? (
          <div
            className="animate-scale-in overflow-hidden text-white"
            style={{ borderRadius: "1rem", background: design.heroBackground, backgroundSize: "180% 180%" }}
          >
            <div className="p-5" style={{ backgroundColor: "rgb(0 0 0 / 0.12)" }}>
              <p className="text-xs uppercase tracking-wider text-white/70">Tu selección</p>
              <p className="mt-1 text-xl font-bold leading-tight">{selectedService.nombre}</p>
              {selectedService.descripcion ? (
                <p className="mt-2 text-sm leading-6 text-white/80">{selectedService.descripcion}</p>
              ) : null}
              <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-sm">
                <span className="text-white/80">{selectedService.duracion_min} minutos</span>
                <span className="text-lg font-bold">{money(selectedService.precio)}</span>
              </div>
            </div>
          </div>
        ) : null}
      </aside>

      {/* ----- Columna derecha: fecha, horarios, contacto ----- */}
      <form action={action} className="card p-5 sm:p-6">
        <input type="hidden" name="slug" value={business.slug} />
        <input type="hidden" name="serviceId" value={selectedService?.id ?? ""} />
        <input type="hidden" name="slot" value={selectedSlot} />
        <input type="hidden" name="notas" value={notasValue} />

        {/* Fecha */}
        <p className="label mb-3 flex items-center gap-2">
          <CalendarDays size={14} /> Fecha
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {days.map((d) => {
            const active = d.value === selectedDate;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => navigate({ date: d.value })}
                className="flex shrink-0 flex-col items-center border px-3 py-2"
                style={{
                  borderRadius: radius,
                  minWidth: 64,
                  borderColor: active ? "rgb(var(--brand))" : borderIdle,
                  backgroundColor: active ? "rgb(var(--brand))" : surface,
                  color: active ? "white" : textSub,
                  transition: "background-color 180ms var(--ease-out), border-color 180ms var(--ease-out)"
                }}
              >
                <span className="text-xs font-semibold capitalize">{d.weekday}</span>
                <span className="text-xs opacity-80">{d.day}</span>
              </button>
            );
          })}
        </div>

        {/* Horarios */}
        <p className="label mb-3 mt-6 flex items-center gap-2">
          <Clock size={14} /> Horarios disponibles
          {slotsBusy ? <Loader2 size={14} className="animate-spin text-zinc-400" /> : null}
        </p>

        <div className="min-h-[88px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedService?.id}-${selectedDate}-${slotShift ?? "all"}`}
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.025 } } }}
              className="grid grid-cols-3 gap-2 sm:grid-cols-4"
              style={{ opacity: slotsBusy ? 0.5 : 1, transition: "opacity 180ms ease" }}
            >
              {visibleSlots.map((slot) => {
                const value = `${slot.startUtc}|${slot.endUtc}`;
                const active = value === selectedSlot;
                return (
                  <motion.button
                    key={slot.startUtc}
                    type="button"
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
                    whileTap={reduce ? undefined : { scale: 0.95 }}
                    onClick={() => setSelectedSlot(value)}
                    className="relative py-3 text-center text-sm font-semibold"
                    style={slotStyle(active)}
                  >
                    {slot.label}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {visibleSlots.length === 0 && !slotsBusy ? (
            <div
              className="flex items-center gap-3 px-4 py-5 text-sm"
              style={{ borderRadius: radius, backgroundColor: "rgb(254 252 232)", color: "rgb(133 77 14)" }}
            >
              <CalendarDays size={18} />
              {slotShift ? "Este turno no tiene horarios para esta fecha. Prueba otro día o el otro turno." : "No hay horarios para esta fecha. Prueba con otro día."}
            </div>
          ) : null}
        </div>

        {/* Datos de contacto */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="nombre">Nombre</label>
            <input id="nombre" className="field mt-2" name="nombre" required minLength={2} placeholder="Tu nombre" />
          </div>
          <div>
            <label className="label" htmlFor="telefono">Teléfono / WhatsApp</label>
            <input id="telefono" className="field mt-2" name="telefono" required minLength={8} placeholder="55 1234 5678" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="email">Email (opcional)</label>
            <input id="email" className="field mt-2" name="email" type="email" placeholder="opcional@correo.com" />
          </div>
          {(extraInputs ?? []).map((f) =>
            f.type === "textarea" ? (
              <div key={f.name} className="sm:col-span-2">
                <label className="label" htmlFor={f.name}>{f.label}</label>
                <textarea
                  id={f.name}
                  className="field mt-2 min-h-20 py-3"
                  value={extras[f.name] ?? ""}
                  onChange={(e) => setExtras((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  placeholder={f.placeholder}
                />
              </div>
            ) : (
              <div key={f.name} className={f.full ? "sm:col-span-2" : undefined}>
                <label className="label" htmlFor={f.name}>{f.label}</label>
                <input
                  id={f.name}
                  className="field mt-2"
                  type={f.type ?? "text"}
                  value={extras[f.name] ?? ""}
                  onChange={(e) => setExtras((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  placeholder={f.placeholder}
                />
              </div>
            )
          )}
          {(extraSelects ?? []).map((f) => (
            <div key={f.name}>
              <label className="label" htmlFor={f.name}>{f.label}</label>
              <select
                id={f.name}
                className="field mt-2"
                value={extras[f.name] ?? ""}
                onChange={(e) => setExtras((prev) => ({ ...prev, [f.name]: e.target.value }))}
              >
                <option value="">{f.placeholder ?? "Sin preferencia"}</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
          {commentsField ? (
            <div className="sm:col-span-2">
              <label className="label" htmlFor="comentarios">Comentarios (opcional)</label>
              <textarea
                id="comentarios"
                className="field mt-2 min-h-24 py-3"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="¿Algo que debamos saber?"
              />
            </div>
          ) : null}
        </div>

        <AnimatePresence>
          {!state.ok ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden px-4 py-3 text-sm"
              style={{ borderRadius: radius, backgroundColor: "rgb(254 242 242)", color: "rgb(185 28 28)" }}
            >
              {state.message}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <button
          className="btn btn-accent mt-6 w-full"
          style={{ height: 52, borderRadius: radius }}
          disabled={pending || !selectedService || visibleSlots.length === 0 || !selectedSlot}
        >
          {pending ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Confirmando…
            </>
          ) : selectedSlot ? (
            <>
              <Check size={18} /> Confirmar reserva
            </>
          ) : (
            "Elige un horario"
          )}
        </button>
        <p className="mt-3 text-center text-xs text-zinc-500">
          Recibirás la confirmación de tu {appointmentName} al instante.
        </p>
      </form>
    </div>
  );
}
