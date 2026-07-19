"use client";

import InteractiveBentoGallery, { type MediaItemType } from "@/components/ui/interactive-bento-gallery";
import { BARBER_IMAGES, LASH_IMAGES, MEDICAL_IMAGES, NAIL_IMAGES, THERAPY_IMAGES, TRAVEL_IMAGES } from "@/lib/visual-assets";

const mediaItems: MediaItemType[] = [
  {
    id: 1,
    type: "image",
    title: "PatronBarber",
    desc: "Landing oscura, editorial y precisa para barbería premium.",
    url: BARBER_IMAGES.hero,
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2"
  },
  {
    id: 2,
    type: "image",
    title: "Luna Nail Studio",
    desc: "Experiencia visual boutique para diseños de uñas y servicios beauty.",
    url: NAIL_IMAGES.hero[0],
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2"
  },
  {
    id: 3,
    type: "image",
    title: "Velvet Lash Studio",
    desc: "Look premium, suave y enfocado en resultados de pestañas.",
    url: LASH_IMAGES.hero,
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2"
  },
  {
    id: 4,
    type: "image",
    title: "Clínica Vitalia",
    desc: "Diseño claro para salud, especialistas y reserva médica.",
    url: MEDICAL_IMAGES.hero,
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2"
  },
  {
    id: 5,
    type: "image",
    title: "Raíz Terapia",
    desc: "Interfaz cálida y tranquila para agenda terapéutica.",
    url: THERAPY_IMAGES.hero,
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2"
  },
  {
    id: 6,
    type: "image",
    title: "Ruta Viva MX",
    desc: "Reserva visual para viajes, destinos y salidas grupales.",
    url: TRAVEL_IMAGES.hero,
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2"
  }
];

export function PortfolioBentoGallery() {
  return (
    <InteractiveBentoGallery
      mediaItems={mediaItems}
      title="Colección visual de demos"
      description="Explora una muestra de las marcas del portafolio. Puedes arrastrar las piezas, abrirlas y comparar cómo cambia la dirección visual por rubro."
    />
  );
}
