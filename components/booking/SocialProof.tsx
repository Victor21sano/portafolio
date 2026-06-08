import { Star, Quote } from "lucide-react";
import type { NicheDesign } from "@/lib/niche-design";
import type { NicheContent } from "@/lib/niche-content";

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} className={i < Math.round(rating) ? "text-amber-400" : "text-zinc-300"} fill="currentColor" />
      ))}
    </span>
  );
}

export function SocialProof({ design, content }: { design: NicheDesign; content: NicheContent }) {
  return (
    <section className="mt-16">
      {/* Barra de estadísticas (estilo Booksy/StyleSeat) */}
      <div className="stagger grid grid-cols-3 gap-3 sm:gap-4">
        {content.stats.map((s) => (
          <div key={s.l} className="card px-4 py-5 text-center" style={{ borderRadius: design.radius }}>
            <p className="text-2xl font-bold sm:text-3xl" style={{ color: "rgb(var(--brand))", fontFamily: design.displayFont }}>
              {s.n}
            </p>
            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Encabezado de reseñas con valoración agregada (estilo Zocdoc/Fresha) */}
      <div className="mt-12 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold text-zinc-950 sm:text-3xl" style={{ fontFamily: design.displayFont }}>
          {content.proofTitle}
        </h2>
        <div className="flex items-center gap-2">
          <Stars rating={content.rating} size={18} />
          <span className="text-sm text-zinc-600">
            <strong className="text-zinc-900">{content.rating.toFixed(1)}</strong> · {content.reviews} {content.reviewerWord}
          </span>
        </div>
      </div>

      {/* Tarjetas de reseña */}
      <div className="stagger mt-5 grid gap-4 md:grid-cols-3">
        {content.testimonials.map((t) => (
          <figure key={t.name} className="card flex flex-col p-5" style={{ borderRadius: design.radius }}>
            <Quote size={20} style={{ color: "rgb(var(--brand) / 0.4)" }} />
            <blockquote className="mt-2 flex-1 text-sm leading-6 text-zinc-700">“{t.text}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                className="grid h-9 w-9 place-items-center text-sm font-bold text-white"
                style={{ borderRadius: design.radius, backgroundColor: "rgb(var(--brand))" }}
              >
                {t.name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-zinc-900">{t.name}</span>
                <Stars rating={5} size={12} />
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
