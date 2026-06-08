import { addHours } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { getNotifier, logNotification } from "@/lib/notifier";
import type { Appointment, Business, Service } from "@/lib/types";

export const dynamic = "force-dynamic";

type ReminderRow = Appointment & {
  businesses: Business;
  services: Pick<Service, "nombre"> | null;
  notifications_log?: { id: string; tipo: string }[];
};

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const now = new Date();
  const horizon = addHours(now, 48);

  const { data, error } = await supabase
    .from("appointments")
    .select("*, businesses(*), services(nombre), notifications_log(id, tipo)")
    .eq("estado", "confirmada")
    .gte("inicio_ts", now.toISOString())
    .lte("inicio_ts", horizon.toISOString())
    .returns<ReminderRow[]>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const appointment of data ?? []) {
    const business = appointment.businesses;
    const reminderAt = addHours(new Date(appointment.inicio_ts), -business.reminder_hours);
    const alreadyLogged = (appointment.notifications_log ?? []).some((log) => log.tipo === "recordatorio");

    if (alreadyLogged || now < reminderAt) {
      skipped += 1;
      continue;
    }

    const notifier = getNotifier(business.preferred_channel);
    try {
      await notifier.sendReminder({ business, appointment, service: appointment.services });
      await logNotification(appointment.id, notifier.channel, "recordatorio", "enviado");
      sent += 1;
    } catch (err) {
      failures.push(appointment.id);
      await logNotification(appointment.id, notifier.channel, "recordatorio", "error", String(err));
    }
  }

  return NextResponse.json({ sent, skipped, failures });
}
