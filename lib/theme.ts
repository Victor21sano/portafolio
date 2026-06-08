import type { Branding } from "./types";

export function themeVars(branding: Branding = {}) {
  return {
    "--brand": branding.primary ?? "20 83 45",
    "--accent": branding.accent ?? "217 119 6",
    "--ink": branding.ink ?? "24 24 27",
    "--paper": branding.paper ?? "250 250 249"
  } as React.CSSProperties;
}

export const nichePresets = {
  barberia: {
    primary: "20 83 45",
    accent: "217 119 6",
    headline: "Cortes precisos sin esperar respuesta por WhatsApp",
    cta: "Reservar corte",
    appointmentName: "cita"
  },
  lashista: {
    primary: "126 34 66",
    accent: "13 148 136",
    headline: "Agenda tus pestanas con horario confirmado",
    cta: "Reservar sesion",
    appointmentName: "sesion"
  },
  manicurista: {
    primary: "157 23 77",
    accent: "37 99 235",
    headline: "Reserva tu manicure sin esperar confirmacion manual",
    cta: "Reservar manicure",
    appointmentName: "cita"
  },
  medico: {
    primary: "14 116 144",
    accent: "101 163 13",
    headline: "Consulta disponible con confirmacion inmediata",
    cta: "Agendar consulta",
    appointmentName: "consulta"
  },
  terapeuta: {
    primary: "88 80 141",
    accent: "5 150 105",
    headline: "Agenda tu sesion con privacidad y claridad",
    cta: "Reservar sesion",
    appointmentName: "sesion"
  }
};
