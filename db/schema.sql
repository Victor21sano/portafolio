create extension if not exists btree_gist;

create type user_role as enum ('owner', 'staff');
create type appointment_status as enum ('pendiente', 'confirmada', 'cancelada', 'completada', 'no_show');
create type notification_type as enum ('confirmacion', 'recordatorio', 'aviso_profesional');

create table businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  nicho text not null,
  branding_json jsonb not null default '{}'::jsonb,
  timezone text not null default 'America/Mexico_City',
  politica_cancelacion text,
  owner_email text,
  phone text,
  reminder_hours integer not null default 24,
  preferred_channel text not null default 'email',
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  email text not null,
  rol user_role not null default 'owner',
  created_at timestamptz not null default now(),
  unique (business_id, email)
);

create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  nombre text not null,
  descripcion text,
  duracion_min integer not null check (duracion_min > 0),
  precio numeric(10, 2) not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table working_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  staff_id uuid references users(id) on delete set null,
  dia_semana integer not null check (dia_semana between 0 and 6),
  hora_inicio time not null,
  hora_fin time not null,
  check (hora_fin > hora_inicio)
);

create table time_off (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  staff_id uuid references users(id) on delete set null,
  inicio_ts timestamptz not null,
  fin_ts timestamptz not null,
  motivo text,
  created_at timestamptz not null default now(),
  check (fin_ts > inicio_ts)
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  staff_id uuid references users(id) on delete set null,
  service_id uuid not null references services(id) on delete restrict,
  cliente_nombre text not null,
  cliente_telefono text not null,
  cliente_email text,
  inicio_ts timestamptz not null,
  fin_ts timestamptz not null,
  estado appointment_status not null default 'confirmada',
  notas text,
  created_at timestamptz not null default now(),
  check (fin_ts > inicio_ts)
);

alter table appointments
  add constraint appointments_no_overlap
  exclude using gist (
    business_id with =,
    coalesce(staff_id, '00000000-0000-0000-0000-000000000000'::uuid) with =,
    tstzrange(inicio_ts, fin_ts, '[)') with &&
  )
  where (estado in ('pendiente', 'confirmada'));

create table notifications_log (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  canal text not null,
  tipo notification_type not null,
  estado text not null,
  enviado_ts timestamptz not null default now(),
  error text,
  unique (appointment_id, canal, tipo)
);

create index businesses_slug_idx on businesses(slug);
create index services_business_idx on services(business_id);
create index working_hours_business_day_idx on working_hours(business_id, dia_semana);
create index time_off_business_range_idx on time_off using gist (business_id, tstzrange(inicio_ts, fin_ts, '[)'));
create index appointments_business_start_idx on appointments(business_id, inicio_ts);

alter table businesses enable row level security;
alter table users enable row level security;
alter table services enable row level security;
alter table working_hours enable row level security;
alter table time_off enable row level security;
alter table appointments enable row level security;
alter table notifications_log enable row level security;

create or replace function current_business_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select business_id from public.users where id = auth.uid()
$$;

create policy "public can read active booking data"
on businesses for select
using (true);

create policy "public can read services"
on services for select
using (activo = true);

create policy "public can read working hours"
on working_hours for select
using (true);

create policy "public can read time off for availability"
on time_off for select
using (true);

create policy "public can read confirmed appointments for availability"
on appointments for select
using (estado in ('pendiente', 'confirmada'));

create policy "tenant users read own business"
on businesses for all
using (id = current_business_id())
with check (id = current_business_id());

create policy "tenant users read own users"
on users for all
using (business_id = current_business_id())
with check (business_id = current_business_id());

create policy "tenant users manage own services"
on services for all
using (business_id = current_business_id())
with check (business_id = current_business_id());

create policy "tenant users manage own working hours"
on working_hours for all
using (business_id = current_business_id())
with check (business_id = current_business_id());

create policy "tenant users manage own time off"
on time_off for all
using (business_id = current_business_id())
with check (business_id = current_business_id());

create policy "tenant users manage own appointments"
on appointments for all
using (business_id = current_business_id())
with check (business_id = current_business_id());

create policy "tenant users read own notification logs"
on notifications_log for select
using (
  exists (
    select 1 from appointments a
    where a.id = appointment_id and a.business_id = current_business_id()
  )
);

create or replace function create_public_appointment(
  p_business_id uuid,
  p_service_id uuid,
  p_cliente_nombre text,
  p_cliente_telefono text,
  p_cliente_email text,
  p_inicio_ts timestamptz,
  p_fin_ts timestamptz,
  p_notas text default null
)
returns appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  created appointments;
begin
  insert into appointments (
    business_id, service_id, cliente_nombre, cliente_telefono,
    cliente_email, inicio_ts, fin_ts, estado, notas
  )
  values (
    p_business_id, p_service_id, p_cliente_nombre, p_cliente_telefono,
    nullif(p_cliente_email, ''), p_inicio_ts, p_fin_ts, 'confirmada', p_notas
  )
  returning * into created;

  return created;
exception
  when exclusion_violation then
    raise exception 'slot_taken' using errcode = '23P01';
end;
$$;
