import Link from "next/link";
import { addDays } from "date-fns";
import { CalendarPlus, Clock, XCircle } from "lucide-react";
import {
  createManualAppointment,
  createTimeOff,
  deleteTimeOff,
  updateAppointmentStatus,
  updateBusinessSettings,
  upsertService
} from "@/app/actions";
import {
  defaultWeekRange,
  getAppointmentsForRange,
  getBusinessServices,
  getTimeOffForRange,
  getWorkingHours
} from "@/lib/data";
import { getAuthenticatedBusiness } from "@/lib/auth";
import { signOut } from "@/app/auth-actions";
import { dateLabel, dateOnlyLabel, money, timeLabel, todayInTz } from "@/lib/format";
import { themeVars } from "@/lib/theme";
import type { Business } from "@/lib/types";

export const dynamic = "force-dynamic";

const dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

export default async function PanelPage() {
  const { business, supabase } = await getAuthenticatedBusiness();
  const range = defaultWeekRange();
  const [appointments, services, timeOff, workingHours] = await Promise.all([
    getAppointmentsForRange(business.id, range.start, range.end, supabase),
    getBusinessServices(business.id, true, supabase),
    getTimeOffForRange(business.id, range.start, range.end, supabase),
    getWorkingHours(business.id, supabase)
  ]);

  const todayKey = todayInTz(business.timezone);
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(new Date(`${todayKey}T12:00:00Z`), index).toISOString().slice(0, 10)
  );

  return (
    <main style={themeVars(business.branding_json)} className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="label">Panel profesional</p>
            <h1 className="text-2xl font-semibold text-zinc-950">{business.nombre}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link className="btn btn-secondary" href={`/${business.slug}`}>Ver pagina publica</Link>
            <form action={signOut}>
              <button className="btn btn-secondary">Cerrar sesion</button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <div>
                <p className="label">Agenda</p>
                <h2 className="text-xl font-semibold text-zinc-950">Proximos 7 dias</h2>
              </div>
              <Clock className="text-brand" size={22} />
            </div>
            <div className="grid divide-y divide-zinc-200">
              {weekDays.map((dayKey) => {
                const dayWeekday = new Date(`${dayKey}T12:00:00Z`).getUTCDay();
                const dayAppointments = appointments.filter(
                  (item) => dateOnlyLabel(item.inicio_ts, business.timezone) === dayKey
                );
                return (
                  <div key={dayKey} className="grid gap-4 p-5 md:grid-cols-[160px_1fr]">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950">{dayNames[dayWeekday]}</p>
                      <p className="text-sm text-zinc-500">{dayKey}</p>
                    </div>
                    <div className="space-y-3">
                      {dayAppointments.length === 0 ? (
                        <p className="text-sm text-zinc-500">Sin citas.</p>
                      ) : (
                        dayAppointments.map((appointment) => (
                          <div key={appointment.id} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-zinc-950">
                                  {timeLabel(appointment.inicio_ts, business.timezone)} · {appointment.services?.nombre}
                                </p>
                                <p className="text-sm text-zinc-600">
                                  {appointment.cliente_nombre} · {appointment.cliente_telefono}
                                </p>
                              </div>
                              <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-zinc-600">
                                {appointment.estado}
                              </span>
                            </div>
                            <form action={updateAppointmentStatus} className="mt-3 flex flex-wrap gap-2">
                              <input type="hidden" name="id" value={appointment.id} />
                              {["completada", "no_show", "cancelada"].map((estado) => (
                                <button key={estado} className="btn btn-secondary h-9 px-3" name="estado" value={estado}>
                                  {estado}
                                </button>
                              ))}
                            </form>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ManualAppointmentForm services={services} />
            <TimeOffPanel timeOff={timeOff} timezone={business.timezone} />
          </div>
        </section>

        <aside className="space-y-6">
          <SettingsPanel business={business} />
          <ServicesPanel services={services} />
          <div className="card p-5">
            <p className="label">Horario semanal</p>
            <div className="mt-3 space-y-2">
              {workingHours.map((hour) => (
                <div key={hour.id} className="flex items-center justify-between rounded-md bg-zinc-100 px-3 py-2 text-sm">
                  <span>{dayNames[hour.dia_semana]}</span>
                  <strong>{hour.hora_inicio.slice(0, 5)} - {hour.hora_fin.slice(0, 5)}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ManualAppointmentForm({ services }: { services: Awaited<ReturnType<typeof getBusinessServices>> }) {
  return (
    <form action={createManualAppointment} className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="label">Cita manual</p>
          <h2 className="text-lg font-semibold text-zinc-950">Crear cita</h2>
        </div>
        <CalendarPlus className="text-brand" size={22} />
      </div>
      <div className="grid gap-3">
        <select className="field" name="serviceId" required>
          {services.filter((item) => item.activo).map((service) => (
            <option key={service.id} value={service.id}>{service.nombre}</option>
          ))}
        </select>
        <input className="field" name="inicio" type="datetime-local" required />
        <input className="field" name="nombre" placeholder="Cliente" required />
        <input className="field" name="telefono" placeholder="Telefono" required />
        <input className="field" name="email" type="email" placeholder="Email opcional" />
        <textarea className="field min-h-24 py-3" name="notas" placeholder="Notas" />
        <button className="btn btn-primary">Crear cita</button>
      </div>
    </form>
  );
}

function TimeOffPanel({ timeOff, timezone }: { timeOff: Awaited<ReturnType<typeof getTimeOffForRange>>; timezone: string }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="label">Bloqueos</p>
          <h2 className="text-lg font-semibold text-zinc-950">Descansos y vacaciones</h2>
        </div>
        <XCircle className="text-accent" size={22} />
      </div>
      <form action={createTimeOff} className="grid gap-3">
        <input className="field" name="inicio" type="datetime-local" required />
        <input className="field" name="fin" type="datetime-local" required />
        <input className="field" name="motivo" placeholder="Motivo" />
        <button className="btn btn-primary">Bloquear horario</button>
      </form>
      <div className="mt-5 space-y-2">
        {timeOff.map((item) => (
          <div key={item.id} className="rounded-md border border-zinc-200 p-3">
            <p className="text-sm font-semibold">{item.motivo}</p>
            <p className="text-xs text-zinc-500">{dateLabel(item.inicio_ts, timezone)} - {timeLabel(item.fin_ts, timezone)}</p>
            <form action={deleteTimeOff} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
              <button className="text-sm font-semibold text-red-600">Eliminar</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel({ business }: { business: Business }) {
  const branding = business.branding_json;
  return (
    <form action={updateBusinessSettings} className="card p-5">
      <p className="label">Configuracion</p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-950">Negocio y marca</h2>
      <div className="mt-4 grid gap-3">
        <input className="field" name="nombre" defaultValue={business.nombre} />
        <input className="field" name="timezone" defaultValue={business.timezone} />
        <select className="field" name="preferred_channel" defaultValue={business.preferred_channel}>
          <option value="console">Console</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
        <input className="field" name="reminder_hours" type="number" min={1} defaultValue={business.reminder_hours} />
        <input className="field" name="primary" defaultValue={branding.primary ?? ""} placeholder="RGB primario: 20 83 45" />
        <input className="field" name="accent" defaultValue={branding.accent ?? ""} placeholder="RGB acento: 217 119 6" />
        <input className="field" name="headline" defaultValue={branding.headline ?? ""} />
        <input className="field" name="subheadline" defaultValue={branding.subheadline ?? ""} />
        <input className="field" name="cta" defaultValue={branding.cta ?? ""} />
        <input className="field" name="appointmentName" defaultValue={branding.appointmentName ?? "cita"} />
        <textarea className="field min-h-24 py-3" name="politica_cancelacion" defaultValue={business.politica_cancelacion ?? ""} />
        <button className="btn btn-primary">Guardar cambios</button>
      </div>
    </form>
  );
}

function ServicesPanel({ services }: { services: Awaited<ReturnType<typeof getBusinessServices>> }) {
  return (
    <div className="card p-5">
      <p className="label">Servicios</p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-950">Catalogo</h2>
      <div className="mt-4 space-y-4">
        {services.map((service) => (
          <form key={service.id} action={upsertService} className="rounded-md border border-zinc-200 p-3">
            <input type="hidden" name="id" value={service.id} />
            <div className="grid gap-2">
              <input className="field" name="nombre" defaultValue={service.nombre} />
              <input className="field" name="descripcion" defaultValue={service.descripcion ?? ""} />
              <div className="grid grid-cols-2 gap-2">
                <input className="field" name="duracion_min" type="number" min={15} defaultValue={service.duracion_min} />
                <input className="field" name="precio" type="number" min={0} defaultValue={service.precio} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input name="activo" type="checkbox" defaultChecked={service.activo} />
                Activo · {money(service.precio)}
              </label>
              <button className="btn btn-secondary">Guardar servicio</button>
            </div>
          </form>
        ))}
        <form action={upsertService} className="rounded-md border border-dashed border-zinc-300 p-3">
          <div className="grid gap-2">
            <input className="field" name="nombre" placeholder="Nuevo servicio" required />
            <input className="field" name="descripcion" placeholder="Descripcion" />
            <div className="grid grid-cols-2 gap-2">
              <input className="field" name="duracion_min" type="number" min={15} defaultValue={45} />
              <input className="field" name="precio" type="number" min={0} defaultValue={0} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input name="activo" type="checkbox" defaultChecked />
              Activo
            </label>
            <button className="btn btn-primary">Agregar servicio</button>
          </div>
        </form>
      </div>
    </div>
  );
}
