# Portafolio de apps de reservas

Sitio publicado: https://portafolio2103aresdev.vercel.app/

Portafolio visual de landings y flujos de reserva para negocios de servicios. Incluye demos con identidad propia para barberia, uñas, pestañas, clínica médica, terapia y viajes.
También incluye demos ecommerce con dashboard de productos, carrito persistente y métodos de pago.

## Demos principales

- Home: https://portafolio2103aresdev.vercel.app/
- Barbería: https://portafolio2103aresdev.vercel.app/barberia-norte
- Uñas: https://portafolio2103aresdev.vercel.app/glow-nails
- Pestañas: https://portafolio2103aresdev.vercel.app/lashes-luna
- Clínica: https://portafolio2103aresdev.vercel.app/clinica-vida
- Terapia: https://portafolio2103aresdev.vercel.app/espacio-calma
- Viajes: https://portafolio2103aresdev.vercel.app/ruta-viva-mx
- Ecommerce moda: https://portafolio2103aresdev.vercel.app/ecommerce/atelier-musa
- Ecommerce tecnología: https://portafolio2103aresdev.vercel.app/ecommerce/voltix-lab
- Ecommerce artesanal: https://portafolio2103aresdev.vercel.app/ecommerce/mercado-raiz

## Enfoque visual

- Cada rubro usa composición, color, tipografía e imágenes distintas.
- Las landings evitan verse como una plantilla recoloreada.
- Los flujos de reserva están diseñados para móvil y desktop.
- Las imágenes son fijas y curadas por contexto, no placeholders aleatorios.
- Los ecommerce comparten motor de carrito, pero cada demo cambia estructura visual, tono y jerarquía.

## Base técnica

MVP de portafolio para reservas self-service por negocio: pagina publica, calculo de disponibilidad real, panel profesional, bloqueos, recordatorios y branding desde `businesses.branding_json`.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Supabase Postgres/Auth/RLS
- Notificaciones intercambiables: console, Resend o Twilio WhatsApp
- Vercel Cron para recordatorios

## Arranque local

1. Instala dependencias:

```bash
npm install
```

2. Copia variables:

```bash
cp .env.example .env.local
```

3. Crea un proyecto Supabase y ejecuta:

```bash
db/schema.sql
db/seed.sql
```

4. Completa `.env.local` con `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.

5. Levanta:

```bash
npm run dev
```

Rutas demo:

- `/barberia-norte`: reserva publica.
- `/lashes-luna`: segundo nicho con branding distinto.
- `/panel`: panel operativo usando `DEMO_BUSINESS_SLUG` o `barberia-norte`.

## Anti doble reserva

`appointments_no_overlap` usa `EXCLUDE USING gist` sobre `business_id`, `staff_id` y `tstzrange(inicio_ts, fin_ts, '[)')`. Si dos confirmaciones llegan al mismo tiempo, Postgres rechaza la segunda aunque la UI se haya quedado desactualizada.

Prueba manual en Supabase:

```sql
insert into appointments (business_id, service_id, cliente_nombre, cliente_telefono, inicio_ts, fin_ts)
select '11111111-1111-1111-1111-111111111111', id, 'A', '555', '2026-06-08 15:00+00', '2026-06-08 15:45+00'
from services where business_id = '11111111-1111-1111-1111-111111111111' limit 1;

insert into appointments (business_id, service_id, cliente_nombre, cliente_telefono, inicio_ts, fin_ts)
select '11111111-1111-1111-1111-111111111111', id, 'B', '555', '2026-06-08 15:15+00', '2026-06-08 16:00+00'
from services where business_id = '11111111-1111-1111-1111-111111111111' limit 1;
```

La segunda insercion debe fallar por solapamiento.

## Alta de nuevo negocio en menos de 10 minutos

1. Inserta una fila en `businesses` con `slug`, `nombre`, `nicho`, `timezone`, `owner_email` y `branding_json`.
2. Usa uno de estos presets como base: `barberia`, `lashista`, `manicurista`, `medico`, `terapeuta`.
3. Inserta sus `services`.
4. Inserta `working_hours` con `dia_semana` de 0 a 6.
5. Abre `/{slug}`. El branding y textos se toman de la base de datos sin recompilar.

Ejemplo de `branding_json`:

```json
{
  "primary": "14 116 144",
  "accent": "101 163 13",
  "headline": "Consulta disponible con confirmacion inmediata",
  "subheadline": "Elige fecha y hora sin llamadas.",
  "cta": "Agendar consulta",
  "appointmentName": "consulta"
}
```

## Notificaciones

`NOTIFIER_PROVIDER=console` registra envios en consola. Para correo usa `email` con `RESEND_API_KEY`; para WhatsApp usa `whatsapp` con credenciales Twilio.

El cron llama `GET /api/cron/reminders` una vez al dia en Vercel Hobby. Protegelo con:

```bash
CRON_SECRET=un-secreto
```

y envia `Authorization: Bearer un-secreto` al probarlo manualmente.
