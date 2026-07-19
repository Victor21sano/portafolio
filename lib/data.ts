import { addDays } from "date-fns";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabase } from "./supabase";
import { buildSlots, slotWindowForDate } from "./availability";
import type { Appointment, Business, Service, Slot, TimeOff, WorkingHour } from "./types";

/** A trusted admin client by default; pass an RLS-bound client for the panel. */
type Db = SupabaseClient;

export async function getBusinessBySlug(slug: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("businesses").select("*").eq("slug", slug).single<Business>();
  if (error) return null;
  return data;
}

export async function getAllBusinesses() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at")
    .returns<Business[]>();
  if (error) throw error;
  return data;
}

export async function getBusinessServices(businessId: string, includeInactive = false, client?: Db) {
  const supabase = client ?? createServerSupabase();
  let query = supabase.from("services").select("*").eq("business_id", businessId).order("nombre");
  if (!includeInactive) query = query.eq("activo", true);
  const { data, error } = await query.returns<Service[]>();
  if (error) throw error;
  return data;
}

export async function getService(serviceId: string, client?: Db) {
  const supabase = client ?? createServerSupabase();
  const { data, error } = await supabase.from("services").select("*").eq("id", serviceId).single<Service>();
  if (error) throw error;
  return data;
}

export async function getWorkingHours(businessId: string, client?: Db, staffId?: string) {
  const supabase = client ?? createServerSupabase();
  let query = supabase
    .from("working_hours")
    .select("*")
    .eq("business_id", businessId)
    .order("dia_semana")
    .order("hora_inicio");
  if (staffId) query = query.eq("staff_id", staffId);
  const { data, error } = await query.returns<WorkingHour[]>();
  if (error) throw error;
  return data;
}

export async function getAppointmentsForRange(businessId: string, fromIso: string, toIso: string, client?: Db, staffId?: string) {
  const supabase = client ?? createServerSupabase();
  let query = supabase
    .from("appointments")
    .select("*, services(nombre, duracion_min, precio)")
    .eq("business_id", businessId)
    .lt("inicio_ts", toIso)
    .gt("fin_ts", fromIso)
    .order("inicio_ts");
  if (staffId) query = query.or(`staff_id.eq.${staffId},staff_id.is.null`);
  const { data, error } = await query.returns<Appointment[]>();
  if (error) throw error;
  return data;
}

export async function getTimeOffForRange(businessId: string, fromIso: string, toIso: string, client?: Db, staffId?: string) {
  const supabase = client ?? createServerSupabase();
  let query = supabase
    .from("time_off")
    .select("*")
    .eq("business_id", businessId)
    .lt("inicio_ts", toIso)
    .gt("fin_ts", fromIso)
    .order("inicio_ts");
  if (staffId) query = query.or(`staff_id.eq.${staffId},staff_id.is.null`);
  const { data, error } = await query.returns<TimeOff[]>();
  if (error) throw error;
  return data;
}

export async function getAvailableSlots(business: Business, service: Service, date: string, staffId?: string): Promise<Slot[]> {
  const { start, end } = slotWindowForDate(date, business.timezone);
  const [workingHours, timeOff, appointments] = await Promise.all([
    getWorkingHours(business.id, undefined, staffId),
    getTimeOffForRange(business.id, start, end, undefined, staffId),
    getAppointmentsForRange(business.id, start, end, undefined, staffId)
  ]);

  return buildSlots({ business, service, date, workingHours, timeOff, appointments });
}

export function defaultWeekRange() {
  const start = new Date();
  const end = addDays(start, 7);
  return { start: start.toISOString(), end: end.toISOString() };
}
