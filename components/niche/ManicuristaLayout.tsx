import Link from "next/link";
import { ArrowLeft, Heart, Sparkle, Star } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { SocialProof } from "@/components/booking/SocialProof";
import { ScrollExpandImage } from "@/components/booking/ScrollExpandImage";
import { nicheContent } from "@/lib/niche-content";
import type { NicheLayoutProps } from "./types";

export function ManicuristaLayout({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const branding = business.branding_json ?? {};
  const content = nicheContent(business.nicho);
  const firstAvailable = slots[0]?.label;

  return (
    <>
      {/* Hero candy con blobs */}
      <header className="relative overflow-hidden text-white">
        <div className="absolute inset-0" style={{ background: design.heroBackground, backgroundSize: "200% 200%", animation: "gradient-pan 16s ease-in-out infinite alternate" }} />
        {/* Blobs flotantes */}
        <div className="animate-float absolute -left-10 top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="animate-float absolute right-0 top-24 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: "rgb(var(--accent) / 0.5)", animationDelay: "1.2s" }} />
        <div className="animate-float absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/15 blur-2xl" style={{ animationDelay: "0.6s" }} />

        <div className="relative mx-auto max-w-6xl px-5 py-7">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/30">
              <ArrowLeft size={16} /> Portafolio
            </Link>
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">{business.nombre}</span>
          </nav>

          <div className="stagger max-w-2xl py-16 sm:py-20">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-1.5 text-sm font-bold backdrop-blur">
              <Sparkle size={15} /> {design.vibe}
            </p>
            <h1 className="text-5xl font-bold leading-[1.05] sm:text-6xl" style={{ fontFamily: design.displayFont }}>
              {branding.headline ?? business.nombre} <span className="inline-block">{design.glyph}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg font-medium leading-8 text-white/90">{branding.subheadline}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold" style={{ color: "rgb(var(--brand))" }}>
                <Heart size={15} fill="currentColor" /> {content.reviews}+ clientas felices
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-4 py-2.5 text-sm font-bold backdrop-blur">
                <Star size={14} fill="currentColor" className="text-amber-300" /> {content.rating.toFixed(1)}
              </span>
              {firstAvailable ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2.5 text-sm font-bold backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Desde {firstAvailable}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <ScrollExpandImage src={content.image} alt={`${business.nombre} — ${business.nicho}`} caption={content.imageCaption} design={design} />

      {/* Reserva burbujeante */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-4">
        <h2 className="animate-fade-up mb-8 text-3xl font-bold" style={{ fontFamily: design.displayFont, color: "rgb(var(--brand))" }}>
          Reserva tu {appointmentName} {design.glyph}
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
        <p className="mt-10 rounded-3xl px-5 py-4 text-sm font-medium" style={{ backgroundColor: "rgb(var(--brand) / 0.07)", color: "rgb(var(--brand))" }}>
          💅 {business.politica_cancelacion}
        </p>
      </section>
    </>
  );
}
