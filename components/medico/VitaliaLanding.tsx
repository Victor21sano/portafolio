"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Menu, X, ChevronRight, ChevronDown, Search, Plus, Stethoscope, Baby, Flower2, ScanFace, HeartPulse,
  Bone, Salad, Brain, Clock, MapPin, ShieldCheck, CalendarCheck, Activity, Phone, Mail, MessageCircle
} from "lucide-react";
import { MEDICAL_IMAGES } from "@/lib/visual-assets";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Paleta clínica
const C = {
  petrol: "#0F4C5C",
  green: "#2A9D8F",
  white: "#FFFFFF",
  mist: "#F4F7F8",
  text: "#4A5560",
  deep: "#12343B",
  aqua: "#DFF5F2",
  sand: "#F6EFE8"
};
const sans = "var(--font-sora)";

const SPECIALTIES = [
  { icon: Stethoscope, n: "Medicina general", d: "Atención primaria, chequeos y diagnóstico inicial." },
  { icon: Baby, n: "Pediatría", d: "Atención médica para niñas, niños y adolescentes." },
  { icon: Flower2, n: "Ginecología", d: "Salud femenina, revisiones y seguimiento especializado." },
  { icon: ScanFace, n: "Dermatología", d: "Diagnóstico y tratamiento de piel, cabello y uñas." },
  { icon: HeartPulse, n: "Cardiología", d: "Evaluación del corazón y control de factores de riesgo." },
  { icon: Bone, n: "Traumatología", d: "Atención de lesiones, dolor articular y movilidad." },
  { icon: Salad, n: "Nutrición", d: "Planes alimenticios personalizados y control metabólico." },
  { icon: Brain, n: "Psicología", d: "Acompañamiento emocional y salud mental." }
];

const PROCESS = [
  { n: 1, t: "Agenda tu cita", d: "Elige especialidad, fecha y horario." },
  { n: 2, t: "Consulta con un especialista", d: "Recibe valoración médica profesional." },
  { n: 3, t: "Diagnóstico y plan de atención", d: "Obtén indicaciones claras y seguimiento." },
  { n: 4, t: "Acompañamiento continuo", d: "Regresa a control o estudios si es necesario." }
];

const DOCTORS = [
  { n: "Dra. Elena Martínez", e: "Pediatría", c: "Céd. Prof. 7841025", src: MEDICAL_IMAGES.doctors[0] },
  { n: "Dr. Luis Herrera", e: "Cardiología", c: "Céd. Prof. 6620914", src: MEDICAL_IMAGES.doctors[1] },
  { n: "Dra. Sofía Campos", e: "Ginecología", c: "Céd. Prof. 8013357", src: MEDICAL_IMAGES.doctors[2] },
  { n: "Dr. Andrés Molina", e: "Traumatología", c: "Céd. Prof. 5598720", src: MEDICAL_IMAGES.doctors[3] }
];

const COMPLEMENTARY = [
  "Laboratorio clínico", "Electrocardiograma", "Curaciones menores",
  "Certificados médicos", "Control de presión y glucosa", "Paquetes preventivos"
];

const PACKAGES = [
  { t: "Chequeo general", d: "Consulta, signos vitales y orientación.", min: "45 min" },
  { t: "Control metabólico", d: "Glucosa, presión y valoración de riesgo.", min: "40 min" },
  { t: "Salud cardiovascular", d: "Evaluación del corazón y factores de riesgo.", min: "60 min" },
  { t: "Control infantil", d: "Seguimiento de crecimiento y desarrollo.", min: "40 min" },
  { t: "Salud femenina", d: "Revisión y orientación especializada.", min: "50 min" }
];

const FAQS = [
  { q: "¿Necesito cita previa?", a: "Recomendamos agendar cita para garantizar tu horario, aunque atendemos según disponibilidad." },
  { q: "¿Atienden urgencias?", a: "Atendemos urgencias menores. Ante una emergencia, acude al servicio de urgencias más cercano." },
  { q: "¿Puedo elegir especialista?", a: "Sí, puedes indicar tu médico de preferencia al agendar tu cita." },
  { q: "¿Aceptan pagos con tarjeta?", a: "Aceptamos efectivo y tarjetas de débito y crédito." },
  { q: "¿Puedo agendar para un familiar?", a: "Claro, solo proporciona los datos del paciente al momento de agendar." },
  { q: "¿Dónde están ubicados?", a: "Estamos en Zona Centro, con fácil acceso y estacionamiento cercano." }
];

const TRUST = [
  { icon: ShieldCheck, t: "+12 especialidades" },
  { icon: Baby, t: "Atención familiar" },
  { icon: CalendarCheck, t: "Citas presenciales" },
  { icon: Activity, t: "Seguimiento personalizado" }
];

const QUICKDATA = [
  { icon: Clock, t: "Horario: Lun – Sáb" },
  { icon: MapPin, t: "Ubicación: Zona Centro" },
  { icon: Activity, t: "Urgencias menores" },
  { icon: CalendarCheck, t: "Atención con cita" }
];

export function VitaliaLanding({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const agendar = `/${slug}/agendar`;

  const filtered = SPECIALTIES.filter((s) => s.n.toLowerCase().includes(q.toLowerCase()));

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".vt-hero-line", { y: 28, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.1 });
      gsap.from(".vt-hero-img", { opacity: 0, scale: 0.96, duration: 1, ease: "power3.out", delay: 0.25 });
      // Línea progresiva del proceso
      gsap.fromTo(".vt-process-line", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", ease: "none", scrollTrigger: { trigger: ".vt-process", start: "top 70%", end: "bottom 70%", scrub: true } });
    }, root);

    ScrollTrigger.refresh();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const imgs = Array.from(root.current.querySelectorAll("img"));
    imgs.forEach((img) => img.addEventListener("load", refresh));
    const t = window.setTimeout(refresh, 1000);
    return () => {
      window.removeEventListener("load", refresh);
      imgs.forEach((img) => img.removeEventListener("load", refresh));
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.white, color: C.text, fontFamily: "var(--font-inter)" }}>
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold" style={{ fontFamily: sans, color: C.petrol }}>
            <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ backgroundColor: C.green }}><Plus size={18} /></span>
            CLÍNICA <span style={{ color: C.green }}>VITALIA</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium md:flex" style={{ color: C.text }}>
            <a href="#top" className="transition hover:text-[#0F4C5C]">Inicio</a>
            <a href="#especialidades" className="transition hover:text-[#0F4C5C]">Especialidades</a>
            <a href="#medicos" className="transition hover:text-[#0F4C5C]">Médicos</a>
            <a href="#instalaciones" className="transition hover:text-[#0F4C5C]">Instalaciones</a>
            <a href="#contacto" className="transition hover:text-[#0F4C5C]">Contacto</a>
            <Link href={agendar} className="rounded-lg px-5 py-2 font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.petrol }}>Agendar cita</Link>
          </div>
          <button className="md:hidden" style={{ color: C.petrol }} onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {menuOpen ? (
          <div className="flex flex-col gap-4 border-t border-black/5 bg-white px-5 py-4 md:hidden">
            <a href="#especialidades" onClick={() => setMenuOpen(false)}>Especialidades</a>
            <a href="#medicos" onClick={() => setMenuOpen(false)}>Médicos</a>
            <a href="#instalaciones" onClick={() => setMenuOpen(false)}>Instalaciones</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
            <Link href={agendar} className="rounded-lg px-5 py-2.5 text-center font-semibold text-white" style={{ backgroundColor: C.petrol }}>Agendar cita</Link>
          </div>
        ) : null}
      </header>

      {/* HERO */}
      <section id="top" className="px-5 pb-0 pt-28" style={{ background: `linear-gradient(180deg, ${C.aqua}55, ${C.white})` }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 pb-12 lg:grid-cols-2">
          <div>
            <h1 className="vt-hero-line text-4xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: sans, color: C.deep }}>
              Atención médica integral para cuidar de ti y tu familia
            </h1>
            <p className="vt-hero-line mt-5 max-w-xl text-lg leading-8">
              Consulta con especialistas en un solo lugar, con atención profesional, diagnósticos oportunos y seguimiento personalizado.
            </p>
            <div className="vt-hero-line mt-7 flex flex-wrap gap-3">
              <Link href={agendar} className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.petrol }}>
                Agendar cita <ChevronRight size={18} />
              </Link>
              <a href="#especialidades" className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition hover:bg-white" style={{ borderColor: C.green, color: C.petrol }}>
                Ver especialidades
              </a>
            </div>
            <div className="vt-hero-line mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRUST.map((it) => (
                <div key={it.t} className="flex items-center gap-2 text-sm font-medium" style={{ color: C.petrol }}>
                  <it.icon size={18} style={{ color: C.green }} /> {it.t}
                </div>
              ))}
            </div>
          </div>
          <div className="vt-hero-img relative aspect-[5/4] overflow-hidden rounded-3xl border border-black/5 shadow-xl">
            <Image src={MEDICAL_IMAGES.hero} alt="Atención médica en Clínica Vitalia" fill priority unoptimized className="object-cover" />
          </div>
        </div>
        {/* Barra de datos rápidos */}
        <div className="mx-auto max-w-7xl">
          <div className="stagger grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/5 sm:grid-cols-4" style={{ backgroundColor: C.mist }}>
            {QUICKDATA.map((d) => (
              <div key={d.t} className="flex items-center gap-3 bg-white px-5 py-4 text-sm font-medium" style={{ color: C.text }}>
                <d.icon size={18} style={{ color: C.green }} /> {d.t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÚSQUEDA RÁPIDA + ESPECIALIDADES */}
      <section id="especialidades" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="animate-fade-up text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans, color: C.deep }}>Encuentra la atención que necesitas</h2>
            <p className="animate-fade-up mt-2">Busca por especialidad o explora nuestras áreas médicas.</p>
          </div>
          {/* Buscador */}
          <div className="mx-auto mb-8 flex max-w-xl items-center gap-2 rounded-xl border bg-white px-4 py-3 shadow-sm" style={{ borderColor: C.mist }}>
            <Search size={18} style={{ color: C.green }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ej. pediatría, cardiología, nutrición…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          {/* Grid de especialidades (filtrable) */}
          <div className="stagger-fade grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(filtered.length ? filtered : SPECIALTIES).map((s) => (
              <div key={s.n} className="flex flex-col rounded-2xl border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderColor: C.mist }}>
                <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ backgroundColor: C.aqua, color: C.petrol }}><s.icon size={22} /></span>
                <h3 className="mt-4 text-lg font-semibold" style={{ fontFamily: sans, color: C.deep }}>{s.n}</h3>
                <p className="mt-1 flex-1 text-sm leading-6">{s.d}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={agendar} className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.petrol }}>Agendar</Link>
                  <a href="#contacto" className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-[#F4F7F8]" style={{ borderColor: C.mist, color: C.text }}>Ver más</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="vt-process px-5 py-20" style={{ backgroundColor: C.mist }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-12 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans, color: C.deep }}>Cómo funciona tu atención</h2>
          <div className="relative">
            <div className="absolute left-0 right-0 top-7 hidden h-0.5 lg:block" style={{ backgroundColor: "#D7E3E5" }}>
              <div className="vt-process-line h-full" style={{ backgroundColor: C.green }} />
            </div>
            <div className="stagger relative grid gap-8 lg:grid-cols-4">
              {PROCESS.map((p) => (
                <div key={p.n} className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border-4 border-[#F4F7F8] text-lg font-bold text-white" style={{ backgroundColor: C.petrol, fontFamily: sans }}>{p.n}</span>
                  <h3 className="mt-4 text-lg font-semibold" style={{ fontFamily: sans, color: C.deep }}>{p.t}</h3>
                  <p className="mt-1 text-sm leading-6">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MÉDICOS */}
      <section id="medicos" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="animate-fade-up mb-3 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans, color: C.deep }}>Especialistas comprometidos con tu salud</h2>
          <div className="stagger-fade mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DOCTORS.map((d) => (
              <div key={d.n} className="overflow-hidden rounded-2xl border bg-white transition duration-300 hover:shadow-lg" style={{ borderColor: C.mist }}>
                <div className="relative aspect-[4/3]">
                  <Image src={d.src} alt={d.n} fill unoptimized className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold" style={{ fontFamily: sans, color: C.deep }}>{d.n}</h3>
                  <p className="text-sm" style={{ color: C.green }}>{d.e}</p>
                  <p className="mt-1 text-xs" style={{ color: C.text }}>{d.c}</p>
                  <Link href={agendar} className="mt-4 block rounded-lg px-3 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.petrol }}>
                    Agendar con este especialista
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTALACIONES */}
      <section id="instalaciones" className="px-5 py-20" style={{ backgroundColor: C.sand }}>
        <div className="mx-auto max-w-7xl">
          <h2 className="animate-fade-up mb-10 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans, color: C.deep }}>Espacios diseñados para una atención cómoda y segura</h2>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="animate-fade-up relative aspect-[16/10] overflow-hidden rounded-3xl border border-black/5">
              <Image src={MEDICAL_IMAGES.reception} alt="Recepción de Clínica Vitalia" fill unoptimized className="object-cover" />
            </div>
            <div className="stagger grid grid-cols-2 gap-4">
              {[
                { src: MEDICAL_IMAGES.facilities[0], cap: "Consultorios" },
                { src: MEDICAL_IMAGES.facilities[1], cap: "Sala de espera" },
                { src: MEDICAL_IMAGES.facilities[2], cap: "Laboratorio" },
                { src: MEDICAL_IMAGES.facilities[3], cap: "Diagnóstico" }
              ].map((f) => (
                <figure key={f.cap} className="group relative aspect-square overflow-hidden rounded-2xl border border-black/5">
                  <Image src={f.src} alt={f.cap} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
                  <figcaption className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-xs font-medium" style={{ color: C.petrol }}>{f.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS COMPLEMENTARIOS */}
      <section className="px-5 py-20" style={{ backgroundColor: C.mist }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="animate-fade-up mb-8 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans, color: C.deep }}>Servicios complementarios</h2>
          <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLEMENTARY.map((s) => (
              <div key={s} className="flex items-center gap-3 rounded-xl bg-white px-4 py-4 text-sm font-medium shadow-sm" style={{ color: C.deep }}>
                <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ backgroundColor: C.aqua, color: C.petrol }}><Plus size={16} /></span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREVENCIÓN */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <h2 className="animate-fade-up text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans, color: C.deep }}>Prevenir también es cuidar tu salud</h2>
            <p className="animate-fade-up mt-3">Realizar chequeos periódicos ayuda a detectar factores de riesgo y atenderlos a tiempo. Agenda una valoración preventiva y recibe orientación personalizada.</p>
          </div>
          <div className="stagger-fade grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <div key={p.t} className="flex flex-col rounded-2xl border bg-white p-6 transition hover:shadow-lg" style={{ borderColor: C.mist }}>
                <h3 className="text-lg font-semibold" style={{ fontFamily: sans, color: C.deep }}>{p.t}</h3>
                <p className="mt-1 flex-1 text-sm leading-6">{p.d}</p>
                <p className="mt-3 text-sm font-medium" style={{ color: C.green }}>{p.min}</p>
                <Link href={agendar} className="mt-4 rounded-lg border px-4 py-2 text-center text-sm font-semibold transition hover:bg-[#F4F7F8]" style={{ borderColor: C.petrol, color: C.petrol }}>Agendar</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20" style={{ backgroundColor: C.mist }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="animate-fade-up mb-8 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans, color: C.deep }}>Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "#E3EAEC" }}>
                <button
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold"
                  style={{ color: C.deep }}
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                >
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ transform: faqOpen === i ? "rotate(180deg)" : "none", color: C.green }} />
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: faqOpen === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-6" style={{ color: C.text }}>{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 py-20" style={{ background: `linear-gradient(135deg, ${C.petrol}, ${C.deep})` }}>
        <div className="animate-fade-up mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: sans }}>Agenda tu consulta con el especialista adecuado</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg" style={{ color: C.aqua }}>
            Nuestro equipo puede orientarte para elegir la especialidad correcta según tus síntomas o necesidades.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={agendar} className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-semibold transition hover:brightness-105" style={{ backgroundColor: C.white, color: C.petrol }}>
              Agendar cita <ChevronRight size={18} />
            </Link>
            <a href="https://wa.me/52" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10">
              <MessageCircle size={18} /> Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="px-5 py-14" style={{ backgroundColor: C.deep, color: "#CBD9DC" }}>
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold text-white" style={{ fontFamily: sans }}>
              <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ backgroundColor: C.green }}><Plus size={15} /></span> CLÍNICA VITALIA
            </p>
            <p className="mt-3 text-sm">Atención médica integral, profesional y humana.</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Contacto</p>
            <p className="flex items-center gap-2"><MapPin size={15} style={{ color: C.green }} /> Av. Salud 45, Zona Centro</p>
            <p className="mt-2 flex items-center gap-2"><Phone size={15} style={{ color: C.green }} /> 55 3344 5566</p>
            <p className="mt-2 flex items-center gap-2"><MessageCircle size={15} style={{ color: C.green }} /> WhatsApp 55 3344 5566</p>
            <p className="mt-2 flex items-center gap-2"><Mail size={15} style={{ color: C.green }} /> contacto@clinicavitalia.mx</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Horarios</p>
            <p>Lun – Vie · 8:00 – 20:00</p>
            <p className="mt-1">Sábado · 9:00 – 14:00</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Especialidades</p>
            <p>Medicina general · Pediatría · Cardiología · Ginecología · Dermatología</p>
            <Link href={agendar} className="mt-4 inline-block font-semibold" style={{ color: C.green }}>Agendar cita →</Link>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl text-xs" style={{ color: "#7E9499" }}>
          La información de este sitio no sustituye una valoración médica profesional. © {new Date().getFullYear()} Clínica Vitalia.
        </p>
      </footer>
    </div>
  );
}
