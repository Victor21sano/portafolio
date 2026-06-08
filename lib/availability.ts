import { addMinutes, areIntervalsOverlapping, format, getDay, isBefore, max, min } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import type { Appointment, Business, Service, Slot, TimeOff, WorkingHour } from "./types";

type BusyBlock = { start: Date; end: Date };

function zonedDateTime(date: string, time: string, timezone: string) {
  return fromZonedTime(`${date}T${time.slice(0, 5)}:00`, timezone);
}

function overlapsAny(start: Date, end: Date, blocks: BusyBlock[]) {
  return blocks.some((block) => areIntervalsOverlapping({ start, end }, block, { inclusive: false }));
}

export function slotWindowForDate(date: string, timezone: string) {
  const start = fromZonedTime(`${date}T00:00:00`, timezone);
  const end = fromZonedTime(`${date}T23:59:59`, timezone);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function buildSlots(params: {
  business: Pick<Business, "timezone">;
  service: Pick<Service, "duracion_min">;
  date: string;
  workingHours: WorkingHour[];
  timeOff: TimeOff[];
  appointments: Appointment[];
}) {
  const { business, service, date, workingHours, timeOff, appointments } = params;
  const timezone = business.timezone;
  const targetDay = getDay(fromZonedTime(`${date}T12:00:00`, timezone));
  const dayHours = workingHours.filter((item) => item.dia_semana === targetDay);
  const now = new Date();

  const busyBlocks: BusyBlock[] = [
    ...timeOff.map((item) => ({ start: new Date(item.inicio_ts), end: new Date(item.fin_ts) })),
    ...appointments
      .filter((item) => item.estado === "pendiente" || item.estado === "confirmada")
      .map((item) => ({ start: new Date(item.inicio_ts), end: new Date(item.fin_ts) }))
  ];

  const slots: Slot[] = [];

  for (const hours of dayHours) {
    const open = zonedDateTime(date, hours.hora_inicio, timezone);
    const close = zonedDateTime(date, hours.hora_fin, timezone);
    let cursor = max([open, addMinutes(now, 15)]);

    const minute = Number(formatInTimeZone(cursor, timezone, "m"));
    if (minute % 15 !== 0) {
      cursor = addMinutes(cursor, 15 - (minute % 15));
    }

    while (isBefore(addMinutes(cursor, service.duracion_min), close) || addMinutes(cursor, service.duracion_min).getTime() === close.getTime()) {
      const end = addMinutes(cursor, service.duracion_min);
      const constrainedStart = max([cursor, open]);
      const constrainedEnd = min([end, close]);

      if (
        constrainedStart.getTime() === cursor.getTime() &&
        constrainedEnd.getTime() === end.getTime() &&
        !overlapsAny(cursor, end, busyBlocks)
      ) {
        slots.push({
          startUtc: cursor.toISOString(),
          endUtc: end.toISOString(),
          label: formatInTimeZone(cursor, timezone, "HH:mm")
        });
      }
      cursor = addMinutes(cursor, 15);
    }
  }

  return slots.sort((a, b) => a.startUtc.localeCompare(b.startUtc));
}

export function localDateForInput(iso: string, timezone: string) {
  return format(new Date(formatInTimeZone(new Date(iso), timezone, "yyyy-MM-dd'T'HH:mm:ss")), "yyyy-MM-dd");
}
