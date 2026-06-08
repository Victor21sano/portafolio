import type { Appointment, Business, Service } from "./types";
import { dateLabel } from "./format";
import { createServerSupabase } from "./supabase";

type NotificationPayload = {
  business: Business;
  appointment: Appointment;
  service?: Pick<Service, "nombre"> | null;
};

export interface Notifier {
  channel: string;
  sendConfirmation(payload: NotificationPayload): Promise<void>;
  sendOwnerNotice(payload: NotificationPayload): Promise<void>;
  sendReminder(payload: NotificationPayload): Promise<void>;
}

class ConsoleNotifier implements Notifier {
  channel = "console";

  async sendConfirmation(payload: NotificationPayload) {
    console.log("[notifier] confirmation", message(payload, "confirmacion"));
  }

  async sendOwnerNotice(payload: NotificationPayload) {
    console.log("[notifier] owner", message(payload, "aviso_profesional"));
  }

  async sendReminder(payload: NotificationPayload) {
    console.log("[notifier] reminder", message(payload, "recordatorio"));
  }
}

class EmailNotifier implements Notifier {
  channel = "email";

  async sendConfirmation(payload: NotificationPayload) {
    await sendResend(payload.appointment.cliente_email, "Tu cita esta confirmada", message(payload, "confirmacion"));
  }

  async sendOwnerNotice(payload: NotificationPayload) {
    await sendResend(payload.business.owner_email, "Nueva cita reservada", message(payload, "aviso_profesional"));
  }

  async sendReminder(payload: NotificationPayload) {
    await sendResend(payload.appointment.cliente_email, "Recordatorio de cita", message(payload, "recordatorio"));
  }
}

class WhatsAppNotifier implements Notifier {
  channel = "whatsapp";

  async sendConfirmation(payload: NotificationPayload) {
    await sendTwilio(payload.appointment.cliente_telefono, message(payload, "confirmacion"));
  }

  async sendOwnerNotice(payload: NotificationPayload) {
    if (payload.business.phone) await sendTwilio(payload.business.phone, message(payload, "aviso_profesional"));
  }

  async sendReminder(payload: NotificationPayload) {
    await sendTwilio(payload.appointment.cliente_telefono, message(payload, "recordatorio"));
  }
}

function message({ business, appointment, service }: NotificationPayload, type: "confirmacion" | "recordatorio" | "aviso_profesional") {
  const when = dateLabel(appointment.inicio_ts, business.timezone);
  const serviceName = service?.nombre ?? "Servicio";

  if (type === "aviso_profesional") {
    return `Nueva reserva en ${business.nombre}: ${serviceName} para ${appointment.cliente_nombre}, ${when}.`;
  }
  if (type === "recordatorio") {
    return `Recordatorio: tienes ${business.branding_json.appointmentName ?? "cita"} en ${business.nombre} para ${serviceName}, ${when}.`;
  }
  return `Confirmado: ${serviceName} en ${business.nombre}, ${when}.`;
}

async function sendResend(to: string | null | undefined, subject: string, text: string) {
  if (!to) return;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[resend:dry-run]", { to, subject, text });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Agenda <agenda@example.com>",
      to,
      subject,
      text
    })
  });

  if (!response.ok) throw new Error(`Resend failed: ${response.status}`);
}

async function sendTwilio(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) {
    console.log("[twilio:dry-run]", { to, body });
    return;
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      From: from,
      To: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
      Body: body
    })
  });

  if (!response.ok) throw new Error(`Twilio failed: ${response.status}`);
}

export function getNotifier(preferred?: string): Notifier {
  const provider = process.env.NOTIFIER_PROVIDER ?? preferred ?? "console";
  if (provider === "email") return new EmailNotifier();
  if (provider === "whatsapp") return new WhatsAppNotifier();
  return new ConsoleNotifier();
}

export async function logNotification(appointmentId: string, canal: string, tipo: "confirmacion" | "recordatorio" | "aviso_profesional", estado: string, error?: string) {
  const supabase = createServerSupabase();
  await supabase.from("notifications_log").upsert(
    {
      appointment_id: appointmentId,
      canal,
      tipo,
      estado,
      error: error ?? null,
      enviado_ts: new Date().toISOString()
    },
    { onConflict: "appointment_id,canal,tipo" }
  );
}
