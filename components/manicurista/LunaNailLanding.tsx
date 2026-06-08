"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, Sparkles, ChevronRight, Check, Instagram, MessageCircle, MapPin, Quote } from "lucide-react";
import { NAIL_IMAGES } from "@/lib/visual-assets";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Paleta boutique
const C = {
  rose: "#E8B7C8",
  cream: "#FFF7F2",
  wine: "#7A3045",
  mauve: "#B76E79",
  warm: "#6F5E62",
  gold: "#D6B56D"
};
const serif = "var(--font-playfair)";

const STEPS = [
  { n: "01", t: "Elige tu estilo", d: "Selecciona entre manicura clásica, gelish, acrílico, diseño artístico o algo completamente personalizado." },
  { n: "02", t: "Diseñamos contigo", d: "Definimos colores, forma, largo, detalles y referencias para crear un resultado único." },
  { n: "03", t: "Disfruta el acabado", d: "Recibe una manicura cuidada, limpia y duradera en un espacio cómodo y bonito." }
];

const SERVICES = [
  { name: "Manicura clásica", desc: "Limado, cutícula y esmalte tradicional con acabado prolijo.", meta: "40 min · Desde $180" },
  { name: "Gelish", desc: "Color semipermanente con brillo duradero y acabado limpio.", meta: "45 min · Desde $250" },
  { name: "Acrílico escultural", desc: "Extensión y forma personalizada con máxima resistencia.", meta: "90 min · Desde $450" },
  { name: "Baño de acrílico", desc: "Refuerzo sobre uña natural para mayor durabilidad.", meta: "60 min · Desde $350" },
  { name: "Nail art personalizado", desc: "Diseños a mano, pedrería y detalles a tu medida.", meta: "60 min · Desde $320" },
  { name: "Retiro seguro", desc: "Remoción cuidando la uña natural, sin dañarla.", meta: "25 min · Desde $90" }
];

const PORTFOLIO = [
  { src: NAIL_IMAGES.portfolio[0], cat: "Minimal", tall: true },
  { src: NAIL_IMAGES.portfolio[1], cat: "French", tall: false },
  { src: NAIL_IMAGES.portfolio[2], cat: "Color", tall: false },
  { src: NAIL_IMAGES.portfolio[3], cat: "Glam", tall: true },
  { src: NAIL_IMAGES.portfolio[4], cat: "Nail Art", tall: false },
  { src: NAIL_IMAGES.portfolio[5], cat: "Temporada", tall: false }
];

const MOOD = ["Clean girl nails", "French moderno", "Coquette nails", "Chrome nails", "Aura nails", "Nude elegante", "Glitter soft", "Diseño minimalista", "Pedrería sutil"];

const DETAILS = ["Herramientas sanitizadas", "Productos profesionales", "Atención por cita", "Diseños personalizados", "Acabado duradero", "Cuidado de la uña natural"];

const TESTIMONIALS = [
  { t: "Me encantó el diseño, quedó justo como lo imaginé y súper limpio.", a: "Sofía M." },
  { t: "El gelish me duró muchísimo y la atención fue muy bonita.", a: "Valeria R." },
  { t: "Me ayudó a elegir colores y el resultado se veía súper elegante.", a: "Camila G." }
];

export function LunaNailLanding({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const agendar = `/${slug}/agendar`;

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const eo = "power3.out";
      gsap.from(".ln-hero-line", { y: 40, opacity: 0, duration: 1, ease: eo, stagger: 0.14, delay: 0.1 });
      gsap.from(".ln-collage > *", { y: 50, opacity: 0, scale: 0.95, duration: 1, ease: eo, stagger: 0.15, delay: 0.3 });
      gsap.to(".ln-collage-a", { y: -24, ease: "none", scrollTrigger: { trigger: ".ln-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".ln-collage-b", { y: 24, ease: "none", scrollTrigger: { trigger: ".ln-hero", start: "top top", end: "bottom top", scrub: true } });
    }, root);

    // Las imágenes externas cargan async y mueven el layout: recalcular
    // posiciones para que ningún reveal quede atascado en opacity:0.
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
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.cream, color: C.warm, fontFamily: "var(--font-inter)" }}>
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 backdrop-blur-md" style={{ backgroundColor: "rgba(255,247,242,0.8)" }}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="text-xl tracking-tight" style={{ fontFamily: serif, color: C.wine }}>
            Luna <span style={{ color: C.mauve }}>Nail Studio</span>
          </a>
          <div className="hidden items-center gap-8 text-sm md:flex" style={{ color: C.warm }}>
            <a href="#experiencia" className="transition hover:opacity-70">Experiencia</a>
            <a href="#servicios" className="transition hover:opacity-70">Servicios</a>
            <a href="#portafolio" className="transition hover:opacity-70">Portafolio</a>
            <Link href={agendar} className="rounded-full px-5 py-2 font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.wine }}>
              Agendar cita
            </Link>
          </div>
          <button className="md:hidden" style={{ color: C.wine }} onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {menuOpen ? (
          <div className="flex flex-col gap-4 border-t border-black/5 px-5 py-4 md:hidden" style={{ backgroundColor: C.cream, color: C.warm }}>
            <a href="#experiencia" onClick={() => setMenuOpen(false)}>Experiencia</a>
            <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
            <a href="#portafolio" onClick={() => setMenuOpen(false)}>Portafolio</a>
            <Link href={agendar} className="rounded-full px-5 py-2.5 text-center font-semibold text-white" style={{ backgroundColor: C.wine }}>Agendar cita</Link>
          </div>
        ) : null}
      </header>

      {/* HERO EDITORIAL DIVIDIDO */}
      <section id="top" className="ln-hero relative overflow-hidden px-5 pb-20 pt-32">
        {/* decorativos */}
        <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: C.rose }} />
        <div className="pointer-events-none absolute right-10 top-10 h-40 w-40 rounded-full opacity-30 blur-2xl" style={{ backgroundColor: C.gold }} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="ln-hero-line mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]" style={{ borderColor: C.mauve, color: C.mauve }}>
              <Sparkles size={13} /> Estudio boutique de uñas
            </p>
            <h1 className="ln-hero-line text-5xl leading-[1.05] sm:text-7xl" style={{ fontFamily: serif, color: C.wine }}>
              Uñas que cuentan tu <span className="italic" style={{ color: C.mauve }}>estilo</span>
            </h1>
            <p className="ln-hero-line mt-6 max-w-md text-lg leading-8">
              Manicura profesional, diseños personalizados y acabados impecables para que tus manos luzcan como parte de tu identidad.
            </p>
            <div className="ln-hero-line mt-9 flex flex-wrap gap-4">
              <Link href={agendar} className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition hover:brightness-110 hover:shadow-lg" style={{ backgroundColor: C.wine }}>
                Agendar cita <ChevronRight size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <a href="#portafolio" className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition hover:bg-white" style={{ borderColor: C.mauve, color: C.wine }}>
                Ver diseños
              </a>
            </div>
          </div>

          {/* Collage */}
          <div className="ln-collage relative mx-auto grid h-[460px] w-full max-w-md grid-cols-2 gap-4">
            <div className="ln-collage-a relative row-span-2 overflow-hidden rounded-[28px] border-4 border-white shadow-xl">
              <Image src={NAIL_IMAGES.hero[0]} alt="Manicura profesional en estudio de uñas" fill unoptimized className="object-cover" />
            </div>
            <div className="relative overflow-hidden rounded-[28px] border-4 border-white shadow-xl">
              <Image src={NAIL_IMAGES.hero[1]} alt="Diseño de nail art en proceso" fill unoptimized className="object-cover" />
            </div>
            <div className="ln-collage-b relative overflow-hidden rounded-[28px] border-4 border-white shadow-xl">
              <Image src={NAIL_IMAGES.hero[2]} alt="Acabado de gelish en uñas" fill unoptimized className="object-cover" />
            </div>
            {/* Badge flotante */}
            <div className="animate-float absolute -left-6 bottom-6 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-sm font-bold" style={{ color: C.wine }}>+1,200 clientas</p>
              <p className="text-xs" style={{ color: C.mauve }}>★ 4.9 · diseños únicos</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section id="experiencia" className="ln-steps px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="animate-fade-up text-center text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.wine }}>Tu próxima experiencia</h2>
          <div className="stagger-fade mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="ln-step rounded-[28px] border border-black/5 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="text-6xl" style={{ fontFamily: serif, color: C.rose }}>{s.n}</span>
                <h3 className="mt-3 text-xl font-semibold" style={{ color: C.wine }}>{s.t}</h3>
                <p className="mt-2 text-sm leading-6">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS MENÚ BOUTIQUE */}
      <section id="servicios" className="ln-services px-5 py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-5xl">
          <div className="animate-fade-up mb-10 text-center">
            <span className="mx-auto mb-3 block h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
            <h2 className="text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.wine }}>Servicios</h2>
          </div>
          <div className="stagger grid gap-x-12 gap-y-1 md:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.name} className="group flex items-start justify-between gap-4 rounded-xl border-b border-black/5 px-3 py-4 transition hover:bg-[#FFF7F2]">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: C.wine }}>{s.name}</h3>
                  <p className="mt-1 text-sm leading-6" style={{ color: C.warm }}>{s.desc}</p>
                </div>
                <span className="shrink-0 whitespace-nowrap pt-1 text-right text-sm font-semibold" style={{ color: C.mauve }}>{s.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTAFOLIO MASONRY */}
      <section id="portafolio" className="ln-portfolio px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="animate-fade-up mx-auto mb-10 max-w-xl text-center text-2xl sm:text-3xl" style={{ fontFamily: serif, color: C.wine }}>
            Diseños hechos para destacar sin perder elegancia.
          </p>
          <div className="stagger-fade grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3">
            {PORTFOLIO.map((p) => (
              <div key={p.cat} className={`ln-port group relative overflow-hidden rounded-3xl border-4 border-white shadow-md ${p.tall ? "row-span-2" : ""}`}>
                <Image src={p.src} alt={`Diseño de uñas ${p.cat}`} fill unoptimized className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/45 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <span className="text-sm font-semibold text-white">{p.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOODBOARD */}
      <section className="overflow-hidden py-16" style={{ background: `linear-gradient(120deg, ${C.cream}, ${C.rose}33)` }}>
        <h2 className="animate-fade-up mb-8 px-5 text-center text-3xl" style={{ fontFamily: serif, color: C.wine }}>Moodboard de estilos</h2>
        <div className="relative flex select-none overflow-hidden">
          <div className="animate-marquee flex shrink-0 gap-3 pr-3">
            {[...MOOD, ...MOOD].map((m, i) => (
              <span key={i} className="whitespace-nowrap rounded-full border bg-white/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:scale-105" style={{ borderColor: C.rose, color: C.wine }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DETALLES DEL ESTUDIO (split) */}
      <section className="px-5 py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <h2 className="text-4xl leading-tight sm:text-5xl" style={{ fontFamily: serif, color: C.wine }}>
              Cada cita está pensada para cuidar tus manos, tu estilo y tu tiempo.
            </h2>
          </div>
          <div className="animate-fade-up grid gap-3 sm:grid-cols-2">
            {DETAILS.map((d) => (
              <div key={d} className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: C.cream }}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: C.mauve }}>
                  <Check size={15} />
                </span>
                <span className="text-sm font-medium" style={{ color: C.wine }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-10 text-center text-4xl" style={{ fontFamily: serif, color: C.wine }}>Lo que dicen mis clientas</h2>
          <div className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4">
            {TESTIMONIALS.map((t) => (
              <figure key={t.a} className="animate-fade-up w-[300px] shrink-0 snap-center rounded-[28px] border border-black/5 bg-white p-7 shadow-sm sm:w-[360px]">
                <Quote size={28} style={{ color: C.rose }} />
                <blockquote className="mt-3 text-lg leading-7" style={{ color: C.wine, fontFamily: serif }}>“{t.t}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold" style={{ color: C.mauve }}>— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA INVITACIÓN */}
      <section className="ln-cta px-5 py-20">
        <div className="animate-scale-in mx-auto max-w-4xl rounded-[40px] border px-6 py-16 text-center shadow-xl" style={{ background: `linear-gradient(135deg, ${C.cream}, ${C.rose}55)`, borderColor: "#ffffff" }}>
          <span className="mx-auto mb-5 block h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
          <h2 className="text-4xl sm:text-6xl" style={{ fontFamily: serif, color: C.wine }}>Tus próximas uñas empiezan aquí</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg">Reserva tu espacio y creemos juntas un diseño que vaya contigo.</p>
          <Link href={agendar} className="mt-9 inline-flex items-center gap-2 rounded-full px-9 py-4 text-lg font-semibold text-white transition hover:brightness-110 hover:shadow-lg" style={{ backgroundColor: C.wine }}>
            Agendar mi cita <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/5 px-5 py-12" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <p className="text-2xl" style={{ fontFamily: serif, color: C.wine }}>Luna Nail Studio</p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm" style={{ color: C.warm }}>
            <span className="inline-flex items-center gap-1.5"><Instagram size={15} style={{ color: C.mauve }} /> @lunanailstudio</span>
            <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} style={{ color: C.mauve }} /> 55 1234 5678</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={15} style={{ color: C.mauve }} /> Polanco, CDMX</span>
          </div>
          <p className="text-sm" style={{ color: C.warm }}>Mar – Sáb · 10:00 – 19:00 · Por cita</p>
          <Link href={agendar} className="font-semibold" style={{ color: C.wine }}>Agendar cita →</Link>
          <p className="text-xs" style={{ color: C.mauve }}>© {new Date().getFullYear()} Luna Nail Studio</p>
        </div>
      </footer>
    </div>
  );
}
