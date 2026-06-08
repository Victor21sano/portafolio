"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisplayCardProps {
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-emerald-100" />,
  title = "Demo visual",
  description = "Reservas online",
  date = "Portafolio",
  iconClassName = "bg-emerald-700 text-emerald-100",
  titleClassName = "text-emerald-700"
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between overflow-hidden rounded-xl border-2 border-zinc-200 bg-white/85 px-4 py-3 text-zinc-950 shadow-hard backdrop-blur-sm transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-white after:to-transparent after:content-[''] hover:border-emerald-900/20 hover:bg-white [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full p-1", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-medium", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg font-semibold">{description}</p>
      <p className="text-sm text-zinc-500">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] grayscale-[100%] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-white/55 before:content-[''] before:transition-opacity before:duration-700 hover:-translate-y-10 hover:grayscale-0 hover:before:opacity-0"
    },
    {
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 grayscale-[100%] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-white/55 before:content-[''] before:transition-opacity before:duration-700 hover:-translate-y-1 hover:grayscale-0 hover:before:opacity-0"
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10"
    }
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="animate-fade-up grid [grid-template-areas:'stack'] place-items-center opacity-100">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
