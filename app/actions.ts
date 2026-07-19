"use server";

import { addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase";
import { getAuthenticatedBusiness } from "@/lib/auth";
import { getAvailableSlots, getBusinessBySlug, getService } from "@/lib/data";
import { getNotifier, logNotification } from "@/lib/notifier";
import type { Appointment } from "@/lib/types";
import { formatInTimeZone } from "date-fns-tz";

const bookingSchema = z.object({
  slug: z.string().min(1),
  serviceId: z.string().uuid(),
  slot: z.string().min(1),
  nombre: z.string().min(2),
  telefono: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  notas: z.string().max(1000).optional(),
  staffId: z.string().uuid().optional().or(z.literal(""))
});

export async function createBooking(_: unknown, formData: FormData) {
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos de contacto." };
  }

  const input = parsed.data;
  const [startUtc, endUtc] = input.slot.split("|");
  if (!startUtc || !endUtc) return { ok: false, message: "Selecciona un horario valido." };

  const business = await getBusinessBySlug(input.slug);
  if (!business) return { ok: false, message: "Negocio no encontrado." };

  const service = await getService(input.serviceId);
  if (service.business_id !== business.id) return { ok: false, message: "Servicio invalido." };

  const staffId = input.staffId || undefined;
  const barberos: { id: string }[] = business.branding_json?.barberos ?? [];
  if (staffId && !barberos.some((b) => b.id === staffId)) {
    return { ok: false, message: "Barbero inválido." };
  }
  if (!staffId && barberos.length > 0) {
    return { ok: false, message: "Elige a tu barbero." };
  }

  const date = formatInTimeZone(new Date(startUtc), business.timezone, "yyyy-MM-dd");
  const slots = await getAvailableSlots(business, service, date, staffId);
  const isAvailable = slots.some((slot) => slot.startUtc === startUtc && slot.endUtc === endUtc);

  if (!isAvailable) {
    return { ok: false, message: "Ese horario ya no esta disponible. Elige otro horario." };
  }

  const notas = input.notas?.trim() || null;

  const supabase = createServerSupabase();
  let data: Appointment | null = null;
  let error: unknown = null;
  if (staffId) {
    const res = await supabase
      .from("appointments")
      .insert({
        business_id: business.id,
        service_id: service.id,
        staff_id: staffId,
        cliente_nombre: input.nombre,
        cliente_telefono: input.telefono,
        cliente_email: input.email || null,
        inicio_ts: startUtc,
        fin_ts: endUtc,
        estado: "confirmada",
        notas
      })
      .select("*")
      .single<Appointment>();
    data = res.data;
    error = res.error;
  } else {
    const res = await supabase
      .rpc("create_public_appointment", {
        p_business_id: business.id,
        p_service_id: service.id,
        p_cliente_nombre: input.nombre,
        p_cliente_telefono: input.telefono,
        p_cliente_email: input.email ?? null,
        p_inicio_ts: startUtc,
        p_fin_ts: endUtc,
        p_notas: notas
      })
      .single<Appointment>();
    data = res.data;
    error = res.error;
  }

  if (error || !data) {
    return { ok: false, message: "Ese horario se ocupo mientras confirmabas. Elige otro horario." };
  }

  const notifier = getNotifier(business.preferred_channel);
  await Promise.allSettled([
    notifier.sendConfirmation({ business, appointment: data, service }).then(() => logNotification(data.id, notifier.channel, "confirmacion", "enviado")).catch((err) => logNotification(data.id, notifier.channel, "confirmacion", "error", String(err))),
    notifier.sendOwnerNotice({ business, appointment: data, service }).then(() => logNotification(data.id, notifier.channel, "aviso_profesional", "enviado")).catch((err) => logNotification(data.id, notifier.channel, "aviso_profesional", "error", String(err)))
  ]);

  revalidatePath(`/${business.slug}`);
  redirect(`/${business.slug}/confirmacion/${data.id}`);
}

export async function createManualAppointment(formData: FormData) {
  const { business, supabase } = await getAuthenticatedBusiness();
  const service = await getService(String(formData.get("serviceId")), supabase);
  if (service.business_id !== business.id) throw new Error("Servicio invalido.");
  const start = new Date(String(formData.get("inicio")));
  const end = addMinutes(start, service.duracion_min);

  const { error } = await supabase.from("appointments").insert({
    business_id: business.id,
    service_id: service.id,
    cliente_nombre: String(formData.get("nombre")),
    cliente_telefono: String(formData.get("telefono")),
    cliente_email: String(formData.get("email") || ""),
    inicio_ts: start.toISOString(),
    fin_ts: end.toISOString(),
    estado: "confirmada",
    notas: String(formData.get("notas") || "")
  });

  if (error) throw new Error("No se pudo crear la cita. Verifica que el horario no se solape.");
  revalidatePath("/panel");
}

export async function updateAppointmentStatus(formData: FormData) {
  const { business, supabase } = await getAuthenticatedBusiness();
  await supabase
    .from("appointments")
    .update({ estado: String(formData.get("estado")) })
    .eq("business_id", business.id)
    .eq("id", String(formData.get("id")));
  revalidatePath("/panel");
}

export async function createTimeOff(formData: FormData) {
  const { business, supabase } = await getAuthenticatedBusiness();
  await supabase.from("time_off").insert({
    business_id: business.id,
    inicio_ts: new Date(String(formData.get("inicio"))).toISOString(),
    fin_ts: new Date(String(formData.get("fin"))).toISOString(),
    motivo: String(formData.get("motivo") || "Bloqueo")
  });
  revalidatePath("/panel");
  revalidatePath(`/${business.slug}`);
}

export async function deleteTimeOff(formData: FormData) {
  const { business, supabase } = await getAuthenticatedBusiness();
  await supabase.from("time_off").delete().eq("business_id", business.id).eq("id", String(formData.get("id")));
  revalidatePath("/panel");
  revalidatePath(`/${business.slug}`);
}

export async function upsertService(formData: FormData) {
  const { business, supabase } = await getAuthenticatedBusiness();
  const payload = {
    business_id: business.id,
    nombre: String(formData.get("nombre")),
    descripcion: String(formData.get("descripcion") || ""),
    duracion_min: Number(formData.get("duracion_min")),
    precio: Number(formData.get("precio")),
    activo: formData.get("activo") === "on"
  };
  const id = String(formData.get("id") || "");
  if (id) {
    await supabase.from("services").update(payload).eq("business_id", business.id).eq("id", id);
  } else {
    await supabase.from("services").insert(payload);
  }
  revalidatePath("/panel");
  revalidatePath(`/${business.slug}`);
}

export async function updateBusinessSettings(formData: FormData) {
  const { business, supabase } = await getAuthenticatedBusiness();
  const branding = {
    ...business.branding_json,
    primary: String(formData.get("primary")),
    accent: String(formData.get("accent")),
    headline: String(formData.get("headline")),
    subheadline: String(formData.get("subheadline")),
    cta: String(formData.get("cta")),
    appointmentName: String(formData.get("appointmentName"))
  };
  await supabase
    .from("businesses")
    .update({
      nombre: String(formData.get("nombre")),
      timezone: String(formData.get("timezone")),
      politica_cancelacion: String(formData.get("politica_cancelacion") || ""),
      preferred_channel: String(formData.get("preferred_channel")),
      reminder_hours: Number(formData.get("reminder_hours")),
      branding_json: branding
    })
    .eq("id", business.id);
  revalidatePath("/panel");
  revalidatePath(`/${business.slug}`);
}
