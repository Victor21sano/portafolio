"use client";

import { Clock3, Palette, Sparkles } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";

const heroCards = [
  {
    icon: <Palette className="size-4 text-white" />,
    title: "Diseño visual",
    description: "Identidad por rubro",
    date: "6 demos distintas",
    iconClassName: "bg-emerald-700",
    titleClassName: "text-emerald-700",
    className:
      "[grid-area:stack] grayscale-[100%] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-white/55 before:content-[''] before:transition-opacity before:duration-700 hover:-translate-y-10 hover:grayscale-0 hover:before:opacity-0"
  },
  {
    icon: <Clock3 className="size-4 text-white" />,
    title: "Reservas online",
    description: "Flujos claros",
    date: "Móvil y desktop",
    iconClassName: "bg-cyan-700",
    titleClassName: "text-cyan-700",
    className:
      "[grid-area:stack] translate-x-16 translate-y-10 grayscale-[100%] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-white/55 before:content-[''] before:transition-opacity before:duration-700 hover:-translate-y-1 hover:grayscale-0 hover:before:opacity-0"
  },
  {
    icon: <Sparkles className="size-4 text-white" />,
    title: "Marca adaptable",
    description: "Lista para presentar",
    date: "Portafolio web",
    iconClassName: "bg-zinc-900",
    titleClassName: "text-zinc-900",
    className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10"
  }
];

export function PortfolioHeroCards() {
  return <DisplayCards cards={heroCards} />;
}
