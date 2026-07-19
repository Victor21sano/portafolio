insert into businesses (
  id, slug, nombre, nicho, timezone, owner_email, phone, politica_cancelacion,
  preferred_channel, reminder_hours, branding_json
) values
(
  '11111111-1111-1111-1111-111111111111',
  'barberia-norte',
  'PatronBarber',
  'barberia',
  'America/Mexico_City',
  'dueno@barberianorte.test',
  '+525512345678',
  'Puedes cancelar o reagendar con 12 horas de anticipacion.',
  'email',
  24,
  '{
    "primary": "20 83 45",
    "accent": "217 119 6",
    "ink": "24 24 27",
    "paper": "250 250 249",
    "logo": "",
    "headline": "Cortes precisos sin esperar respuesta por WhatsApp",
    "subheadline": "Elige servicio, horario y confirma tu cita en menos de un minuto.",
    "cta": "Reservar corte",
    "appointmentName": "cita",
    "font": "Inter"
  }'::jsonb
)
on conflict (slug) do nothing;

insert into services (business_id, nombre, descripcion, duracion_min, precio, activo) values
('11111111-1111-1111-1111-111111111111', 'Corte de cabello', 'Corte a tu medida con acabado limpio.', 45, 185, true),
('11111111-1111-1111-1111-111111111111', 'Delineado de barba', 'Perfilado preciso con toalla caliente.', 30, 120, true),
('11111111-1111-1111-1111-111111111111', 'Delineado de ceja', 'Linea limpia que enmarca el rostro.', 15, 50, true),
('11111111-1111-1111-1111-111111111111', 'Grecas y disenos', 'Disenos freestyle y grecas con detalle fino.', 30, 50, true),
('11111111-1111-1111-1111-111111111111', 'Pigmentacion', 'Rellena y define zonas despobladas.', 30, 30, true)
on conflict do nothing;

insert into working_hours (business_id, dia_semana, hora_inicio, hora_fin)
select '11111111-1111-1111-1111-111111111111', d, '09:00'::time, '18:00'::time
from generate_series(1, 6) as d
on conflict do nothing;

insert into businesses (
  id, slug, nombre, nicho, timezone, owner_email, phone, politica_cancelacion,
  preferred_channel, reminder_hours, branding_json
) values
(
  '22222222-2222-2222-2222-222222222222',
  'lashes-luna',
  'Lashes Luna',
  'lashista',
  'America/Mexico_City',
  'hola@lashesluna.test',
  '+525576543210',
  'Reagenda con 24 horas de anticipacion.',
  'email',
  24,
  '{
    "primary": "126 34 66",
    "accent": "13 148 136",
    "ink": "39 39 42",
    "paper": "255 251 245",
    "headline": "Agenda tus pestanas con horario confirmado",
    "subheadline": "Selecciona tecnica, fecha y hora sin intercambio de mensajes.",
    "cta": "Reservar sesion",
    "appointmentName": "sesion",
    "font": "Inter"
  }'::jsonb
)
on conflict (slug) do nothing;

insert into services (business_id, nombre, descripcion, duracion_min, precio, activo) values
('22222222-2222-2222-2222-222222222222', 'Set clasico', 'Aplicacion natural pelo a pelo.', 120, 650, true),
('22222222-2222-2222-2222-222222222222', 'Retoque volumen', 'Mantenimiento para sets de volumen.', 90, 450, true),
('22222222-2222-2222-2222-222222222222', 'Lifting de pestanas', 'Rizado y tinte semipermanente.', 75, 380, true)
on conflict do nothing;

insert into working_hours (business_id, dia_semana, hora_inicio, hora_fin)
select '22222222-2222-2222-2222-222222222222', d, '10:00'::time, '19:00'::time
from generate_series(2, 6) as d
on conflict do nothing;
