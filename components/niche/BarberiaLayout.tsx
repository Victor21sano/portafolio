import Link from "next/link";
import { ArrowLeft, Scissors, Star } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { SocialProof } from "@/components/booking/SocialProof";
import { ScrollExpandImage } from "@/components/booking/ScrollExpandImage";
import { nicheContent } from "@/lib/niche-content";
import type { NicheLayoutProps } from "./types";

export function BarberiaLayout({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const branding = business.branding_json ?? {};
  const content = nicheContent(business.nicho);
  const firstAvailable = slots[0]?.label;
  const steps = ["Elige tu servicio", "Toma tu horario", "Llegas y listo"];

  return (
    <>
      {/* Hero editorial oscuro */}
      <header className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: design.pattern }} />
        {/* Poste de barbero */}
        <div
          className="absolute right-0 top-0 hidden h-full w-3 md:block"
          style={{
            background: "repeating-linear-gradient(45deg, #ffffff 0 14px, rgb(var(--accent)) 14px 28px, rgb(var(--brand)) 28px 42px)",
            backgroundSize: "200% 200%",
            animation: "gradient-pan 4s linear infinite"
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-white/70 transition hover:text-white">
              <ArrowLeft size={16} /> Portafolio
            </Link>
            <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
              <Star size={13} fill="currentColor" /> Est. 2024
            </span>
          </nav>

          <div className="stagger grid items-center gap-8 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-24">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase" style={{ letterSpacing: "0.3em", color: "rgb(var(--accent))" }}>
                <Scissors size={14} /> {design.vibe}
              </p>
              <h1 className="text-5xl font-bold uppercase leading-[0.95] sm:text-7xl" style={{ letterSpacing: "0.02em" }}>
                {branding.headline ?? business.nombre}
              </h1>
              <p className="mt-6 max-w-md text-lg leading-8 text-white/70">{branding.subheadline}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-sm text-white/80">
                  <Star size={14} fill="currentColor" className="text-amber-400" />
                  <strong className="text-white">{content.rating.toFixed(1)}</strong> · {content.reviews} {content.reviewerWord}
                </span>
                {firstAvailable ? (
                  <span className="inline-flex items-center gap-2 text-sm text-white/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Disponible desde {firstAvailable}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="hidden md:block">
              <span className="block text-right text-[160px] leading-none text-white/[0.07]" style={{ fontFamily: design.displayFont }}>
                {design.glyph}
              </span>
            </div>
          </div>

          {/* Pasos numerados */}
          <div className="grid gap-px border-y border-white/10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-4 py-5">
                <span className="text-3xl font-bold" style={{ color: "rgb(var(--accent))", fontFamily: design.displayFont }}>
                  0{i + 1}
                </span>
                <span className="text-sm font-semibold uppercase tracking-wider text-white/80">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <ScrollExpandImage src={content.image} alt={`${business.nombre} — ${business.nicho}`} caption={content.imageCaption} design={design} />

      {/* Reserva sobre fondo claro */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-4">
        <h2 className="animate-fade-up mb-8 text-3xl font-bold uppercase text-zinc-950" style={{ letterSpacing: "0.03em" }}>
          Aparta tu {appointmentName}
        </h2>
        <BookingForm
          business={business}
          services={services}
          selectedService={selectedService}
          selectedDate={selectedDate}
          slots={slots}
          design={design}
          appointmentName={appointmentName}
        />
        <SocialProof design={design} content={content} />
        <p className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          <span className="font-semibold text-zinc-700">Cancelación:</span> {business.politica_cancelacion}
        </p>
      </section>
    </>
  );
}
