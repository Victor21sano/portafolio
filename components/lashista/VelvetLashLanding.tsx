"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, ChevronRight, Sparkles, Instagram, MessageCircle, MapPin, Eye, Check } from "lucide-react";
import { LASH_IMAGES } from "@/lib/visual-assets";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Paleta beauty premium
const C = {
  ivory: "#FAF6EF",
  taupe: "#C8B8AA",
  espresso: "#3A2A24",
  nude: "#E7D2C4",
  champagne: "#D8B76A",
  dust: "#EAD8D5",
  white: "#FFFDFC"
};
const serif = "var(--font-fraunces)";

const EFFECTS = [
  { n: "Natural", d: "Realza tus pestañas sin que se note artificial.", ideal: "Uso diario y miradas discretas.", lvl: 1 },
  { n: "Cat Eye", d: "Alarga la mirada hacia el exterior para un efecto estilizado.", ideal: "Mirada almendrada o levantada.", lvl: 2 },
  { n: "Doll Eye", d: "Abre la mirada con curvatura al centro, efecto de ojos grandes.", ideal: "Ojos redondos o juntos.", lvl: 2 },
  { n: "Wispy", d: "Mezcla de largos para un acabado plumoso y romántico.", ideal: "Look texturizado y natural.", lvl: 2 },
  { n: "Híbrido", d: "Combina clásicas y volumen: textura con definición.", ideal: "Mirada más marcada sin exagerar.", lvl: 3 },
  { n: "Volumen suave", d: "Más densidad con abanicos ligeros, glam equilibrado.", ideal: "Eventos o mirada intensa.", lvl: 3 }
];

const GOALS = [
  { t: "Quiero algo natural", desc: "Realza lo que ya tienes.", items: ["Lifting de pestañas", "Extensión clásica", "Retoque natural"], h: "lg:mt-0" },
  { t: "Quiero más volumen", desc: "Más densidad e intensidad.", items: ["Volumen suave", "Híbridas", "Volumen tecnológico"], h: "lg:mt-8" },
  { t: "Quiero mantenimiento", desc: "Cuida y conserva tu diseño.", items: ["Relleno", "Retiro seguro", "Limpieza de pestañas"], h: "lg:mt-16" }
];

const BEFORE = [
  "Ven sin maquillaje en los ojos.",
  "Evita rímel antes de la cita.",
  "Considera de 1 a 2 horas según el servicio.",
  "Si tienes alergias o sensibilidad, coméntalo antes.",
  "Para mejores resultados, evita mojar las pestañas las primeras horas."
];

const RESULTS = ["Peso equilibrado", "Acabado limpio", "Retención cuidada", "Aplicación precisa", "Diseño según tus ojos", "Look personalizado"];

const COMPARE = [
  { e: "Lifting", r: "Natural y levantado", t: "45-60 min", i: "Pestaña natural" },
  { e: "Clásicas", r: "Definición suave", t: "90 min", i: "Look diario" },
  { e: "Híbridas", r: "Textura y volumen", t: "90-120 min", i: "Mirada más marcada" },
  { e: "Volumen", r: "Mayor intensidad", t: "120 min", i: "Eventos o look glam" }
];

const GALLERY = [
  { src: LASH_IMAGES.gallery[0], cat: "Natural" },
  { src: LASH_IMAGES.gallery[1], cat: "Cat Eye" },
  { src: LASH_IMAGES.gallery[2], cat: "Híbridas" },
  { src: LASH_IMAGES.gallery[3], cat: "Wispy" },
  { src: LASH_IMAGES.gallery[4], cat: "Volumen suave" },
  { src: LASH_IMAGES.gallery[5], cat: "Lifting" }
];

const TESTIMONIALS = [
  { t: "Se ven naturales, pero mi mirada cambió muchísimo.", a: "Andrea M." },
  { t: "No me pesaron nada y me explicó perfecto los cuidados.", a: "Regina L." },
  { t: "Me encantó porque no se ven exageradas, justo lo que quería.", a: "Mariana S." }
];

function Intensity({ lvl }: { lvl: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <span key={i} className="h-1.5 w-5 rounded-full" style={{ backgroundColor: i <= lvl ? C.champagne : C.nude }} />
      ))}
      <span className="ml-1 text-xs" style={{ color: C.taupe }}>{lvl === 1 ? "Suave" : lvl === 2 ? "Medio" : "Marcado"}</span>
    </span>
  );
}

export function VelvetLashLanding({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const agendar = `/${slug}/agendar`;

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const eo = "power3.out";
      gsap.from(".vl-hero-line", { y: 36, opacity: 0, duration: 1, ease: eo, stagger: 0.13, delay: 0.1 });
      gsap.from(".vl-oval", { scale: 0.86, opacity: 0, duration: 1.2, ease: eo, delay: 0.2 });
      gsap.to(".vl-oval-img", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".vl-hero", start: "top top", end: "bottom top", scrub: true } });
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
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.ivory, color: C.espresso, fontFamily: "var(--font-inter)" }}>
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 backdrop-blur-md" style={{ backgroundColor: "rgba(250,246,239,0.8)" }}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="text-lg tracking-[0.12em]" style={{ fontFamily: serif, color: C.espresso }}>
            VELVET <span style={{ color: C.champagne }}>LASH</span>
          </a>
          <div className="hidden items-center gap-8 text-sm md:flex" style={{ color: C.espresso }}>
            <a href="#efectos" className="transition hover:opacity-60">Efectos</a>
            <a href="#servicios" className="transition hover:opacity-60">Servicios</a>
            <a href="#galeria" className="transition hover:opacity-60">Galería</a>
            <Link href={agendar} className="rounded-full px-5 py-2 font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.espresso }}>
              Agendar cita
            </Link>
          </div>
          <button className="md:hidden" style={{ color: C.espresso }} onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {menuOpen ? (
          <div className="flex flex-col gap-4 border-t border-black/5 px-5 py-4 md:hidden" style={{ backgroundColor: C.ivory }}>
            <a href="#efectos" onClick={() => setMenuOpen(false)}>Efectos</a>
            <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
            <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
            <Link href={agendar} className="rounded-full px-5 py-2.5 text-center font-semibold text-white" style={{ backgroundColor: C.espresso }}>Agendar cita</Link>
          </div>
        ) : null}
      </header>

      {/* HERO MIRADA PROTAGONISTA */}
      <section id="top" className="vl-hero relative overflow-hidden px-5 pb-24 pt-32">
        <div className="pointer-events-none absolute right-1/3 top-40 h-64 w-64 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: C.dust }} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="vl-hero-line mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: C.taupe }}>
              <Eye size={14} /> Velvet Lash Studio
            </p>
            <h1 className="vl-hero-line text-5xl leading-[1.05] sm:text-7xl" style={{ fontFamily: serif, color: C.espresso }}>
              Realza tu mirada sin perder <span className="italic" style={{ color: C.champagne }}>naturalidad</span>
            </h1>
            <p className="vl-hero-line mt-6 max-w-md text-lg leading-8" style={{ color: C.espresso }}>
              Extensiones, lifting y diseño de pestañas personalizados para destacar tu belleza con un acabado limpio, cómodo y elegante.
            </p>
            <div className="vl-hero-line mt-9 flex flex-wrap gap-4">
              <Link href={agendar} className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition hover:brightness-110 hover:shadow-lg" style={{ backgroundColor: C.espresso }}>
                Agendar cita <ChevronRight size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <a href="#efectos" className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition hover:bg-white" style={{ borderColor: C.taupe, color: C.espresso }}>
                Conocer estilos
              </a>
            </div>
          </div>

          {/* Imagen ovalada + badge */}
          <div className="vl-oval relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden border-8 border-white shadow-2xl" style={{ borderRadius: "50% 50% 48% 48% / 46% 46% 54% 54%" }}>
              <Image src={LASH_IMAGES.hero} alt="Aplicación profesional de extensiones de pestañas" fill priority unoptimized className="vl-oval-img object-cover" />
            </div>
            <div className="animate-float absolute -left-4 bottom-10 max-w-[180px] rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <Sparkles size={16} style={{ color: C.champagne }} />
              <p className="mt-1 text-sm font-semibold" style={{ color: C.espresso }}>Diseño personalizado según tu mirada</p>
            </div>
          </div>
        </div>
      </section>

      {/* EFECTOS */}
      <section id="efectos" className="px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="animate-fade-up text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.espresso }}>Encuentra tu efecto ideal</h2>
            <p className="animate-fade-up mt-3" style={{ color: C.taupe }}>Cada mirada tiene su estilo. Descubre el tuyo.</p>
          </div>
          <div className="stagger-fade space-y-3">
            {EFFECTS.map((e) => (
              <div
                key={e.n}
                className="group flex flex-col gap-3 rounded-[28px] border bg-white/70 p-6 transition duration-300 hover:bg-white hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
                style={{ borderColor: C.nude }}
              >
                <div className="sm:w-1/4">
                  <h3 className="text-2xl" style={{ fontFamily: serif, color: C.espresso }}>{e.n}</h3>
                  <span className="mt-1 block h-px w-10 transition-all duration-300 group-hover:w-20" style={{ backgroundColor: C.champagne }} />
                </div>
                <p className="text-sm leading-6 sm:w-2/5" style={{ color: C.espresso }}>{e.d}</p>
                <p className="text-sm sm:w-1/5" style={{ color: C.taupe }}><span className="font-semibold">Ideal:</span> {e.ideal}</p>
                <div className="sm:w-auto"><Intensity lvl={e.lvl} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS POR OBJETIVO */}
      <section id="servicios" className="px-5 py-20" style={{ background: `linear-gradient(180deg, ${C.ivory}, ${C.dust}55)` }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-12 text-center text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.espresso }}>Servicios por objetivo</h2>
          <div className="stagger-fade grid gap-6 md:grid-cols-3">
            {GOALS.map((g) => (
              <div key={g.t} className={`flex flex-col rounded-[32px] border border-white/60 bg-white/60 p-7 shadow-sm backdrop-blur transition duration-300 hover:shadow-xl ${g.h}`}>
                <h3 className="text-xl" style={{ fontFamily: serif, color: C.espresso }}>{g.t}</h3>
                <p className="mt-1 text-sm" style={{ color: C.taupe }}>{g.desc}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm" style={{ color: C.espresso }}>
                  {g.items.map((it) => (
                    <li key={it} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: C.champagne }} /> {it}
                    </li>
                  ))}
                </ul>
                <Link href={agendar} className="mt-6 inline-flex items-center justify-center gap-1 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:text-white" style={{ borderColor: C.espresso, color: C.espresso }}>
                  Elegir este estilo
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANTES DE TU CITA (timeline) */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="animate-fade-up mb-10 text-center text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.espresso }}>Antes de tu cita</h2>
          <div className="stagger relative ml-3 space-y-7 border-l" style={{ borderColor: C.nude }}>
            {BEFORE.map((b, i) => (
              <div key={i} className="relative pl-8">
                <span className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white" style={{ backgroundColor: C.champagne }} />
                <p className="text-base leading-7" style={{ color: C.espresso }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTADOS LIGEROS */}
      <section className="px-5 py-24" style={{ background: `linear-gradient(135deg, ${C.nude}, ${C.dust})` }}>
        <div className="mx-auto max-w-5xl text-center">
          <p className="animate-fade-up mx-auto max-w-2xl text-3xl leading-tight sm:text-4xl" style={{ fontFamily: serif, color: C.espresso }}>
            Pestañas diseñadas para verse bonitas, sentirse cómodas y adaptarse a tu rutina.
          </p>
          <div className="stagger mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {RESULTS.map((r) => (
              <div key={r} className="rounded-2xl bg-white/60 px-4 py-5 text-lg backdrop-blur" style={{ fontFamily: serif, color: C.espresso }}>{r}</div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="animate-fade-up mb-10 text-center text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.espresso }}>Compara estilos</h2>
          {/* Desktop: tabla */}
          <div className="hidden overflow-hidden rounded-3xl border md:block" style={{ borderColor: C.nude }}>
            <div className="grid grid-cols-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: C.espresso }}>
              <span>Estilo</span><span>Resultado</span><span>Duración</span><span>Ideal para</span>
            </div>
            <div className="stagger-fade">
              {COMPARE.map((c) => (
                <div key={c.e} className="grid grid-cols-4 items-center px-6 py-4 text-sm transition hover:bg-[#FAF6EF]" style={{ borderTop: `1px solid ${C.nude}`, color: C.espresso }}>
                  <span className="font-semibold" style={{ fontFamily: serif }}>{c.e}</span>
                  <span>{c.r}</span>
                  <span style={{ color: C.champagne }}>{c.t}</span>
                  <span style={{ color: C.taupe }}>{c.i}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Móvil: cards */}
          <div className="stagger -mx-5 flex gap-4 overflow-x-auto px-5 md:hidden">
            {COMPARE.map((c) => (
              <div key={c.e} className="w-60 shrink-0 rounded-3xl border bg-white p-5" style={{ borderColor: C.nude }}>
                <h3 className="text-xl" style={{ fontFamily: serif, color: C.espresso }}>{c.e}</h3>
                <p className="mt-2 text-sm" style={{ color: C.espresso }}>{c.r}</p>
                <p className="mt-1 text-sm" style={{ color: C.champagne }}>{c.t}</p>
                <p className="mt-1 text-sm" style={{ color: C.taupe }}>{c.i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA CLOSE-UP (cinta) */}
      <section id="galeria" className="overflow-hidden py-16" style={{ backgroundColor: C.white }}>
        <h2 className="animate-fade-up mb-10 px-5 text-center text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.espresso }}>Close-up</h2>
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 gap-5 pr-5">
            {[...GALLERY, ...GALLERY].map((g, i) => (
              <figure key={i} className="group relative h-56 w-80 shrink-0 overflow-hidden border-4 border-white shadow-md" style={{ borderRadius: "44% 44% 44% 44% / 50% 50% 50% 50%" }}>
                <Image src={g.src} alt={`Resultado de pestañas ${g.cat}`} fill unoptimized className="object-cover transition duration-700 group-hover:scale-105" />
                <figcaption className="absolute bottom-3 left-0 right-0 text-center text-sm font-semibold text-white drop-shadow">{g.cat}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="px-5 py-20" style={{ backgroundColor: C.ivory }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-10 text-center text-4xl sm:text-5xl" style={{ fontFamily: serif, color: C.espresso }}>Lo que notaron</h2>
          <div className="stagger -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4">
            {TESTIMONIALS.map((t) => (
              <figure key={t.a} className="w-[300px] shrink-0 snap-center rounded-[36px] border bg-white p-7 shadow-sm sm:w-[380px]" style={{ borderColor: C.nude }}>
                <span className="text-5xl leading-none" style={{ fontFamily: serif, color: C.champagne }}>&ldquo;</span>
                <blockquote className="-mt-3 text-lg leading-7" style={{ color: C.espresso, fontFamily: serif }}>{t.t}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold" style={{ color: C.taupe }}>— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CONSULTA DE ESTILO */}
      <section className="grid items-stretch md:grid-cols-2">
        <div className="relative min-h-[280px] overflow-hidden">
          <Image src={LASH_IMAGES.cta} alt="Detalle de mirada con pestañas" fill unoptimized className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12" style={{ backgroundColor: C.espresso, color: C.white }}>
          <span className="animate-fade-up mb-4 block h-px w-16" style={{ backgroundColor: C.champagne }} />
          <h2 className="animate-fade-up text-4xl leading-tight sm:text-5xl" style={{ fontFamily: serif }}>Diseñemos la mirada que va contigo</h2>
          <p className="animate-fade-up mt-5 max-w-md text-lg" style={{ color: C.taupe }}>
            Agenda tu cita y elige el efecto ideal según tu estilo, tus ojos y tu rutina.
          </p>
          <Link href={agendar} className="animate-fade-up mt-8 inline-flex w-fit items-center gap-2 rounded-full px-8 py-3.5 font-semibold transition hover:brightness-110" style={{ backgroundColor: C.champagne, color: C.espresso }}>
            Reservar mi cita <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 py-12" style={{ backgroundColor: C.espresso, color: C.ivory }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 text-center">
          <p className="text-2xl tracking-[0.12em]" style={{ fontFamily: serif }}>VELVET LASH STUDIO</p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm" style={{ color: C.taupe }}>
            <span className="inline-flex items-center gap-1.5"><Instagram size={15} style={{ color: C.champagne }} /> @velvetlashstudio</span>
            <span className="inline-flex items-center gap-1.5"><MessageCircle size={15} style={{ color: C.champagne }} /> 55 2345 6789</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={15} style={{ color: C.champagne }} /> Condesa, CDMX</span>
          </div>
          <p className="text-sm" style={{ color: C.taupe }}>Mar – Sáb · 10:00 – 19:00 · Solo con cita</p>
          <Link href={agendar} className="inline-flex items-center gap-1 font-semibold" style={{ color: C.champagne }}>
            <Check size={15} /> Agendar cita
          </Link>
          <p className="text-xs" style={{ color: C.taupe }}>© {new Date().getFullYear()} Velvet Lash Studio</p>
        </div>
      </footer>
    </div>
  );
}
