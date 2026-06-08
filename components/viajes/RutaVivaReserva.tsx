"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowLeft, Compass, Check, MapPin, Clock, Users, Ticket, CheckCircle2, Info } from "lucide-react";
import { TRAVEL_IMAGES } from "@/lib/visual-assets";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const C = { ocean: "#0077B6", aqua: "#00B4D8", sand: "#F7E7CE", terra: "#D96C3B", green: "#2D6A4F", sun: "#F4B400", white: "#FFFDF7", night: "#102A43" };
const display = "var(--font-space)";
const money = (n: number) => `$${n.toLocaleString("es-MX")}`;

type Departure = { date: string; dur: string; point: string; seats: number; price: number };
type Dest = { n: string; t: string; price: number; dur: string; src: string; departures: Departure[] };

const DESTS: Dest[] = [
  { n: "Ixtapa", t: "Playa", price: 2499, dur: "3 días", src: TRAVEL_IMAGES.destinations.Ixtapa, departures: [{ date: "15 al 17 de agosto", dur: "3 días", point: "Centro", seats: 8, price: 2499 }] },
  { n: "Ciudad de Guanajuato", t: "Colonial", price: 899, dur: "2 días", src: TRAVEL_IMAGES.destinations["Ciudad de Guanajuato"], departures: [{ date: "30 de agosto", dur: "2 días", point: "Terminal de autobuses", seats: 12, price: 899 }] },
  { n: "Grutas de Tolantongo", t: "Naturaleza", price: 1299, dur: "2 días", src: TRAVEL_IMAGES.destinations["Grutas de Tolantongo"], departures: [{ date: "6 de septiembre", dur: "2 días", point: "Centro", seats: 10, price: 1299 }] },
  { n: "Peña de Bernal", t: "Pueblo mágico", price: 999, dur: "1 día", src: TRAVEL_IMAGES.destinations["Peña de Bernal"], departures: [{ date: "13 de septiembre", dur: "1 día", point: "Plaza principal", seats: 15, price: 999 }] },
  { n: "Huasteca Potosina", t: "Aventura", price: 3299, dur: "3 días", src: TRAVEL_IMAGES.destinations["Huasteca Potosina"], departures: [{ date: "20 al 22 de septiembre", dur: "3 días", point: "Terminal de autobuses", seats: 6, price: 3299 }] },
  { n: "San Miguel de Allende", t: "Colonial", price: 1799, dur: "2 días", src: TRAVEL_IMAGES.destinations["San Miguel de Allende"], departures: [{ date: "27 de septiembre", dur: "2 días", point: "Centro", seats: 10, price: 1799 }] },
  { n: "Taxco", t: "Pueblo mágico", price: 1199, dur: "1 día", src: TRAVEL_IMAGES.destinations.Taxco, departures: [{ date: "4 de octubre", dur: "1 día", point: "Plaza principal", seats: 14, price: 1199 }] },
  { n: "Valle de Bravo", t: "Naturaleza", price: 1499, dur: "2 días", src: TRAVEL_IMAGES.destinations["Valle de Bravo"], departures: [{ date: "11 al 12 de octubre", dur: "2 días", point: "Centro", seats: 8, price: 1499 }] }
];

const ABORDAJE = ["Centro", "Terminal de autobuses", "Plaza principal", "Punto por confirmar"];
const PAGOS = ["Transferencia", "Efectivo", "Tarjeta", "Pago en parcialidades"];

export function RutaVivaReserva({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [dest, setDest] = useState<Dest | null>(null);
  const [departure, setDeparture] = useState<Departure | null>(null);
  const [seats, setSeats] = useState(1);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", abordaje: "", menores: "No", pago: "", comentarios: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".rv-r-head > *", { y: 22, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  function pickDest(d: Dest) {
    setDest(d);
    setDeparture(d.departures[0] ?? null);
  }

  const total = departure ? departure.price * seats : dest ? dest.price * seats : 0;

  function submit() {
    if (!form.nombre || !form.telefono || !dest || !departure || !form.abordaje || seats < 1) {
      setError("Completa nombre, teléfono, destino, salida, lugares y punto de abordaje.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  if (submitted && dest && departure) {
    return (
      <div className="grid min-h-screen place-items-center px-5 py-12" style={{ backgroundColor: C.sand }}>
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl animate-scale-in">
          <div className="px-7 py-8 text-center text-white" style={{ backgroundColor: C.ocean }}>
            <CheckCircle2 size={48} className="mx-auto" />
            <h1 className="mt-4 text-2xl font-bold" style={{ fontFamily: display }}>¡Solicitud enviada!</h1>
            <p className="mt-1 text-sm text-white/85">Tu boleto está casi listo</p>
          </div>
          <div className="space-y-3 p-7 text-sm" style={{ color: C.night }}>
            <p className="leading-6" style={{ color: "#4A5560" }}>
              Tu solicitud de reserva fue enviada. Te contactaremos por WhatsApp para confirmar disponibilidad, anticipo y detalles del viaje.
            </p>
            <div className="rounded-2xl border border-dashed p-4" style={{ borderColor: C.sand }}>
              <Row k="Destino" v={dest.n} />
              <Row k="Fecha" v={departure.date} />
              <Row k="Lugares" v={String(seats)} />
              <Row k="Abordaje" v={form.abordaje} />
              <div className="mt-2 flex items-center justify-between border-t pt-2" style={{ borderColor: C.sand }}>
                <span className="font-semibold">Total aprox.</span>
                <span className="text-lg font-bold" style={{ color: C.ocean, fontFamily: display }}>{money(total)}</span>
              </div>
            </div>
            <Link href={`/${slug}`} className="mt-2 block rounded-full px-5 py-3 text-center font-semibold text-white" style={{ backgroundColor: C.terra }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={root} className="min-h-screen overflow-x-hidden" style={{ backgroundColor: C.sand, color: C.night, fontFamily: "var(--font-inter)" }}>
      {/* Encabezado */}
      <header className="border-b border-black/5 bg-white/70 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href={`/${slug}`} className="inline-flex items-center gap-2 text-lg font-bold" style={{ fontFamily: display, color: C.night }}>
            <Compass size={20} style={{ color: C.sun }} /> RUTA VIVA <span style={{ color: C.ocean }}>MX</span>
          </Link>
          <Link href={`/${slug}`} className="inline-flex items-center gap-2 text-sm transition hover:text-[#0077B6]">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="rv-r-head mb-8 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: display, color: C.night }}>Reserva tu próxima aventura</h1>
          <p className="mt-3 text-lg" style={{ color: "#4A5560" }}>
            Selecciona destino, fecha y número de lugares. Te contactaremos para confirmar disponibilidad y método de pago.
          </p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm" style={{ color: C.terra }}>
            <Info size={14} /> Tu lugar se confirma después del anticipo o pago correspondiente.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            {/* 1. Destino */}
            <p className="label mb-3" style={{ color: "#4A5560" }}>1 · Elige tu destino</p>
            <div className="mb-8 flex max-w-full gap-3 overflow-x-auto pb-3">
              {DESTS.map((d) => {
                const active = dest?.n === d.n;
                return (
                  <button key={d.n} type="button" onClick={() => pickDest(d)} className="w-44 shrink-0 overflow-hidden rounded-2xl border bg-white text-left transition active:scale-95" style={{ borderColor: active ? C.ocean : "#E6E0D4", boxShadow: active ? "0 10px 24px rgba(0,119,182,0.25)" : "none" }}>
                    <div className="relative h-24 w-full">
                      <Image src={d.src} alt={d.n} fill unoptimized className="object-cover" />
                      {active ? <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-white" style={{ backgroundColor: C.ocean }}><Check size={14} /></span> : null}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-bold" style={{ fontFamily: display, color: C.night }}>{d.n}</p>
                      <p className="text-xs" style={{ color: "#8A8A8A" }}>{d.t} · {d.dur}</p>
                      <p className="text-sm font-bold" style={{ color: C.ocean }}>{money(d.price)}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2. Salida */}
            {dest ? (
              <div className="mb-8 animate-fade-up">
                <p className="label mb-3" style={{ color: "#4A5560" }}>2 · Elige tu salida</p>
                <div className="space-y-3">
                  {dest.departures.map((s) => {
                    const active = departure?.date === s.date;
                    return (
                      <button key={s.date} type="button" onClick={() => setDeparture(s)} className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-4 text-left transition active:scale-[0.99]" style={{ borderColor: active ? C.ocean : "#E6E0D4", boxShadow: active ? "0 10px 24px rgba(0,119,182,0.2)" : "none" }}>
                        <span className="inline-flex items-center gap-2 font-bold" style={{ fontFamily: display }}><Ticket size={18} style={{ color: C.terra }} /> {s.date}</span>
                        <span className="inline-flex items-center gap-1 text-sm" style={{ color: "#4A5560" }}><Clock size={14} /> {s.dur}</span>
                        <span className="inline-flex items-center gap-1 text-sm" style={{ color: "#4A5560" }}><MapPin size={14} /> {s.point}</span>
                        <span className="inline-flex items-center gap-1 text-sm" style={{ color: "#4A5560" }}><Users size={14} /> {s.seats} lugares</span>
                        <span className="font-bold" style={{ color: C.ocean }}>{money(s.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* 3. Formulario */}
            <p className="label mb-3" style={{ color: "#4A5560" }}>3 · Datos del viajero</p>
            <div className="grid gap-4 rounded-3xl border bg-white p-5 sm:grid-cols-2" style={{ borderColor: "#E6E0D4" }}>
              <Field label="Nombre completo" full>
                <input className="field" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" />
              </Field>
              <Field label="Teléfono / WhatsApp">
                <input className="field" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="55 1234 5678" />
              </Field>
              <Field label="Correo electrónico">
                <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="opcional@correo.com" />
              </Field>
              <Field label="Número de lugares">
                <input className="field" type="number" min={1} max={20} value={seats} onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))} />
              </Field>
              <Field label="Punto de abordaje">
                <select className="field" value={form.abordaje} onChange={(e) => setForm({ ...form, abordaje: e.target.value })}>
                  <option value="">Selecciona</option>
                  {ABORDAJE.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>
              <Field label="¿Viajas con menores?">
                <select className="field" value={form.menores} onChange={(e) => setForm({ ...form, menores: e.target.value })}>
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </Field>
              <Field label="Método de pago preferido">
                <select className="field" value={form.pago} onChange={(e) => setForm({ ...form, pago: e.target.value })}>
                  <option value="">Selecciona</option>
                  {PAGOS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Comentarios adicionales" full>
                <textarea className="field min-h-20 py-3" value={form.comentarios} onChange={(e) => setForm({ ...form, comentarios: e.target.value })} placeholder="¿Algo que debamos saber?" />
              </Field>
            </div>
            {error ? <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          </div>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm" style={{ borderColor: "#E6E0D4" }}>
              <div className="px-5 py-4 text-white" style={{ backgroundColor: C.night }}>
                <p className="inline-flex items-center gap-2 font-bold" style={{ fontFamily: display }}><Ticket size={18} style={{ color: C.sun }} /> Resumen de viaje</p>
              </div>
              <div className="space-y-1 p-5 text-sm">
                <Row k="Destino" v={dest?.n ?? "—"} />
                <Row k="Fecha" v={departure?.date ?? "—"} />
                <Row k="Duración" v={departure?.dur ?? dest?.dur ?? "—"} />
                <Row k="Lugares" v={String(seats)} />
                <Row k="Abordaje" v={form.abordaje || "—"} />
                <Row k="Precio desde" v={dest ? money(dest.price) : "—"} />
                <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: "#E6E0D4" }}>
                  <span className="font-semibold">Total aprox.</span>
                  <span className="text-xl font-bold" style={{ color: C.ocean, fontFamily: display }}>{money(total)}</span>
                </div>
                <p className="pt-1 text-xs" style={{ color: "#8A8A8A" }}>Precios “desde” y aproximados; se confirman al reservar.</p>
                <button onClick={submit} className="mt-4 w-full rounded-full px-5 py-3.5 font-semibold text-[#102A43] transition hover:brightness-105" style={{ backgroundColor: C.sun }}>
                  Solicitar reserva
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <label className="label">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span style={{ color: "#8A8A8A" }}>{k}</span>
      <span className="text-right font-medium" style={{ color: "#102A43" }}>{v}</span>
    </div>
  );
}
