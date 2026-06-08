export type Json = Record<string, unknown>;

export type Branding = {
  primary?: string;
  accent?: string;
  ink?: string;
  paper?: string;
  logo?: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
  appointmentName?: string;
  font?: string;
};

export type Business = {
  id: string;
  slug: string;
  nombre: string;
  nicho: string;
  branding_json: Branding;
  timezone: string;
  politica_cancelacion: string | null;
  owner_email: string | null;
  phone: string | null;
  reminder_hours: number;
  preferred_channel: string;
  created_at: string;
};

export type Service = {
  id: string;
  business_id: string;
  nombre: string;
  descripcion: string | null;
  duracion_min: number;
  precio: number;
  activo: boolean;
};

export type WorkingHour = {
  id: string;
  business_id: string;
  staff_id: string | null;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
};

export type TimeOff = {
  id: string;
  business_id: string;
  staff_id: string | null;
  inicio_ts: string;
  fin_ts: string;
  motivo: string | null;
};

export type AppointmentStatus = "pendiente" | "confirmada" | "cancelada" | "completada" | "no_show";

export type Appointment = {
  id: string;
  business_id: string;
  staff_id: string | null;
  service_id: string;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_email: string | null;
  inicio_ts: string;
  fin_ts: string;
  estado: AppointmentStatus;
  notas: string | null;
  created_at: string;
  services?: Pick<Service, "nombre" | "duracion_min" | "precio"> | null;
};

export type Slot = {
  startUtc: string;
  endUtc: string;
  label: string;
};
