import Link from "next/link";
import { ArrowLeft, Clock, MapPin, User } from "lucide-react";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase";
import { getBusinessBySlug } from "@/lib/data";
import { dateLabel, money } from "@/lib/format";
import { nicheDesign } from "@/lib/niche-design";
import type { Appointment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("appointments")
    .select("*, services(nombre, duracion_min, precio)")
    .eq("business_id", business.id)
    .eq("id", id)
    .single<Appointment>();

  if (!data) notFound();

  const branding = business.branding_json ?? {};
  const design = nicheDesign(business.nicho);
  const appointmentName = branding.appointmentName ?? "cita";

  const styleVars = {
    "--brand": branding.primary ?? "20 83 45",
    "--accent": branding.accent ?? "217 119 6",
    "--ink": branding.ink ?? "24 24 27",
    "--paper": branding.paper ?? "250 250 249",
    "--font-display": design.displayFont,
    "--font-body": design.bodyFont,
    "--radius": design.radius
  } as React.CSSProperties;

  const rows = [
    { icon: MapPin, label: "Negocio", value: business.nombre },
    { icon: Clock, label: "Cuándo", value: dateLabel(data.inicio_ts, business.timezone) },
    { icon: User, label: "A nombre de", value: data.cliente_nombre }
  ];

  return (
    <main style={styleVars} className="grid min-h-screen place-items-center px-5 py-10">
      <section className="card w-full max-w-lg overflow-hidden p-0">
        {/* Banda superior temática + check animado */}
        <div className="relative overflow-hidden px-8 pb-10 pt-12 text-center text-white">
          <div className="absolute inset-0" style={{ background: design.heroBackground, backgroundSize: "180% 180%" }} />
          <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: design.pattern }} />

          <div className="relative mx-auto grid h-24 w-24 place-items-center">
            <span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "rgb(255 255 255 / 0.25)", animation: "pop-ring 900ms var(--ease-out) 200ms forwards" }}
            />
            <span className="absolute inset-0 rounded-full bg-white/15" />
            <svg viewBox="0 0 52 52" className="relative h-20 w-20">
              <circle cx="26" cy="26" r="24" fill="white" />
              <path
                d="M16 27 L23 34 L37 19"
                fill="none"
                stroke="rgb(var(--brand))"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: "draw-check 500ms var(--ease-out) 450ms forwards" }}
              />
            </svg>
          </div>

          <h1 className="animate-fade-up relative mt-6 text-3xl font-bold" style={{ ["--delay" as string]: "300ms" }}>
            ¡{appointmentName.charAt(0).toUpperCase() + appointmentName.slice(1)} confirmada!
          </h1>
          <p className="animate-fade-up relative mt-2 text-white/80" style={{ ["--delay" as string]: "380ms" }}>
            {data.services?.nombre ?? "Servicio"}
            {data.services?.precio != null ? ` · ${money(data.services.precio)}` : ""}
          </p>
        </div>

        {/* Detalles */}
        <div className="stagger p-6">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 border-b border-zinc-100 py-3 last:border-0">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center"
                style={{ borderRadius: design.radius, backgroundColor: "rgb(var(--brand) / 0.1)", color: "rgb(var(--brand))" }}
              >
                <Icon size={18} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
                <p className="font-semibold text-zinc-900">{value}</p>
              </div>
            </div>
          ))}

          <p className="mt-4 text-center text-sm text-zinc-500">
            Te enviaremos la confirmación por el canal configurado. Guarda esta pantalla como respaldo.
          </p>

          <Link
            className="btn btn-primary mt-5 w-full"
            href={`/${business.slug}`}
            style={{ borderRadius: design.radius }}
          >
            <ArrowLeft size={16} /> Reservar otra {appointmentName}
          </Link>
        </div>
      </section>
    </main>
  );
}
