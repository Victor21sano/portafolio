"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { NicheDesign } from "@/lib/niche-design";

// Evita el warning de SSR: layoutEffect en el navegador, effect en el servidor.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ScrollExpandImage({
  src,
  alt,
  caption,
  design
}: {
  src: string;
  alt: string;
  caption?: string;
  design: NicheDesign;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = frame.current;
    const img = inner.current;
    if (!el || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // La imagen se "expande": entra encogida y crece al hacer scroll.
      gsap.fromTo(
        el,
        { scale: 0.82, borderRadius: 40 },
        {
          scale: 1,
          borderRadius: 18,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 38%", scrub: 0.6 }
        }
      );
      // Parallax: la foto se mueve más lento que el scroll.
      gsap.fromTo(
        img,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="mx-auto my-16 max-w-6xl px-5">
      <div
        ref={frame}
        className="relative overflow-hidden shadow-2xl will-change-transform"
        style={{ aspectRatio: "16 / 8", borderRadius: 18 }}
      >
        <div ref={inner} className="absolute left-0 right-0 will-change-transform" style={{ top: "-16%", height: "132%" }}>
          <Image src={src} alt={alt} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover" />
        </div>

        {/* Velo + caption */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgb(0 0 0 / 0.55), transparent 55%)" }} />
        {caption ? (
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <p className="text-2xl font-bold text-white sm:text-4xl" style={{ fontFamily: design.displayFont }}>
              {caption}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
