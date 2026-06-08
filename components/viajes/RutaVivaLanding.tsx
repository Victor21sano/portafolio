"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Menu, X, ChevronRight, ChevronDown, Search, MapPin, Clock, Users, ArrowRight, Bus, ShieldCheck,
  Compass, MessageCircle, Instagram, Sparkles, Mountain, Star
} from "lucide-react";
import { TRAVEL_IMAGES } from "@/lib/visual-assets";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Paleta viajera
const C = {
  ocean: "#0077B6",
  aqua: "#00B4D8",
  sand: "#F7E7CE",
  terra: "#D96C3B",
  green: "#2D6A4F",
  sun: "#F4B400",
  white: "#FFFDF7",
  night: "#102A43"
};
const display = "var(--font-space)";

const DESTINATIONS = [
  { n: "Ixtapa", t: "Playa", d: "Playa, descanso y atardeceres frente al mar.", dur: "3 días", price: "Desde $2,499", src: TRAVEL_IMAGES.destinations.Ixtapa, wide: true, cats: ["Playa y descanso", "Viajes familiares"] },
  { n: "Ciudad de Guanajuato", t: "Colonial", d: "Callejones, historia, miradores y arquitectura colonial.", dur: "2 días", price: "Desde $899", src: TRAVEL_IMAGES.destinations["Ciudad de Guanajuato"], wide: false, cats: ["Ciudades coloniales", "Escapadas de fin de semana"] },
  { n: "Grutas de Tolantongo", t: "Naturaleza", d: "Aguas termales, río azul, túneles y pozas naturales.", dur: "2 días", price: "Desde $1,299", src: TRAVEL_IMAGES.destinations["Grutas de Tolantongo"], wide: false, cats: ["Aventura natural"] },
  { n: "Peña de Bernal", t: "Pueblo mágico", d: "Pueblo mágico, aventura y vistas increíbles.", dur: "1 día", price: "Desde $999", src: TRAVEL_IMAGES.destinations["Peña de Bernal"], wide: false, cats: ["Pueblos mágicos", "Escapadas de fin de semana"] },
  { n: "Huasteca Potosina", t: "Aventura", d: "Cascadas, ríos turquesa y naturaleza extrema.", dur: "3 días", price: "Desde $3,299", src: TRAVEL_IMAGES.destinations["Huasteca Potosina"], wide: true, cats: ["Aventura natural"] },
  { n: "San Miguel de Allende", t: "Colonial", d: "Arte, arquitectura, gastronomía y encanto colonial.", dur: "2 días", price: "Desde $1,799", src: TRAVEL_IMAGES.destinations["San Miguel de Allende"], wide: false, cats: ["Ciudades coloniales"] }
];

const CATS = ["Playa y descanso", "Pueblos mágicos", "Aventura natural", "Ciudades coloniales", "Viajes familiares", "Escapadas de fin de semana"];

const DEPARTURES = [
  { n: "Ixtapa", date: "15 al 17 de agosto", dur: "3 días", seats: 8, point: "Centro", price: "Desde $2,499" },
  { n: "Ciudad de Guanajuato", date: "30 de agosto", dur: "2 días", seats: 12, point: "Terminal de autobuses", price: "Desde $899" },
  { n: "Grutas de Tolantongo", date: "6 de septiembre", dur: "2 días", seats: 10, point: "Centro", price: "Desde $1,299" },
  { n: "Peña de Bernal", date: "13 de septiembre", dur: "1 día", seats: 15, point: "Plaza principal", price: "Desde $999" },
  { n: "Huasteca Potosina", date: "20 al 22 de septiembre", dur: "3 días", seats: 6, point: "Terminal de autobuses", price: "Desde $3,299" }
];

const ITINERARY = ["Salida nocturna", "Llegada y acceso a pozas", "Recorrido por río y grutas", "Tiempo libre para fotos", "Regreso por la tarde"];

const INCLUDES = ["Transporte redondo", "Coordinador de viaje", "Seguro de viajero", "Accesos según paquete", "Itinerario organizado", "Recomendaciones antes del viaje", "Grupo de WhatsApp", "Tiempo libre para explorar"];

const WHY = [
  { n: "01", t: "Organización", d: "Salidas planeadas con itinerarios claros." },
  { n: "02", t: "Seguridad", d: "Coordinadores durante todo el viaje." },
  { n: "03", t: "Experiencia", d: "Destinos y rutas cuidadosamente seleccionados." },
  { n: "04", t: "Comunidad", d: "Viaja acompañado y haz nuevos amigos." }
];

const GALLERY = [
  { n: "Ixtapa", tag: "Playa", phrase: "Atardeceres frente al mar", src: TRAVEL_IMAGES.destinations.Ixtapa },
  { n: "Guanajuato", tag: "Colonial", phrase: "Callejones llenos de historia", src: TRAVEL_IMAGES.destinations["Ciudad de Guanajuato"] },
  { n: "Tolantongo", tag: "Naturaleza", phrase: "Aguas termales entre montañas", src: TRAVEL_IMAGES.destinations["Grutas de Tolantongo"] },
  { n: "Huasteca", tag: "Aventura", phrase: "Cascadas de color turquesa", src: TRAVEL_IMAGES.destinations["Huasteca Potosina"] },
  { n: "San Miguel", tag: "Colonial", phrase: "Arte y arquitectura", src: TRAVEL_IMAGES.destinations["San Miguel de Allende"] },
  { n: "Taxco", tag: "Pueblo mágico", phrase: "Calles de plata y montaña", src: TRAVEL_IMAGES.destinations.Taxco }
];

const TESTIMONIALS = [
  { t: "El viaje a Tolantongo estuvo súper organizado y el lugar increíble.", a: "Mariana G.", dest: "Tolantongo" },
  { t: "Me gustó que todo estaba claro: horarios, punto de salida y recomendaciones.", a: "Luis R.", dest: "Huasteca" },
  { t: "Guanajuato fue una experiencia hermosa, perfecta para un fin de semana.", a: "Andrea M.", dest: "Guanajuato" }
];

const FAQS = [
  { q: "¿Desde dónde salen los viajes?", a: "Salimos de puntos céntricos y terminales; el punto exacto se confirma al reservar." },
  { q: "¿Qué incluye el precio?", a: "Transporte redondo, coordinador, seguro de viajero e itinerario; los accesos varían según el paquete." },
  { q: "¿Puedo apartar mi lugar?", a: "Sí, apartas tu lugar con un anticipo y liquidas antes de la salida." },
  { q: "¿Viajan menores de edad?", a: "Sí, acompañados de un adulto responsable; indícalo al reservar." },
  { q: "¿Puedo pagar en parcialidades?", a: "Ofrecemos opciones de pago en parcialidades según el viaje." },
  { q: "¿Qué pasa si no puedo asistir?", a: "Aplican políticas de reagendación o reembolso parcial según anticipación." },
  { q: "¿El itinerario puede cambiar?", a: "Puede ajustarse por clima o condiciones del destino, siempre cuidando la experiencia." },
  { q: "¿Qué debo llevar?", a: "Te enviamos recomendaciones específicas por destino antes del viaje." }
];

const CHIPS = ["Ixtapa", "Guanajuato", "Tolantongo", "Huasteca", "San Miguel"];

function Badge({ t }: { t: string }) {
  const bg = t === "Playa" ? C.aqua : t === "Colonial" ? C.terra : t === "Naturaleza" ? C.green : t === "Aventura" ? C.ocean : C.sun;
  return <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: bg }}>{t}</span>;
}

export function RutaVivaLanding({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cat, setCat] = useState(CATS[0]);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const reservar = `/${slug}/reservar`;

  const catDest = DESTINATIONS.filter((d) => d.cats.includes(cat));

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".rv-hero-line", { y: 34, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.15 });
      gsap.to(".rv-hero-bg", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".rv-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.fromTo(".rv-route-line", { scaleY: 0 }, { scaleY: 1, transformOrigin: "top center", ease: "none", scrollTrigger: { trigger: ".rv-route", start: "top 65%", end: "bottom 75%", scrub: true } });
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
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.white, color: C.night, fontFamily: "var(--font-inter)" }}>
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 text-white">
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(16,42,67,0.55)", backdropFilter: "blur(8px)" }} />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight" style={{ fontFamily: display }}>
            <Compass size={20} style={{ color: C.sun }} /> RUTA VIVA <span style={{ color: C.sun }}>MX</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#destinos" className="transition hover:text-[#F4B400]">Destinos</a>
            <a href="#salidas" className="transition hover:text-[#F4B400]">Próximas salidas</a>
            <a href="#galeria" className="transition hover:text-[#F4B400]">Experiencias</a>
            <a href="#opiniones" className="transition hover:text-[#F4B400]">Opiniones</a>
            <Link href={reservar} className="rounded-full px-5 py-2 font-semibold text-[#102A43] transition hover:brightness-105" style={{ backgroundColor: C.sun }}>Reservar viaje</Link>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </nav>
        {menuOpen ? (
          <div className="relative flex flex-col gap-4 border-t border-white/10 px-5 py-4 text-white md:hidden" style={{ backgroundColor: C.night }}>
            <a href="#destinos" onClick={() => setMenuOpen(false)}>Destinos</a>
            <a href="#salidas" onClick={() => setMenuOpen(false)}>Próximas salidas</a>
            <a href="#galeria" onClick={() => setMenuOpen(false)}>Experiencias</a>
            <a href="#opiniones" onClick={() => setMenuOpen(false)}>Opiniones</a>
            <Link href={reservar} className="rounded-full px-5 py-2.5 text-center font-semibold text-[#102A43]" style={{ backgroundColor: C.sun }}>Reservar viaje</Link>
          </div>
        ) : null}
      </header>

      {/* HERO */}
      <section id="top" className="rv-hero relative flex min-h-[92vh] items-center overflow-hidden text-white">
        <div className="rv-hero-bg absolute inset-0 will-change-transform">
          <Image src={TRAVEL_IMAGES.hero} alt="Playa en México" fill priority unoptimized className="object-cover" />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(16,42,67,0.85), rgba(16,42,67,0.45) 60%, rgba(0,119,182,0.3))" }} />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-20">
          <div className="max-w-2xl">
            <p className="rv-hero-line mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
              <Sparkles size={13} style={{ color: C.sun }} /> Viajes grupales por México
            </p>
            <h1 className="rv-hero-line text-5xl font-bold leading-[0.98] sm:text-7xl" style={{ fontFamily: display, letterSpacing: "-0.02em" }}>
              Descubre México, <span style={{ color: C.sun }}>una ruta a la vez</span>
            </h1>
            <p className="rv-hero-line mt-5 max-w-xl text-lg leading-8 text-white/85">
              Viajes grupales a playas, pueblos mágicos, grutas, ciudades coloniales y paisajes inolvidables.
            </p>
            {/* Buscador */}
            <div className="rv-hero-line mt-7 flex max-w-lg items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-lg">
              <Search size={18} style={{ color: C.ocean }} />
              <input className="w-full bg-transparent text-sm text-[#102A43] outline-none" placeholder="Busca Ixtapa, Guanajuato, Tolantongo..." />
              <Link href={reservar} className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: C.ocean }}>Buscar</Link>
            </div>
            <div className="rv-hero-line mt-6 flex flex-wrap gap-4">
              <a href="#destinos" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-[#102A43] transition hover:brightness-105" style={{ backgroundColor: C.sun }}>
                Ver destinos <ChevronRight size={18} />
              </a>
              <Link href={reservar} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10">
                Reservar viaje
              </Link>
            </div>
            {/* Chips */}
            <div className="rv-hero-line mt-7 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <span key={c} className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm backdrop-blur">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DESTINOS POPULARES */}
      <section id="destinos" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="animate-fade-up mb-3 text-4xl font-bold sm:text-5xl" style={{ fontFamily: display, color: C.night }}>Destinos populares</h2>
          <p className="animate-fade-up mb-10 text-lg" style={{ color: "#4A5560" }}>Rutas pensadas para vivir México a tu manera.</p>
          <div className="stagger-fade grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <div key={d.n} className={`group relative overflow-hidden rounded-3xl shadow-md ${d.wide ? "lg:col-span-2" : ""}`} style={{ minHeight: 320 }}>
                <Image src={d.src} alt={d.n} fill unoptimized className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(16,42,67,0.1) 30%, rgba(16,42,67,0.9))" }} />
                <div className="absolute left-4 top-4"><Badge t={d.t} /></div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-2xl font-bold" style={{ fontFamily: display }}>{d.n}</h3>
                  <p className="mt-1 text-sm text-white/85">{d.d}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-3 text-sm text-white/90">
                      <span className="inline-flex items-center gap-1"><Clock size={14} /> {d.dur}</span>
                      <span className="font-bold" style={{ color: C.sun }}>{d.price}</span>
                    </span>
                    <Link href={reservar} className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#102A43] transition hover:bg-[#F4B400]">
                      Ver salida <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ELIGE TU TIPO DE VIAJE */}
      <section className="px-5 py-16" style={{ backgroundColor: C.sand }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-8 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: display, color: C.night }}>Elige tu tipo de viaje</h2>
          <div className="-mx-5 mb-8 flex justify-start gap-2 overflow-x-auto px-5 sm:justify-center">
            {CATS.map((c) => {
              const active = c === cat;
              return (
                <button key={c} onClick={() => setCat(c)} className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition" style={{ backgroundColor: active ? C.ocean : "#FFFFFF", color: active ? "#FFFFFF" : C.night }}>
                  {c}
                </button>
              );
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(catDest.length ? catDest : DESTINATIONS.slice(0, 3)).map((d) => (
              <div key={d.n} className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-md">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image src={d.src} alt={d.n} fill unoptimized className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-bold" style={{ fontFamily: display, color: C.night }}>{d.n}</h3>
                  <p className="text-xs" style={{ color: "#4A5560" }}>{d.t} · {d.dur}</p>
                  <p className="text-sm font-bold" style={{ color: C.ocean }}>{d.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRÓXIMAS SALIDAS (tickets) */}
      <section id="salidas" className="px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="animate-fade-up mb-10 text-4xl font-bold sm:text-5xl" style={{ fontFamily: display, color: C.night }}>Próximas salidas</h2>
          <div className="stagger-fade space-y-4">
            {DEPARTURES.map((s) => (
              <div key={s.n + s.date} className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md sm:flex-row sm:items-stretch" style={{ borderColor: "#E6E0D4" }}>
                <div className="flex items-center gap-3 px-5 py-4 text-white sm:w-56" style={{ backgroundColor: C.ocean }}>
                  <MapPin size={18} />
                  <span className="text-lg font-bold" style={{ fontFamily: display }}>{s.n}</span>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-3 px-5 py-4 text-sm sm:grid-cols-4 sm:items-center" style={{ borderLeft: "2px dashed #E6E0D4" }}>
                  <span><span className="block text-xs text-[#8A8A8A]">Fecha</span><strong>{s.date}</strong></span>
                  <span><span className="block text-xs text-[#8A8A8A]">Duración</span>{s.dur}</span>
                  <span><span className="block text-xs text-[#8A8A8A]">Lugares</span><span className="inline-flex items-center gap-1"><Users size={13} /> {s.seats}</span></span>
                  <span><span className="block text-xs text-[#8A8A8A]">Salida</span>{s.point}</span>
                </div>
                <div className="flex items-center justify-between gap-3 px-5 py-4 sm:flex-col sm:items-end sm:justify-center" style={{ backgroundColor: C.sand }}>
                  <span className="font-bold" style={{ color: C.ocean }}>{s.price}</span>
                  <Link href={reservar} className="rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: C.terra }}>Reservar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUTA DESTACADA */}
      <section className="rv-route px-5 py-20" style={{ backgroundColor: C.night, color: "white" }}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src={TRAVEL_IMAGES.destinations["Grutas de Tolantongo"]} alt="Grutas de Tolantongo" fill unoptimized className="object-cover" />
          </div>
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider" style={{ color: C.sun }}><Mountain size={15} /> Ruta destacada</p>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl" style={{ fontFamily: display }}>Grutas de Tolantongo: agua termal, montaña y aventura</h2>
            <p className="mt-4 text-white/80">
              Vive una escapada entre pozas termales, río turquesa, grutas naturales y paisajes de montaña. Una experiencia perfecta para desconectarte y disfrutar un fin de semana diferente.
            </p>
            <div className="mt-6 flex">
              <div className="relative mr-4 w-px shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <span className="rv-route-line absolute inset-0 w-px" style={{ backgroundColor: C.sun }} />
              </div>
              <ul className="stagger space-y-3">
                {ITINERARY.map((step) => (
                  <li key={step} className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: C.sun }} /> {step}
                  </li>
                ))}
              </ul>
            </div>
            <Link href={reservar} className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-[#102A43]" style={{ backgroundColor: C.sun }}>
              Reservar esta ruta <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* LO QUE INCLUYE */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="animate-fade-up text-3xl font-bold sm:text-4xl" style={{ fontFamily: display, color: C.night }}>Lo que incluye tu viaje</h2>
          <p className="animate-fade-up mx-auto mt-3 max-w-md text-lg" style={{ color: C.ocean, fontFamily: display }}>Viaja sin complicarte</p>
          <div className="stagger-fade mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {INCLUDES.map((it) => (
              <div key={it} className="flex flex-col items-center gap-2 rounded-2xl border p-5 text-sm font-medium transition hover:shadow-md" style={{ borderColor: "#E6E0D4", color: C.night }}>
                <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ backgroundColor: C.aqua }}><ShieldCheck size={18} /></span>
                {it}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA MÉXICO VIVO */}
      <section id="galeria" className="py-16" style={{ backgroundColor: C.sand }}>
        <h2 className="animate-fade-up mb-8 px-5 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: display, color: C.night }}>México vivo</h2>
        <div className="flex snap-x gap-5 overflow-x-auto px-5 pb-4">
          {GALLERY.map((g) => (
            <figure key={g.n} className="group relative h-80 w-[300px] shrink-0 snap-center overflow-hidden rounded-3xl shadow-md sm:w-[440px]">
              <Image src={g.src} alt={g.n} fill unoptimized className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(16,42,67,0.85))" }} />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur">{g.tag}</span>
                <p className="mt-2 text-2xl font-bold" style={{ fontFamily: display }}>{g.n}</p>
                <p className="text-sm text-white/85">{g.phrase}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* POR QUÉ VIAJAR */}
      <section className="px-5 py-20" style={{ backgroundColor: C.night, color: "white" }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-12 text-3xl font-bold sm:text-4xl" style={{ fontFamily: display }}>Por qué viajar con nosotros</h2>
          <div className="stagger grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.n}>
                <p className="text-5xl font-bold" style={{ fontFamily: display, color: C.sun }}>{w.n}</p>
                <h3 className="mt-3 text-xl font-bold">{w.t}</h3>
                <p className="mt-1 text-sm text-white/75">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="opiniones" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-10 text-3xl font-bold sm:text-4xl" style={{ fontFamily: display, color: C.night }}>Viajeros que ya partieron</h2>
          <div className="stagger -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4">
            {TESTIMONIALS.map((t) => (
              <figure key={t.a} className="w-[300px] shrink-0 snap-center rounded-3xl border bg-white p-6 shadow-sm sm:w-[380px]" style={{ borderColor: "#E6E0D4" }}>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: C.terra }}><MapPin size={11} /> {t.dest}</span>
                <blockquote className="mt-3 text-lg leading-7" style={{ color: C.night, fontFamily: display }}>“{t.t}”</blockquote>
                <figcaption className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{ color: "#4A5560" }}>
                  <Star size={14} style={{ color: C.sun }} fill="currentColor" /> {t.a}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20" style={{ backgroundColor: C.sand }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="animate-fade-up mb-8 text-center text-3xl font-bold sm:text-4xl" style={{ fontFamily: display, color: C.night }}>Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-2xl bg-white">
                <button className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold" style={{ color: C.night }} onClick={() => setFaqOpen(faqOpen === i ? null : i)} aria-expanded={faqOpen === i}>
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ transform: faqOpen === i ? "rotate(180deg)" : "none", color: C.ocean }} />
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: faqOpen === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden"><p className="px-5 pb-4 text-sm leading-6" style={{ color: "#4A5560" }}>{f.a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA POSTAL */}
      <section className="relative overflow-hidden px-5 py-28 text-white">
        <Image src={TRAVEL_IMAGES.cta} alt="" fill unoptimized className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(217,108,59,0.85), rgba(16,42,67,0.8))" }} />
        <div className="animate-fade-up relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: C.sand }}>19.4326° N · 99.1332° W</p>
          <h2 className="text-4xl font-bold sm:text-6xl" style={{ fontFamily: display }}>Tu próxima historia empieza en ruta</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">Elige tu destino, aparta tu lugar y prepárate para descubrir México de una forma diferente.</p>
          <Link href={reservar} className="mt-8 inline-flex items-center gap-2 rounded-full px-9 py-4 font-semibold text-[#102A43] transition hover:brightness-105" style={{ backgroundColor: C.sun }}>
            Reservar mi viaje <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="px-5 py-14" style={{ backgroundColor: C.night, color: "#A9BBCB" }}>
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="inline-flex items-center gap-2 text-lg font-bold text-white" style={{ fontFamily: display }}>
              <Compass size={18} style={{ color: C.sun }} /> RUTA VIVA MX
            </p>
            <p className="mt-3 text-sm">Aventura organizada y confiable por todo México.</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Contacto</p>
            <p className="flex items-center gap-2"><MessageCircle size={15} style={{ color: C.sun }} /> WhatsApp 55 7788 9900</p>
            <p className="mt-2 flex items-center gap-2"><Instagram size={15} style={{ color: C.sun }} /> @rutavivamx</p>
            <p className="mt-2 flex items-center gap-2"><Bus size={15} style={{ color: C.sun }} /> Salidas: Centro · CDMX</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Atención</p>
            <p>Lun – Sáb · 9:00 – 19:00</p>
            <Link href={reservar} className="mt-4 inline-block font-semibold" style={{ color: C.sun }}>Reservar viaje →</Link>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Enlaces</p>
            <p><a href="#destinos">Destinos</a></p>
            <p className="mt-1"><a href="#salidas">Próximas salidas</a></p>
            <p className="mt-1"><a href="#galeria">Experiencias</a></p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl text-xs" style={{ color: "#5B7390" }}>
          Los itinerarios, precios y horarios pueden cambiar según disponibilidad, clima o condiciones del destino. © {new Date().getFullYear()} Ruta Viva MX.
        </p>
      </footer>
    </div>
  );
}
