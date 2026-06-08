import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { SocialProof } from "@/components/booking/SocialProof";
import { ScrollExpandImage } from "@/components/booking/ScrollExpandImage";
import { nicheContent } from "@/lib/niche-content";
import type { NicheLayoutProps } from "./types";

export function LashistaLayout({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const branding = business.branding_json ?? {};
  const content = nicheContent(business.nicho);
  const firstAvailable = slots[0]?.label;

  return (
    <>
      {/* Hero glam centrado */}
      <header className="relative overflow-hidden text-white">
        <div className="absolute inset-0" style={{ background: design.heroBackground, backgroundSize: "200% 200%", animation: "gradient-pan 22s ease-in-out infinite alternate" }} />
        <div className="absolute inset-0 opacity-[0.20]" style={{ backgroundImage: design.pattern }} />

        <div className="relative mx-auto max-w-3xl px-5 py-7 text-center">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
              <ArrowLeft size={16} /> Portafolio
            </Link>
            <span className="text-sm italic text-white/70" style={{ fontFamily: design.displayFont }}>
              {business.nombre}
            </span>
          </nav>

          <div className="stagger py-16 sm:py-24">
            <div className="mx-auto mb-6 flex items-center justify-center gap-3 text-white/70">
              <span className="h-px w-12 bg-white/40" />
              <span className="text-xs uppercase" style={{ letterSpacing: "0.35em" }}>{design.vibe}</span>
              <span className="h-px w-12 bg-white/40" />
            </div>
            <h1 className="text-5xl leading-tight sm:text-6xl" style={{ fontFamily: design.displayFont }}>
              {branding.headline ?? business.nombre}
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-white/80">{branding.subheadline}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Star size={14} fill="currentColor" className="text-amber-300" />
                <strong className="text-white">{content.rating.toFixed(1)}</strong> · {content.reviews} {content.reviewerWord}
              </span>
              {firstAvailable ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Disponible desde {firstAvailable}
                </span>
              ) : null}
            </div>
            <p className="mt-6 text-4xl text-white/30" style={{ fontFamily: design.displayFont }}>{design.glyph}</p>
          </div>
        </div>

        <svg className="relative block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: 44 }} aria-hidden>
          <path d="M0 60 L0 30 Q720 -10 1440 30 L1440 60 Z" fill="rgb(var(--paper))" />
        </svg>
      </header>

      <ScrollExpandImage src={content.image} alt={`${business.nombre} — ${business.nicho}`} caption={content.imageCaption} design={design} />

      {/* Reserva con aire editorial */}
      <section className="mx-auto max-w-5xl px-5 pb-24 pt-6">
        <div className="animate-fade-up mb-10 text-center">
          <h2 className="text-3xl" style={{ fontFamily: design.displayFont }}>Reserva tu {appointmentName}</h2>
          <p className="mt-2 italic text-zinc-500">Elige técnica, día y hora — sin intercambio de mensajes.</p>
        </div>
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
        <p className="mx-auto mt-12 max-w-lg border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
          {business.politica_cancelacion}
        </p>
      </section>
    </>
  );
}
