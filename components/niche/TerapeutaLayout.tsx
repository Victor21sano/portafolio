import Link from "next/link";
import { ArrowLeft, Leaf, Lock, Star } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { SocialProof } from "@/components/booking/SocialProof";
import { ScrollExpandImage } from "@/components/booking/ScrollExpandImage";
import { nicheContent } from "@/lib/niche-content";
import type { NicheLayoutProps } from "./types";

export function TerapeutaLayout({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const branding = business.branding_json ?? {};
  const content = nicheContent(business.nicho);
  const firstAvailable = slots[0]?.label;

  return (
    <>
      {/* Hero sereno */}
      <header className="relative overflow-hidden text-white">
        <div className="absolute inset-0" style={{ background: design.heroBackground, backgroundSize: "200% 200%", animation: "gradient-pan 26s ease-in-out infinite alternate" }} />
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: design.pattern }} />

        <div className="relative mx-auto max-w-3xl px-6 py-7 text-center">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
              <ArrowLeft size={16} /> Portafolio
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-white/70">
              <Leaf size={15} /> {business.nombre}
            </span>
          </nav>

          <div className="stagger py-20 sm:py-28">
            <p className="mb-5 text-sm" style={{ letterSpacing: "0.2em", color: "rgb(255 255 255 / 0.75)" }}>{design.vibe}</p>
            <h1 className="text-4xl leading-[1.15] sm:text-5xl" style={{ fontFamily: design.displayFont }}>
              {branding.headline ?? business.nombre}
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-white/80">{branding.subheadline}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 ring-1 ring-white/15 backdrop-blur">
                <Lock size={14} /> Reserva 100% confidencial
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 ring-1 ring-white/15 backdrop-blur">
                <Star size={13} fill="currentColor" className="text-amber-300" /> {content.rating.toFixed(1)} · {content.reviews} {content.reviewerWord}
              </span>
              {firstAvailable ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 ring-1 ring-white/15 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Disponible desde {firstAvailable}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <svg className="relative block w-full" viewBox="0 0 1440 70" preserveAspectRatio="none" style={{ height: 56 }} aria-hidden>
          <path d="M0 70 L0 35 Q360 5 720 35 T1440 35 L1440 70 Z" fill="rgb(var(--paper))" />
        </svg>
      </header>

      <ScrollExpandImage src={content.image} alt={`${business.nombre} — ${business.nicho}`} caption={content.imageCaption} design={design} />

      {/* Reserva con mucho aire, una sola columna */}
      <section className="mx-auto max-w-3xl px-6 pb-28 pt-6">
        <div className="animate-fade-up mb-10 text-center">
          <h2 className="text-3xl" style={{ fontFamily: design.displayFont }}>Reserva tu {appointmentName}</h2>
          <p className="mt-3 leading-7 text-zinc-500">
            Tómate un momento para ti. Elige el espacio que mejor te acomode y nosotros nos encargamos del resto.
          </p>
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
        <p className="mx-auto mt-12 max-w-md border-t border-zinc-200 pt-6 text-center text-sm leading-6 text-zinc-500">
          {business.politica_cancelacion}
        </p>
      </section>
    </>
  );
}
