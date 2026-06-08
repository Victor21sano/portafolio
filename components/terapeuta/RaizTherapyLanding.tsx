"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, ChevronRight, ChevronDown, Leaf, Ear, HeartHandshake, Sprout, MapPin, Mail, MessageCircle, Monitor, Home, Compass } from "lucide-react";
import { THERAPY_IMAGES } from "@/lib/visual-assets";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Paleta cálida y serena
const C = {
  beige: "#F5EFE6",
  sage: "#9CAF88",
  deep: "#4F6F52",
  coffee: "#8B6F5A",
  bone: "#FFFDF8",
  sand: "#D8C3A5",
  warm: "#6E6A63",
  terra: "#C9826B"
};
const serif = "var(--font-fraunces)";

const SEEKING = [
  "Entender mejor lo que sientes.",
  "Aprender a manejar ansiedad o estrés.",
  "Mejorar la relación contigo mismo.",
  "Tomar decisiones con más claridad.",
  "Procesar cambios, pérdidas o etapas difíciles.",
  "Fortalecer tus vínculos y comunicación."
];

const PILLARS = [
  { icon: Ear, t: "Escucha activa", d: "Un espacio seguro para expresar lo que estás viviendo sin juicio." },
  { icon: HeartHandshake, t: "Claridad emocional", d: "Acompañamiento para reconocer emociones, pensamientos y necesidades." },
  { icon: Sprout, t: "Herramientas prácticas", d: "Recursos aplicables a tu vida diaria según tu proceso personal." }
];

const AREAS = ["Ansiedad y estrés", "Autoestima", "Relaciones personales", "Duelo y pérdidas", "Cambios de vida", "Gestión emocional", "Comunicación", "Proyecto personal"];

const PROCESS = [
  { n: 1, t: "Agenda tu primera sesión", d: "Elige un horario disponible y comparte brevemente qué te gustaría trabajar." },
  { n: 2, t: "Primera conversación", d: "Conoceremos tu situación, tus expectativas y el motivo de consulta." },
  { n: 3, t: "Definimos un camino", d: "Se plantea una forma de trabajo adaptada a tu proceso." },
  { n: 4, t: "Avanzamos a tu ritmo", d: "Cada sesión da continuidad a lo que necesitas explorar y fortalecer." }
];

const MODALITIES = [
  { icon: Home, t: "Presencial", dur: "50 min", desc: "Sesión en consultorio con ambiente tranquilo y privado.", price: "Desde $600" },
  { icon: Monitor, t: "En línea", dur: "50 min", desc: "Acompañamiento por videollamada desde un espacio cómodo para ti.", price: "Desde $550" },
  { icon: Compass, t: "Primera orientación", dur: "40 min", desc: "Sesión inicial para conocer tu motivo de consulta y resolver dudas.", price: "Desde $400" }
];

const TESTIMONIALS = [
  { t: "Sentí que pude hablar sin sentirme juzgada.", a: "Paciente anónimo" },
  { t: "Me ayudó a entender mejor mis emociones y mis límites.", a: "A." },
  { t: "Las sesiones me dieron herramientas para manejar situaciones difíciles.", a: "M." }
];

const FAQS = [
  { q: "¿Cuánto dura una sesión?", a: "Por lo general entre 45 y 50 minutos, según la modalidad." },
  { q: "¿La terapia es presencial o en línea?", a: "Ambas opciones están disponibles; eliges la que te resulte más cómoda." },
  { q: "¿Cada cuánto se recomienda asistir?", a: "Suele sugerirse una sesión semanal al inicio, pero se adapta a tu proceso." },
  { q: "¿Qué pasa en la primera sesión?", a: "Es un espacio para conocernos, entender tu motivo de consulta y resolver dudas." },
  { q: "¿Puedo cancelar o reagendar?", a: "Sí, con anticipación razonable puedes reagendar tu sesión." },
  { q: "¿La información es confidencial?", a: "Totalmente. Lo que compartes se trata con confidencialidad y respeto." },
  { q: "¿La terapia sustituye atención médica o psiquiátrica?", a: "No. La terapia acompaña, pero no sustituye atención médica o psiquiátrica cuando es necesaria." }
];

export function RaizTherapyLanding({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const agendar = `/${slug}/agendar`;

  useIso(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".rz-hero-line", { y: 30, opacity: 0, duration: 1.1, ease: "power2.out", stagger: 0.16, delay: 0.15 });
      gsap.from(".rz-hero-img", { opacity: 0, scale: 0.94, duration: 1.4, ease: "power2.out", delay: 0.3 });
      gsap.fromTo(".rz-process-line", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", ease: "none", scrollTrigger: { trigger: ".rz-process", start: "top 70%", end: "bottom 75%", scrub: true } });
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
    <div ref={root} className="min-h-screen" style={{ backgroundColor: C.beige, color: C.warm, fontFamily: "var(--font-nunito)" }}>
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 backdrop-blur-md" style={{ backgroundColor: "rgba(245,239,230,0.82)" }}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="inline-flex items-center gap-2 text-xl" style={{ fontFamily: serif, color: C.deep }}>
            <Leaf size={20} style={{ color: C.sage }} /> Raíz <span style={{ color: C.terra }}>Terapia</span>
          </a>
          <div className="hidden items-center gap-7 text-sm md:flex" style={{ color: C.warm }}>
            <a href="#enfoque" className="transition hover:text-[#4F6F52]">Enfoque</a>
            <a href="#areas" className="transition hover:text-[#4F6F52]">Acompañamiento</a>
            <a href="#proceso" className="transition hover:text-[#4F6F52]">Proceso</a>
            <a href="#preguntas" className="transition hover:text-[#4F6F52]">Preguntas</a>
            <Link href={agendar} className="rounded-full px-5 py-2 font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.deep }}>Agendar sesión</Link>
          </div>
          <button className="md:hidden" style={{ color: C.deep }} onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {menuOpen ? (
          <div className="flex flex-col gap-4 border-t border-black/5 px-5 py-4 md:hidden" style={{ backgroundColor: C.beige }}>
            <a href="#enfoque" onClick={() => setMenuOpen(false)}>Enfoque</a>
            <a href="#areas" onClick={() => setMenuOpen(false)}>Acompañamiento</a>
            <a href="#proceso" onClick={() => setMenuOpen(false)}>Proceso</a>
            <a href="#preguntas" onClick={() => setMenuOpen(false)}>Preguntas</a>
            <Link href={agendar} className="rounded-full px-5 py-2.5 text-center font-semibold text-white" style={{ backgroundColor: C.deep }}>Agendar sesión</Link>
          </div>
        ) : null}
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden px-5 pb-20 pt-32">
        <div className="pointer-events-none absolute -left-20 top-24 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: C.sage }} />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: C.terra }} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="rz-hero-line text-4xl leading-[1.12] sm:text-6xl" style={{ fontFamily: serif, color: C.deep }}>
              Un espacio para escucharte, entenderte y avanzar a tu ritmo
            </h1>
            <p className="rz-hero-line mt-6 max-w-md text-lg leading-8">
              Acompañamiento terapéutico profesional para gestionar emociones, fortalecer tu bienestar y construir herramientas para tu vida diaria.
            </p>
            <div className="rz-hero-line mt-9 flex flex-wrap gap-4">
              <Link href={agendar} className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.deep }}>
                Agendar sesión <ChevronRight size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <a href="#enfoque" className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition hover:bg-white" style={{ borderColor: C.sage, color: C.deep }}>
                Conocer el enfoque
              </a>
            </div>
          </div>
          <div className="rz-hero-img relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden border-8 border-white shadow-xl" style={{ borderRadius: "42% 58% 56% 44% / 50% 42% 58% 50%" }}>
              <Image src={THERAPY_IMAGES.hero} alt="Consultorio terapéutico tranquilo con plantas y sofá" fill priority unoptimized className="object-cover" />
            </div>
            <div className="animate-float absolute -left-4 bottom-10 max-w-[200px] rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
              <Leaf size={16} style={{ color: C.sage }} />
              <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: C.deep }}>Tu proceso merece calma, respeto y acompañamiento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TAL VEZ ESTÁS BUSCANDO */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-10 text-center text-3xl sm:text-4xl" style={{ fontFamily: serif, color: C.deep }}>Tal vez estás buscando…</h2>
          <div className="stagger-fade grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEEKING.map((s, i) => (
              <div
                key={s}
                className={`flex items-center rounded-[28px] border border-white bg-white/70 p-6 text-lg leading-7 transition duration-500 hover:shadow-md ${i % 4 === 0 ? "lg:row-span-2 lg:text-xl" : ""}`}
                style={{ color: C.deep, fontFamily: serif }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMA DE ACOMPAÑAMIENTO */}
      <section id="enfoque" className="px-5 py-20" style={{ backgroundColor: C.bone }}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
          <div className="animate-fade-up">
            <span className="mb-4 block h-px w-16" style={{ backgroundColor: C.terra }} />
            <h2 className="text-3xl leading-tight sm:text-4xl" style={{ fontFamily: serif, color: C.deep }}>Forma de acompañamiento</h2>
            <p className="mt-5 text-lg leading-8">
              El proceso terapéutico se construye desde la escucha, el respeto y la colaboración. Cada sesión busca ayudarte a identificar patrones, comprender tus emociones y desarrollar recursos personales para afrontar distintas situaciones.
            </p>
          </div>
          <div className="stagger-fade space-y-4">
            {PILLARS.map((p) => (
              <div key={p.t} className="flex gap-4 rounded-3xl border border-black/5 bg-white p-6 transition hover:shadow-md">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ backgroundColor: C.beige, color: C.deep }}><p.icon size={22} /></span>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: C.deep }}>{p.t}</h3>
                  <p className="mt-1 text-sm leading-6">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS DE ACOMPAÑAMIENTO (nodos) */}
      <section id="areas" className="px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="animate-fade-up mb-12 text-3xl sm:text-4xl" style={{ fontFamily: serif, color: C.deep }}>Áreas de acompañamiento</h2>
          <div className="stagger-fade flex flex-wrap items-center justify-center gap-4">
            {AREAS.map((a, i) => (
              <span
                key={a}
                className="grid aspect-square place-items-center rounded-full border border-white p-4 text-center text-sm font-semibold leading-tight shadow-sm transition duration-500 hover:scale-105"
                style={{
                  width: i % 3 === 0 ? 150 : i % 3 === 1 ? 130 : 140,
                  backgroundColor: i % 2 === 0 ? C.bone : "#EEF2E8",
                  color: C.deep,
                  borderColor: i % 4 === 0 ? C.sage : "white"
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO ES INICIAR TERAPIA */}
      <section id="proceso" className="rz-process px-5 py-20" style={{ backgroundColor: "#EEF2E8" }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-14 text-center text-3xl sm:text-4xl" style={{ fontFamily: serif, color: C.deep }}>Cómo es iniciar terapia</h2>
          <div className="relative">
            <div className="absolute left-0 right-0 top-7 hidden h-0.5 lg:block" style={{ backgroundColor: "#CBD7BF" }}>
              <div className="rz-process-line h-full" style={{ backgroundColor: C.sage }} />
            </div>
            <div className="stagger relative grid gap-8 lg:grid-cols-4">
              {PROCESS.map((p) => (
                <div key={p.n} className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border-4 text-lg font-bold text-white" style={{ backgroundColor: C.deep, borderColor: "#EEF2E8", fontFamily: serif }}>{p.n}</span>
                  <h3 className="mt-4 text-lg font-bold" style={{ color: C.deep }}>{p.t}</h3>
                  <p className="mt-1 text-sm leading-6">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section className="px-5 py-20" style={{ backgroundColor: C.bone }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-12 text-center text-3xl sm:text-4xl" style={{ fontFamily: serif, color: C.deep }}>Modalidades de sesión</h2>
          <div className="stagger-fade grid gap-6 md:grid-cols-3">
            {MODALITIES.map((m) => (
              <div key={m.t} className="flex flex-col rounded-[32px] border border-black/5 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: C.beige, color: C.deep }}><m.icon size={22} /></span>
                <h3 className="mt-4 text-xl" style={{ fontFamily: serif, color: C.deep }}>{m.t}</h3>
                <p className="mt-1 text-sm" style={{ color: C.sage }}>{m.dur} · {m.price}</p>
                <p className="mt-3 flex-1 text-sm leading-6">{m.desc}</p>
                <Link href={agendar} className="mt-6 rounded-full border px-5 py-2.5 text-center text-sm font-semibold transition hover:bg-[#F5EFE6]" style={{ borderColor: C.deep, color: C.deep }}>
                  Agendar esta modalidad
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECORDATORIO IMPORTANTE */}
      <section className="px-5 py-24" style={{ backgroundColor: C.sage }}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-fade-up text-2xl leading-relaxed sm:text-3xl" style={{ fontFamily: serif, color: "#2E4630" }}>
            Pedir ayuda no significa que no puedas con tu vida. Significa que estás buscando nuevas formas de comprenderte y cuidarte.
          </p>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="animate-fade-up mb-10 text-center text-3xl sm:text-4xl" style={{ fontFamily: serif, color: C.deep }}>Palabras de quienes acompañé</h2>
          <div className="stagger -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4">
            {TESTIMONIALS.map((t) => (
              <figure key={t.a} className="w-[300px] shrink-0 snap-center rounded-[28px] border border-black/5 bg-white p-7 shadow-sm sm:w-[360px]" style={{ backgroundColor: C.bone }}>
                <span className="text-4xl leading-none" style={{ fontFamily: serif, color: C.sand }}>&ldquo;</span>
                <blockquote className="-mt-2 text-lg leading-7" style={{ color: C.deep, fontFamily: serif }}>{t.t}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold" style={{ color: C.coffee }}>— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="px-5 py-20" style={{ backgroundColor: C.bone }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="animate-fade-up mb-8 text-center text-3xl sm:text-4xl" style={{ fontFamily: serif, color: C.deep }}>Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: "#E7E0D3" }}>
                <button
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold"
                  style={{ color: C.deep }}
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  aria-expanded={faqOpen === i}
                >
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ transform: faqOpen === i ? "rotate(180deg)" : "none", color: C.sage }} />
                </button>
                <div className="grid transition-all duration-500" style={{ gridTemplateRows: faqOpen === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-6">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-5 py-24" style={{ backgroundColor: C.beige }}>
        <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: C.sage }} />
        <div className="animate-fade-up relative mx-auto max-w-2xl text-center">
          <h2 className="text-4xl leading-tight sm:text-5xl" style={{ fontFamily: serif, color: C.deep }}>Cuando te sientas listo, podemos empezar</h2>
          <p className="mx-auto mt-5 max-w-lg text-lg">Agenda una primera sesión y demos forma a un espacio para escucharte con calma.</p>
          <Link href={agendar} className="mt-8 inline-flex items-center gap-2 rounded-full px-9 py-4 font-semibold text-white transition hover:brightness-110" style={{ backgroundColor: C.deep }}>
            Agendar sesión <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="px-5 py-14" style={{ backgroundColor: C.deep, color: "#E6EADD" }}>
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xl" style={{ fontFamily: serif, color: C.bone }}>
              <Leaf size={18} style={{ color: C.sage }} /> Raíz Terapia
            </p>
            <p className="mt-3 text-sm" style={{ color: "#BFCBB2" }}>Acompañamiento terapéutico con calma y respeto.</p>
          </div>
          <div className="text-sm" style={{ color: "#BFCBB2" }}>
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Contacto</p>
            <p className="flex items-center gap-2"><Mail size={15} style={{ color: C.sage }} /> hola@raizterapia.mx</p>
            <p className="mt-2 flex items-center gap-2"><MessageCircle size={15} style={{ color: C.sage }} /> WhatsApp 55 4455 6677</p>
            <p className="mt-2 flex items-center gap-2"><MapPin size={15} style={{ color: C.sage }} /> Roma Norte, CDMX · y en línea</p>
          </div>
          <div className="text-sm" style={{ color: "#BFCBB2" }}>
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Horarios</p>
            <p>Lun – Vie · 10:00 – 20:00</p>
            <p className="mt-1">Sábado · 10:00 – 14:00</p>
            <Link href={agendar} className="mt-4 inline-block font-semibold" style={{ color: C.sage }}>Agendar sesión →</Link>
          </div>
          <div className="text-sm" style={{ color: "#BFCBB2" }}>
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Aviso</p>
            <p>Este sitio no sustituye atención médica o de emergencia. Si estás en crisis o en peligro inmediato, contacta servicios de emergencia de tu localidad.</p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs" style={{ color: "#8FA086" }}>© {new Date().getFullYear()} Raíz Terapia.</p>
      </footer>
    </div>
  );
}
