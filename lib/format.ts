import { formatInTimeZone } from "date-fns-tz";

export function money(value: number | string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(Number(value));
}

export function dateLabel(iso: string, timezone: string) {
  return formatInTimeZone(new Date(iso), timezone, "EEEE d 'de' MMMM, HH:mm");
}

export function timeLabel(iso: string, timezone: string) {
  return formatInTimeZone(new Date(iso), timezone, "HH:mm");
}

export function inputDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function todayInTz(timezone: string) {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}

export function dateOnlyLabel(iso: string, timezone: string) {
  return formatInTimeZone(new Date(iso), timezone, "yyyy-MM-dd");
}
