import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";
import { getAllBusinesses } from "@/lib/data";
import { nicheDesign } from "@/lib/niche-design";
import { BARBER_IMAGES, LASH_IMAGES, MEDICAL_IMAGES, NAIL_IMAGES, THERAPY_IMAGES, TRAVEL_IMAGES } from "@/lib/visual-assets";

export const dynamic = "force-dynamic";

const nichoLabel: Record<string, string> = {
  barberia: "Barbería",
  lashista: "Lashista",
  manicurista: "Manicurista",
  medico: "Médico",
  terapeuta: "Terapeuta",
  viajes: "Viajes"
};

const cardImages: Record<string, string> = {
  barberia: BARBER_IMAGES.hero,
  lashista: LASH_IMAGES.hero,
  manicurista: NAIL_IMAGES.hero[0],
  medico: MEDICAL_IMAGES.hero,
  terapeuta: THERAPY_IMAGES.hero,
  viajes: TRAVEL_IMAGES.hero
};

export default async function PortfolioPage() {
  const businesses = await getAllBusinesses();

  return (
    <main className="min-h-screen px-5 py-12">
      <section className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="animate-fade-up label mb-3 inline-flex items-center gap-2">
            <Sparkles size={14} /> Portafolio · Apps de citas
          </p>
          <h1 className="animate-fade-up text-4xl font-bold leading-[1.07] text-zinc-950 sm:text-6xl" style={{ ["--delay" as string]: "60ms" }}>
            Una página de reservas con <span style={{ color: "rgb(var(--brand))" }}>personalidad</span> para tu negocio
          </h1>
          <p className="animate-fade-up mt-5 text-lg leading-8 text-zinc-600" style={{ ["--delay" as string]: "130ms" }}>
            Cada tarjeta es una demo real y funcional: tus clientes eligen servicio, fecha y hora,
            y la cita se confirma sola. Elige un rubro para verlo en acción.
          </p>
        </header>

        <div className="stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => {
            const branding = business.branding_json ?? {};
            const design = nicheDesign(business.nicho);
            const primary = `rgb(${branding.primary ?? "20 83 45"})`;
            const image = cardImages[business.nicho] ?? TRAVEL_IMAGES.hero;
            return (
              <Link
                key={business.id}
                href={`/${business.slug}`}
                className="card hover-lift group relative flex flex-col overflow-hidden"
              >
                {/* Cabecera fotográfica por rubro */}
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={`${business.nombre} · ${nichoLabel[business.nicho] ?? business.nicho}`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
                  <div className="absolute inset-0 opacity-[0.12] mix-blend-screen" style={{ backgroundImage: design.pattern }} />
                  <span
                    className="absolute -right-2 -top-3 select-none leading-none text-white/25 transition-transform duration-500 group-hover:scale-110"
                    style={{ fontFamily: design.displayFont, fontSize: 110 }}
                    aria-hidden
                  >
                    {design.glyph}
                  </span>
                  <span className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-wider text-white/80">
                    {design.vibe}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span
                    className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: primary }}
                  >
                    {nichoLabel[business.nicho] ?? business.nicho}
                  </span>
                  <h2 className="text-xl font-bold text-zinc-950" style={{ fontFamily: design.displayFont }}>
                    {business.nombre}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
                    {branding.headline ?? "Reservas self-service con confirmación inmediata."}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: primary }}>
                    Ver demo
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <footer className="animate-fade-up mt-14 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-hard sm:flex sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-1 shrink-0" size={22} style={{ color: "rgb(var(--brand))" }} />
            <div>
              <p className="font-semibold text-zinc-950">¿Quieres una así para tu negocio?</p>
              <p className="text-sm text-zinc-600">
                Adapto colores, servicios y textos a tu rubro. Tú dejas de contestar mensajes para agendar.
              </p>
            </div>
          </div>
          <a className="btn btn-primary mt-4 sm:mt-0" href="https://wa.me/52" target="_blank" rel="noreferrer">
            Contactar
          </a>
        </footer>
      </section>
    </main>
  );
}
