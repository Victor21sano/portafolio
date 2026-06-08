import Link from "next/link";
import { ArrowLeft, ShieldCheck, Clock3, CalendarCheck, Stethoscope, Star } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { SocialProof } from "@/components/booking/SocialProof";
import { ScrollExpandImage } from "@/components/booking/ScrollExpandImage";
import { nicheContent } from "@/lib/niche-content";
import type { NicheLayoutProps } from "./types";

export function MedicoLayout({ business, services, selectedService, selectedDate, slots, design, appointmentName }: NicheLayoutProps) {
  const branding = business.branding_json ?? {};
  const content = nicheContent(business.nicho);
  const firstAvailable = slots[0]?.label;
  const badges = [
    { icon: CalendarCheck, text: "Confirmación inmediata" },
    { icon: Clock3, text: "Sin filas ni esperas" },
    { icon: ShieldCheck, text: "Tus datos, protegidos" }
  ];

  return (
    <>
      {/* Hero clínico sobrio */}
      <header className="relative overflow-hidden border-b border-zinc-200 text-white">
        <div className="absolute inset-0" style={{ background: design.heroBackground }} />
        <div className="absolute inset-0 opacity-[0.10]" style={{ backgroundImage: design.pattern }} />

        <div className="relative mx-auto max-w-6xl px-5 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white">
              <ArrowLeft size={16} /> Portafolio
            </Link>
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Stethoscope size={16} /> {business.nombre}
            </span>
          </nav>

          <div className="stagger max-w-2xl py-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{design.vibe}</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl" style={{ letterSpacing: "-0.01em" }}>
              {branding.headline ?? business.nombre}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/80">{branding.subheadline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Star size={14} fill="currentColor" className="text-amber-300" />
                <strong className="text-white">{content.rating.toFixed(1)}</strong> · {content.reviews} {content.reviewerWord}
              </span>
              {firstAvailable ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Próxima disponibilidad: {firstAvailable}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 pb-6 sm:grid-cols-3">
            {badges.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm text-white ring-1 ring-white/15 backdrop-blur">
                <Icon size={18} /> {text}
              </div>
            ))}
          </div>
        </div>
      </header>

      <ScrollExpandImage src={content.image} alt={`${business.nombre} — ${business.nicho}`} caption={content.imageCaption} design={design} />

      {/* Reserva con sidebar informativo */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-4">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="card p-5">
              <h2 className="text-lg font-semibold text-zinc-900">Antes de tu {appointmentName}</h2>
              <ul className="mt-3 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-2"><CalendarCheck size={16} className="mt-0.5 shrink-0" style={{ color: "rgb(var(--brand))" }} /> Recibe confirmación y recordatorio automáticos.</li>
                <li className="flex gap-2"><Clock3 size={16} className="mt-0.5 shrink-0" style={{ color: "rgb(var(--brand))" }} /> Llega 5 minutos antes de tu horario.</li>
                <li className="flex gap-2"><ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: "rgb(var(--brand))" }} /> {business.politica_cancelacion}</li>
              </ul>
            </div>
          </aside>

          <div>
            <h2 className="animate-fade-up mb-6 text-2xl font-semibold text-zinc-950 sm:text-3xl">Agenda tu {appointmentName}</h2>
            <BookingForm
              business={business}
              services={services}
              selectedService={selectedService}
              selectedDate={selectedDate}
              slots={slots}
              design={design}
              appointmentName={appointmentName}
            />
          </div>
        </div>
        <SocialProof design={design} content={content} />
      </section>
    </>
  );
}
