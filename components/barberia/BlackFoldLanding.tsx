"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scissors, Sparkles, Crown, Clock, Star, Menu, X, MapPin, Phone, Instagram, Facebook, ChevronRight } from "lucide-react";
import { BARBER_IMAGES } from "@/lib/visual-assets";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const GOLD = "#C9A227";

const SERVICES = [
  { icon: Scissors, name: "Corte clásico", desc: "Tijera y máquina con acabado limpio y atemporal.", price: "$180" },
  { icon: Sparkles, name: "Fade / Degradado", desc: "Degradados precisos, del skin fade al taper.", price: "$220" },
  { icon: Crown, name: "Arreglo de barba", desc: "Perfilado, toalla caliente y aceite premium.", price: "$140" },
  { icon: Star, name: "Corte + barba", desc: "La experiencia completa BLACK FOLD.", price: "$280" }
];

const BENEFITS = [
  "Atención personalizada",
  "Barberos profesionales",
  "Ambiente premium",
  "Productos de calidad",
  "Citas rápidas",
  "Estilo garantizado"
];

const GALLERY = BARBER_IMAGES.gallery;

export function BlackFoldLanding({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const agendar = `/${slug}/agendar`;

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const eo = "power3.out";
      // Hero
      gsap.from(".bf-hero-item", { y: 40, opacity: 0, duration: 1, ease: eo, stagger: 0.12, delay: 0.15 });
      gsap.fromTo(".bf-hero-bg", { scale: 1.15 }, { scale: 1, duration: 2.2, ease: eo });
      gsap.to(".bf-hero-bg", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".bf-hero", start: "top top", end: "bottom top", scrub: true } });
    }, root);

    // Las imágenes cargan async y mueven el layout: recalcular posiciones.
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
    <div ref={root} className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]" style={{ fontFamily: "var(--font-inter)" }}>
      {/* ---------- NAVBAR ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0B0B0B]/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-widest" style={{ fontFamily: "var(--font-oswald)" }}>
            <Scissors size={20} style={{ color: GOLD }} /> BLACK<span style={{ color: GOLD }}>FOLD</span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#C9C9C9] md:flex">
            <a href="#servicios" className="transition hover:text-white">Servicios</a>
            <a href="#nosotros" className="transition hover:text-white">Nosotros</a>
            <a href="#galeria" className="transition hover:text-white">Galería</a>
            <Link href={agendar} className="rounded-full px-5 py-2 font-semibold text-black transition hover:brightness-110" style={{ backgroundColor: GOLD }}>
              Agendar cita
            </Link>
          </div>
          <button className="text-white md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {menuOpen ? (
          <div className="border-t border-white/5 bg-[#0B0B0B] px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-[#C9C9C9]">
              <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
              <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
              <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
              <Link href={agendar} className="rounded-full px-5 py-2.5 text-center font-semibold text-black" style={{ backgroundColor: GOLD }}>
                Agendar cita
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      {/* ---------- HERO ---------- */}
      <section id="top" className="bf-hero relative flex min-h-screen items-center overflow-hidden">
        <div className="bf-hero-bg absolute inset-0 will-change-transform">
          <Image src={BARBER_IMAGES.hero} alt="Barbería BLACK FOLD" fill priority unoptimized className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/85 to-[#0B0B0B]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-24">
          <div className="max-w-2xl">
            <p className="bf-hero-item mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              <Star size={13} fill="currentColor" /> Barbería premium
            </p>
            <h1 className="bf-hero-item text-5xl font-bold uppercase leading-[0.95] sm:text-7xl" style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.01em" }}>
              Cortes premium para<br />hombres con <span style={{ color: GOLD }}>estilo</span>
            </h1>
            <p className="bf-hero-item mt-6 max-w-xl text-lg leading-8 text-[#B9B9B9]">
              Barbería moderna especializada en cortes clásicos, fades, barba y experiencia personalizada.
            </p>
            <div className="bf-hero-item mt-9 flex flex-wrap gap-4">
              <Link href={agendar} className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-black transition hover:brightness-110 hover:shadow-[0_0_30px_rgba(201,162,39,0.45)]" style={{ backgroundColor: GOLD }}>
                Agendar cita <ChevronRight size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <a href="#servicios" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:border-white/50 hover:bg-white/5">
                Ver servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SERVICIOS ---------- */}
      <section id="servicios" className="bf-services bg-[#0B0B0B] py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="animate-fade-up mb-14 text-center">
            <span className="mx-auto mb-3 block h-px w-16 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
            <h2 className="text-4xl font-bold uppercase sm:text-5xl" style={{ fontFamily: "var(--font-oswald)" }}>Nuestros servicios</h2>
            <p className="mt-3 text-[#8A8A8A]">Precisión y estilo en cada detalle.</p>
          </div>
          <div className="stagger-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.name}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              >
                <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition group-hover:opacity-100" style={{ backgroundColor: "rgba(201,162,39,0.25)" }} />
                <s.icon size={30} style={{ color: GOLD }} />
                <h3 className="mt-5 text-xl font-semibold" style={{ fontFamily: "var(--font-oswald)" }}>{s.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">{s.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-2xl font-bold" style={{ color: GOLD, fontFamily: "var(--font-oswald)" }}>{s.price}</span>
                  <Clock size={16} className="text-[#8A8A8A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SOBRE NOSOTROS ---------- */}
      <section id="nosotros" className="border-y border-white/5 bg-[#0E0E0E] py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
          <div className="animate-fade-up relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            <Image src={BARBER_IMAGES.about} alt="Barbero realizando un corte en BLACK FOLD" fill unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 to-transparent" />
          </div>
          <div className="animate-fade-up">
            <span className="mb-3 block h-px w-16 bg-gradient-to-r from-[#C9A227] to-transparent" />
            <h2 className="text-4xl font-bold uppercase sm:text-5xl" style={{ fontFamily: "var(--font-oswald)" }}>Sobre nosotros</h2>
            <p className="mt-6 text-lg leading-8 text-[#B9B9B9]">
              En <strong className="text-white">BLACK FOLD BARBER</strong> combinamos técnica, estilo y precisión para
              ofrecer una experiencia completa de barbería. Cada corte está diseñado para resaltar tu personalidad y
              darte una imagen impecable.
            </p>
            {/* Beneficios */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-[#D4D4D4]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GOLD }} /> {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- GALERÍA ---------- */}
      <section id="galeria" className="bf-gallery bg-[#0B0B0B] py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="animate-fade-up mb-12 text-center">
            <span className="mx-auto mb-3 block h-px w-16 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
            <h2 className="text-4xl font-bold uppercase sm:text-5xl" style={{ fontFamily: "var(--font-oswald)" }}>Galería</h2>
            <p className="mt-3 text-[#8A8A8A]">Trabajo real, estilo real.</p>
          </div>
          <div className="stagger-fade grid grid-cols-2 gap-3 md:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image src={src} alt={`Corte ${i + 1}`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="bf-cta relative overflow-hidden py-28">
        <div className="absolute inset-0">
          <Image src={BARBER_IMAGES.cta} alt="" fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-[#0B0B0B]/85" />
        </div>
        <div className="animate-scale-in relative mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-4xl font-bold uppercase sm:text-6xl" style={{ fontFamily: "var(--font-oswald)" }}>
            ¿Listo para tu <span style={{ color: GOLD }}>próximo corte</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#B9B9B9]">
            Agenda tu cita hoy y vive una experiencia de barbería premium.
          </p>
          <Link href={agendar} className="mt-9 inline-flex items-center gap-2 rounded-full px-9 py-4 text-lg font-semibold text-black transition hover:brightness-110 hover:shadow-[0_0_40px_rgba(201,162,39,0.5)]" style={{ backgroundColor: GOLD }}>
            Agendar ahora <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-white/5 bg-[#0E0E0E] py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold tracking-widest" style={{ fontFamily: "var(--font-oswald)" }}>
              <Scissors size={18} style={{ color: GOLD }} /> BLACK<span style={{ color: GOLD }}>FOLD</span>
            </p>
            <p className="mt-3 text-sm text-[#8A8A8A]">Barbería premium para hombres con estilo.</p>
          </div>
          <div className="text-sm text-[#B9B9B9]">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Contacto</p>
            <p className="flex items-center gap-2"><MapPin size={15} style={{ color: GOLD }} /> Av. Reforma 123, CDMX</p>
            <p className="mt-2 flex items-center gap-2"><Phone size={15} style={{ color: GOLD }} /> 55 1234 5678</p>
          </div>
          <div className="text-sm text-[#B9B9B9]">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Horario</p>
            <p>Lun – Vie · 10:00 – 20:00</p>
            <p className="mt-1">Sábado · 09:00 – 18:00</p>
            <p className="mt-1">Domingo · Cerrado</p>
          </div>
          <div className="text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Síguenos</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:border-[#C9A227]/60" style={{ color: GOLD }}><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:border-[#C9A227]/60" style={{ color: GOLD }}><Facebook size={18} /></a>
            </div>
            <Link href={agendar} className="mt-5 inline-block font-semibold" style={{ color: GOLD }}>Agendar cita →</Link>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl px-5 text-xs text-[#5A5A5A]">© {new Date().getFullYear()} BLACK FOLD BARBER. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
