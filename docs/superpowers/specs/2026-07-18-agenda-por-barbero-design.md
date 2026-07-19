# Diseño: agenda real por barbero + datos reales de PATRÓN Barbería

Fecha: 2026-07-18
Rama: `agenda-por-barbero`
Cliente real: PATRÓN Barbería (Zabdiel Vázquez), demo `barberia-norte`.

## Objetivo

1. Disponibilidad real por barbero: cada barbero tiene sus horarios; al elegirlo, los slots mostrados son los suyos y la cita se guarda con su `staff_id`. Elegir barbero es **obligatorio** (decisión del usuario).
2. Datos reales del negocio: marca "PATRÓN BARBERÍA", dirección, teléfono, WhatsApp, Instagram, TikTok, horarios del local.

## Datos reales

- Barberos y horarios (dia_semana 0=domingo…6=sábado, convención `getDay`):
  - **Zabdiel**: lun(1), mar(2), mié(3), vie(5): 12:00–20:00 · jue(4), sáb(6): 12:00–15:00 · dom(0): 10:00–14:00
  - **Alejandro**: jue(4), vie(5), sáb(6): 15:30–20:00 · dom(0): 10:00–14:00
- Dirección: Avenida Salamanca 312 · Tel: 464 654 0934 (`tel:+524646540934`)
- WhatsApp: https://wa.me/message/OOBS3FU4ZLVSB1
- Instagram: https://www.instagram.com/p.a.t.r.o.n_b.a.r.b.e.r
- TikTok: https://www.tiktok.com/@p.a.t.r.o.n_barber
- Horario del local (footer): Lun–Sáb 12:00–8:00 pm · Dom 10:00 am–2:00 pm
- Fotos de barberos: placeholders actuales de `BARBER_IMAGES.team` (Zabdiel=team[0], Alejandro=team[1]) hasta recibir fotos reales. Especialidades placeholder: Zabdiel "Cortes y estilo", Alejandro "Fades y barba".

## Arquitectura (sin DDL — el esquema ya soporta todo)

### Datos (BD viva vía Auth Admin API + PostgREST; el esquema no cambia)

1. Crear 2 usuarios auth (`zabdiel@patronbarberia.test`, `alejandro@patronbarberia.test`, password aleatorio fuerte, email confirmado) → filas en `public.users` con `rol='staff'`, `business_id` de la barbería.
2. `working_hours`: borrar las filas genéricas de la barbería (staff_id null) e insertar las filas por barbero según la tabla de arriba.
3. `businesses.branding_json`: merge de `barberos: [{ id, nombre, especialidad, foto }]` (foto = URL unsplash de team). `nombre` → "Patrón Barbería"; `phone` → "+524646540934".
4. `db/seed.sql` se actualiza como documentación (nombre y comentario sobre staff; los usuarios auth no se pueden sembrar en SQL plano).

### Código

- **`lib/data.ts`** — `getAvailableSlots(business, service, date, staffId?)`: con `staffId`, `working_hours` se filtra `.eq("staff_id", staffId)` y `appointments`/`time_off` con `.or("staff_id.eq.<id>,staff_id.is.null")` (las citas/legacy sin staff bloquean a todos por seguridad). Sin `staffId`, comportamiento actual intacto (las otras 5 demos no cambian).
- **`app/actions.ts`** — `bookingSchema` acepta `staffId` (uuid opcional). La validación de disponibilidad pasa `staffId`. Si hay `staffId`: insert directo en `appointments` con el admin client (incluye `staff_id`, `estado='confirmada'`); error de exclusión (código 23P01) → "horario ocupado". Sin `staffId`: se mantiene la RPC actual.
- **`app/[slug]/agendar/page.tsx`** — lee `searchParams.barbero` (id de staff); valida que exista en `branding_json.barberos`; pasa `barbers` y `selectedBarber` al componente; llama `getAvailableSlots(..., selectedBarber)`. Si el nicho tiene barberos y no hay uno elegido, `slots=[]`.
- **`components/niche/types.ts`** — `NicheLayoutProps` + `barbers?: BarberInfo[]` y `selectedBarber?: string` (`BarberInfo = { id, nombre, especialidad, foto }` en `lib/types.ts`).
- **`components/barberia/BarberPicker.tsx`** — deja de tener datos hardcodeados: recibe `barbers`, `value` (id), `onChange`. Sin botón "Sin preferencia" (elección obligatoria). Mantiene tarjetas con foto/aria-pressed/fallback.
- **`components/barberia/BlackFoldAppointment.tsx`** — la selección navega (`router.push` con `?barbero=<id>&service&date`) para recalcular slots en el server (mismo patrón que servicio/fecha). Pasa `staffId` y `staffRequired` a `BookingForm`. Sin barbero elegido, el área de horarios muestra "Elige a tu barbero para ver horarios".
- **`components/BookingForm.tsx`** — props opcionales `staffId?: string` (hidden input `staffId`) y `staffRequired?: boolean` (deshabilita submit y oculta slots si falta). Sin impacto en las otras demos.
- **`components/barberia/BlackFoldLanding.tsx`** — logo "PATRÓN BARBERÍA", footer con dirección/tel/WhatsApp/IG/TikTok reales y horario del local; sección nosotros menciona a los 2 barberos. Header de citas y "Volver a" también con la marca con acento. `PortfolioBentoGallery` título "Patrón Barbería".

## Manejo de errores

- Barbero inválido en URL → se ignora (como servicio inválido: cae al estado "sin elegir").
- Doble reserva simultánea del mismo barbero → constraint de exclusión responde 23P01 → mensaje "Ese horario se ocupó…".
- Citas legacy sin staff bloquean a ambos barberos (conservador, correcto para citas viejas de la demo).

## Verificación (Playwright vs preview + producción)

- Lunes: Zabdiel muestra slots 12:00–20:00; Alejandro muestra "sin horarios".
- Jueves: Zabdiel slots dentro de 12–15; Alejandro dentro de 15:30–20.
- Sin barbero elegido: no hay slots y el submit está deshabilitado.
- Reserva completa con barbero → confirmación y cita con staff_id en BD.
- Las otras 5 demos siguen mostrando slots como antes (sin regresión).
- typecheck + lint verdes.

## Fuera de alcance

- Panel del profesional por barbero (filtros/vistas por staff) — iteración futura.
- Fotos reales de los barberos (se cambian 2 URLs cuando lleguen).
- Logo gráfico real (seguimos con logo tipográfico).
