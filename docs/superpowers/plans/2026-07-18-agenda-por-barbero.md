# Agenda por barbero + datos reales PATRÓN Barbería — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Disponibilidad real por barbero (obligatorio elegir) y datos reales del negocio en la demo barberia-norte.

**Architecture:** El esquema ya soporta staff (`staff_id` en working_hours/time_off/appointments). Los barberos como filas de `users` (rol staff) con horarios propios en `working_hours`; presentación (nombre/foto) en `businesses.branding_json.barberos`. La página de agendar recalcula slots en el server con `?barbero=<staffId>`; la reserva inserta con `staff_id`. Sin DDL.

**Tech Stack:** Next.js App Router + TS + Tailwind, Supabase (PostgREST + Auth Admin API), playwright-core/chromium.

## Global Constraints

- Copy en español; marca "PATRÓN BARBERÍA" (con acentos); paleta BLACK FOLD (#C9A227, #0B0B0B, #141414, var(--font-oswald)).
- Sin cambios en `db/schema.sql` (nada de DDL); las otras 5 demos de reservas NO cambian de comportamiento (los params nuevos son opcionales).
- `npm run typecheck && npm run lint` (eslint --max-warnings=0) verdes en cada task; no hay tests ni dev local (env en `.env.local` existe pero la verificación de runtime es contra preview de Vercel).
- dia_semana: 0=domingo … 6=sábado (convención `getDay` de date-fns, usada por `buildSlots`).
- Zabdiel: días 1,2,3,5 → 12:00–20:00; días 4,6 → 12:00–15:00; día 0 → 10:00–14:00. Alejandro: días 4,5,6 → 15:30–20:00; día 0 → 10:00–14:00.
- Datos de contacto exactos: Avenida Salamanca 312 · tel +524646540934 (mostrar "464 654 0934") · WhatsApp https://wa.me/message/OOBS3FU4ZLVSB1 · Instagram https://www.instagram.com/p.a.t.r.o.n_b.a.r.b.e.r · TikTok https://www.tiktok.com/@p.a.t.r.o.n_barber · Horario local: Lun–Sáb 12:00–8:00 pm, Dom 10:00 am–2:00 pm.
- Repo `~/Proyectos/portafolio`, rama `agenda-por-barbero`. Commits con Co-Authored-By Claude.

---

### Task 1: Disponibilidad staff-aware en lib

**Files:**
- Modify: `lib/types.ts` (agregar tipo), `lib/data.ts` (párametro staffId)

**Interfaces:**
- Produces: `BarberInfo = { id: string; nombre: string; especialidad: string; foto: string }` exportado de `lib/types.ts`; `getAvailableSlots(business, service, date, staffId?: string)`; `getWorkingHours(businessId, client?, staffId?)`; `getAppointmentsForRange(businessId, from, to, client?, staffId?)`; `getTimeOffForRange(businessId, from, to, client?, staffId?)`.

- [ ] **Step 1: Agregar `BarberInfo` a `lib/types.ts`** (junto a los demás tipos):

```ts
/** Presentación de un barbero/staff (vive en businesses.branding_json.barberos). */
export type BarberInfo = {
  id: string;
  nombre: string;
  especialidad: string;
  foto: string;
};
```

- [ ] **Step 2: Filtros por staff en `lib/data.ts`**

`getWorkingHours` — nueva firma y filtro:
```ts
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
```

`getAppointmentsForRange` — agregar param `staffId?: string` al final; tras los `.gt(...)` existentes:
```ts
  if (staffId) query = query.or(`staff_id.eq.${staffId},staff_id.is.null`);
```
(convertir a `let query = ...` + `const { data, error } = await query...` como en getWorkingHours). Las citas sin staff (legacy) bloquean a todos: conservador y correcto.

`getTimeOffForRange` — mismo patrón `.or(...)` con param `staffId?: string`.

`getAvailableSlots` — firma `getAvailableSlots(business, service, date, staffId?: string)`; pasar `staffId` a las tres llamadas:
```ts
  const [workingHours, timeOff, appointments] = await Promise.all([
    getWorkingHours(business.id, undefined, staffId),
    getTimeOffForRange(business.id, start, end, undefined, staffId),
    getAppointmentsForRange(business.id, start, end, undefined, staffId)
  ]);
```

- [ ] **Step 3: `npm run typecheck && npm run lint`** → verdes.
- [ ] **Step 4: Commit** `feat: disponibilidad filtrable por barbero en lib de datos`

---

### Task 2: Reserva con staff_id en createBooking

**Files:**
- Modify: `app/actions.ts` (bookingSchema y createBooking)

**Interfaces:**
- Consumes: `getAvailableSlots(..., staffId)` (Task 1).
- Produces: `createBooking` acepta campo de formulario `staffId` (uuid o vacío); con staff hace insert directo con `staff_id` y `estado='confirmada'`; valida que el staffId esté en `business.branding_json.barberos`.

- [ ] **Step 1: Schema** — en `bookingSchema` agregar:
```ts
  staffId: z.string().uuid().optional().or(z.literal(""))
```

- [ ] **Step 2: Lógica en `createBooking`** — tras validar `service.business_id`:
```ts
  const staffId = input.staffId || undefined;
  const barberos: { id: string }[] = business.branding_json?.barberos ?? [];
  if (staffId && !barberos.some((b) => b.id === staffId)) {
    return { ok: false, message: "Barbero inválido." };
  }
  if (!staffId && barberos.length > 0) {
    return { ok: false, message: "Elige a tu barbero." };
  }
```
La verificación de disponibilidad pasa el staff: `getAvailableSlots(business, service, date, staffId)`.

Reemplazar el bloque del RPC por:
```ts
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
```
(el constraint de exclusión cubre la carrera; 23P01 cae en este mismo mensaje).

- [ ] **Step 3: typecheck + lint** → verdes.
- [ ] **Step 4: Commit** `feat: reservas públicas con barbero asignado (staff_id)`

---

### Task 3: Página de agendar staff-aware + tipos de nicho

**Files:**
- Modify: `app/[slug]/agendar/page.tsx`, `components/niche/types.ts`

**Interfaces:**
- Consumes: `BarberInfo`, `getAvailableSlots(..., staffId)` (Task 1).
- Produces: `NicheLayoutProps` con `barbers?: BarberInfo[]` y `selectedBarber?: string`; la página pasa ambos y solo calcula slots si (no hay barberos) o (hay barbero elegido válido). URL param: `barbero`.

- [ ] **Step 1: `components/niche/types.ts`**
```ts
import type { BarberInfo, Business, Service, Slot } from "@/lib/types";
// ...
export type NicheLayoutProps = {
  business: Business;
  services: Service[];
  selectedService: Service | null;
  selectedDate: string;
  slots: Slot[];
  design: NicheDesign;
  appointmentName: string;
  /** Barberos/staff reales (branding_json.barberos). Si existen, elegir es obligatorio. */
  barbers?: BarberInfo[];
  /** staff_id elegido (validado contra barbers). */
  selectedBarber?: string;
};
```

- [ ] **Step 2: `app/[slug]/agendar/page.tsx`**
```ts
  searchParams: Promise<{ service?: string; date?: string; barbero?: string }>;
```
y en el cuerpo (tras `selectedDate`):
```ts
  const barbers: BarberInfo[] = business.branding_json?.barberos ?? [];
  const selectedBarber = barbers.find((b) => b.id === query.barbero)?.id;
  const needsBarber = barbers.length > 0 && !selectedBarber;
  const slots =
    selectedService && !needsBarber
      ? await getAvailableSlots(business, selectedService, selectedDate, selectedBarber)
      : [];
```
y pasar `barbers={barbers} selectedBarber={selectedBarber}` al `<Component>`. Importar `BarberInfo` de `@/lib/types`.

- [ ] **Step 3: typecheck + lint** → verdes.
- [ ] **Step 4: Commit** `feat: página de agendar con barbero en la URL`

---

### Task 4: BarberPicker desde datos reales + BookingForm con staff

**Files:**
- Modify: `components/barberia/BarberPicker.tsx` (reescritura), `components/barberia/BlackFoldAppointment.tsx`, `components/BookingForm.tsx`

**Interfaces:**
- Consumes: `NicheLayoutProps.barbers/selectedBarber` (Task 3), `BarberInfo` (Task 1).
- Produces: `BarberPicker({ barbers, value, onChange })`; `BookingForm` acepta `staffId?: string` (hidden input `staffId` + preserva `barbero` al navegar) y `staffRequired?: boolean` (bloquea slots y submit sin staff).

- [ ] **Step 1: Reescribir `components/barberia/BarberPicker.tsx`**
```tsx
"use client";

import Image from "next/image";
import { Scissors } from "lucide-react";
import type { BarberInfo } from "@/lib/types";

const GOLD = "#C9A227";

/** Selector de barbero obligatorio. La cita se guarda con su staff_id. */
export function BarberPicker({ barbers, value, onChange }: { barbers: BarberInfo[]; value?: string; onChange: (id: string) => void }) {
  return (
    <section aria-label="Elige tu barbero" className="mb-8">
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A9A9A]">
        <Scissors size={14} style={{ color: GOLD }} /> Elige tu barbero
      </p>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:gap-4">
        {barbers.map((b) => {
          const active = value === b.id;
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(b.id)}
              className="group overflow-hidden rounded-xl border bg-[#141414] text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: active ? GOLD : "rgba(255,255,255,0.1)",
                boxShadow: active ? "0 0 0 1px #C9A227, 0 12px 30px rgba(0,0,0,0.5)" : "none",
                outlineColor: GOLD
              }}
            >
              <span className="relative block aspect-[4/5] w-full overflow-hidden bg-[#141414]">
                {/* Fallback visible si la foto no carga: el flujo nunca se bloquea. */}
                <span className="absolute inset-0 grid place-items-center text-white/15">
                  <Scissors size={28} />
                </span>
                <Image src={b.foto} alt={`Barbero ${b.nombre}`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
              </span>
              <span className="block px-2.5 py-2 sm:px-3.5 sm:py-3">
                <span
                  className="block truncate text-sm font-semibold uppercase sm:text-base"
                  style={{ fontFamily: "var(--font-oswald)", color: active ? GOLD : "#F5F5F5" }}
                >
                  {b.nombre}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-[#8A8A8A] sm:text-xs">{b.especialidad}</span>
              </span>
            </button>
          );
        })}
      </div>
      {!value ? (
        <p className="mt-4 text-center text-sm text-[#9A9A9A]">Elige a tu barbero para ver sus horarios disponibles.</p>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 2: `BlackFoldAppointment.tsx`** — quitar `useState` de barbero; usar navegación (mismo patrón que servicio/fecha):
```tsx
import { useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
```
En el componente (recibe ya `barbers` y `selectedBarber` vía props — actualizar el destructuring de `NicheLayoutProps` para incluirlos):
```tsx
  const router = useRouter();
  function pickBarber(id: string) {
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService.id);
    params.set("date", selectedDate);
    params.set("barbero", id);
    router.push(`?${params.toString()}`, { scroll: false });
  }
```
Render:
```tsx
        <div ref={card}>
          <BarberPicker barbers={barbers ?? []} value={selectedBarber} onChange={pickBarber} />
          <BookingForm
            business={business}
            services={services}
            selectedService={selectedService}
            selectedDate={selectedDate}
            slots={slots}
            design={design}
            appointmentName={appointmentName}
            dark
            staffId={selectedBarber}
            staffRequired
            commentsField
          />
        </div>
```
(se elimina `extraNote`: el barbero ya viaja como staff_id real).

- [ ] **Step 3: `components/BookingForm.tsx`** — cambios puntuales:

Props (agregar a la firma y al tipo):
```ts
  staffId,
  staffRequired = false,
  // ...
  /** staff_id del barbero elegido; viaja como hidden input y se preserva al navegar. */
  staffId?: string;
  /** Si true, no se muestran horarios ni se puede enviar sin staffId. */
  staffRequired?: boolean;
```

Hidden input junto a los existentes:
```tsx
        <input type="hidden" name="staffId" value={staffId ?? ""} />
```

`navigate()` preserva el barbero:
```ts
  function navigate(next: { service?: string; date?: string }) {
    const params = new URLSearchParams();
    params.set("service", next.service ?? selectedService?.id ?? "");
    params.set("date", next.date ?? selectedDate);
    if (staffId) params.set("barbero", staffId);
    startNav(() => router.push(`?${params.toString()}`, { scroll: false }));
  }
```

Reset de slot al cambiar staff — ampliar deps del useEffect existente:
```ts
  }, [selectedService?.id, selectedDate, slotShift, staffId]);
```

Zona de horarios — dentro del `min-h-[88px]`, antes del AnimatePresence, cortocircuito:
```tsx
        <div className="min-h-[88px]">
          {staffRequired && !staffId ? (
            <div
              className="flex items-center gap-3 px-4 py-5 text-sm"
              style={{ borderRadius: radius, backgroundColor: dark ? "rgb(39 39 42)" : "rgb(244 244 245)", color: dark ? "rgb(161 161 170)" : "rgb(82 82 91)" }}
            >
              <Clock size={18} /> Elige a tu barbero para ver los horarios.
            </div>
          ) : (
            <>
              {/* AnimatePresence + aviso de "sin horarios" existentes, sin cambios */}
            </>
          )}
        </div>
```
(envolver el contenido actual en el fragmento `<>...</>`; el aviso amarillo de "No hay horarios" queda dentro del else).

Submit deshabilitado y label:
```tsx
          disabled={pending || !selectedService || (staffRequired && !staffId) || visibleSlots.length === 0 || !selectedSlot}
```
y en el contenido del botón, primera condición:
```tsx
          {pending ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Confirmando…
            </>
          ) : staffRequired && !staffId ? (
            "Elige un barbero"
          ) : selectedSlot ? (
```

- [ ] **Step 4: typecheck + lint** → verdes.
- [ ] **Step 5: Commit** `feat: selector de barbero obligatorio conectado a disponibilidad real`

---

### Task 5: Marca y datos reales en la landing

**Files:**
- Modify: `components/barberia/BlackFoldLanding.tsx`, `components/barberia/BlackFoldAppointment.tsx` (solo textos), `components/PortfolioBentoGallery.tsx`, `db/seed.sql`

**Interfaces:** ninguna (contenido).

- [ ] **Step 1: Logo y marca** — en ambos componentes de barbería reemplazar TODAS las apariciones:
  - `PATRON<span style={{ color: GOLD }}>BARBER</span>` → `PATRÓN<span style={{ color: GOLD }}>BARBERÍA</span>`
  - `← Volver a PATRON BARBER` → `← Volver a PATRÓN BARBERÍA`
  - `alt="Barbería PATRON BARBER"` → `alt="PATRÓN Barbería"`; `alt="Barbero realizando un corte en PATRON BARBER"` → `alt="Barbero realizando un corte en PATRÓN Barbería"`
  - `<strong className="text-white">PATRON BARBER</strong>` → `<strong className="text-white">PATRÓN BARBERÍA</strong>`
  - copyright: `© {año} PATRÓN BARBERÍA. Todos los derechos reservados.`

- [ ] **Step 2: Sobre nosotros** — reemplazar el párrafo por:
```tsx
            <p className="mt-6 text-lg leading-8 text-[#B9B9B9]">
              En <strong className="text-white">PATRÓN BARBERÍA</strong> combinamos técnica, estilo y precisión.
              Zabdiel y Alejandro te atienden con cita para que tu corte salga como lo imaginas, sin esperas.
            </p>
```

- [ ] **Step 3: Footer real** — bloque Contacto:
```tsx
          <div className="text-sm text-[#B9B9B9]">
            <p className="mb-3 font-semibold uppercase tracking-wider text-white">Contacto</p>
            <p className="flex items-center gap-2"><MapPin size={15} style={{ color: GOLD }} /> Avenida Salamanca 312</p>
            <a href="tel:+524646540934" className="mt-2 flex items-center gap-2 transition hover:text-white"><Phone size={15} style={{ color: GOLD }} /> 464 654 0934</a>
            <a href="https://wa.me/message/OOBS3FU4ZLVSB1" target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 transition hover:text-white"><MessageCircle size={15} style={{ color: GOLD }} /> WhatsApp</a>
          </div>
```
Bloque Horario:
```tsx
            <p>Lun – Sáb · 12:00 – 8:00 pm</p>
            <p className="mt-1">Domingo · 10:00 am – 2:00 pm</p>
```
(eliminar la tercera línea "Domingo · Cerrado").
Bloque Síguenos — enlaces reales (Instagram y TikTok; lucide no tiene ícono de TikTok, usar `Music2` con aria-label):
```tsx
            <div className="flex gap-3">
              <a href="https://www.instagram.com/p.a.t.r.o.n_b.a.r.b.e.r" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:border-[#C9A227]/60" style={{ color: GOLD }}><Instagram size={18} /></a>
              <a href="https://www.tiktok.com/@p.a.t.r.o.n_barber" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:border-[#C9A227]/60" style={{ color: GOLD }}><Music2 size={18} /></a>
            </div>
```
Imports: agregar `MessageCircle, Music2` y quitar `Facebook` del import de lucide-react.
Footer tagline: `Barbería en Avenida Salamanca 312. Cortes con cita, sin esperas.`

- [ ] **Step 4:** `components/PortfolioBentoGallery.tsx`: `title: "PatronBarber"` → `title: "Patrón Barbería"`. `db/seed.sql`: `'PatronBarber'` → `'Patrón Barbería'` y agregar comentario sobre staff:
```sql
-- Nota: los horarios reales por barbero (staff) se crean vía Auth Admin API + PostgREST
-- porque users.id referencia auth.users. Ver docs/superpowers/specs/2026-07-18-agenda-por-barbero-design.md
```

- [ ] **Step 5: typecheck + lint** → verdes.
- [ ] **Step 6: Commit** `feat: marca PATRÓN BARBERÍA y datos reales de contacto`

---

### Task 6: Datos vivos en Supabase + push/PR + verificación (controller)

**Files:** scripts en scratchpad (no se commitean). Credenciales en `~/Proyectos/portafolio/.env.local`.

- [ ] **Step 1: Staff en BD viva** (Auth Admin API + PostgREST):
  1. `POST $SB_URL/auth/v1/admin/users` × 2: `{"email":"zabdiel@patronbarberia.test","password":"<random32>","email_confirm":true}` (ídem alejandro) → capturar `id`.
  2. `POST /rest/v1/users`: `{id, business_id: '11111111-1111-1111-1111-111111111111', email, rol: 'staff'}` × 2.
  3. `DELETE /rest/v1/working_hours?business_id=eq.11111111-1111-1111-1111-111111111111` (borra las genéricas).
  4. `POST /rest/v1/working_hours` con las 11 filas: Zabdiel (staff_id=Z): dias 1,2,3,5 12:00–20:00; dias 4,6 12:00–15:00; dia 0 10:00–14:00. Alejandro (staff_id=A): dias 4,5,6 15:30–20:00; dia 0 10:00–14:00.
  5. `GET businesses.branding_json` actual → merge `barberos` y `PATCH`: `{"nombre":"Patrón Barbería","phone":"+524646540934","branding_json":{...existente, "barberos":[{"id":Z,"nombre":"Zabdiel","especialidad":"Cortes y estilo","foto":"<BARBER_IMAGES.team[0] URL>"},{"id":A,"nombre":"Alejandro","especialidad":"Fades y barba","foto":"<BARBER_IMAGES.team[1] URL>"}]}}`.
  6. Verificar con GETs que todo quedó.

- [ ] **Step 2: Push + PR** con resumen de la feature.

- [ ] **Step 3: Verificación Playwright contra preview** (script `verify-barbero.js`):
  - `/barberia-norte/agendar` sin barbero: mensaje "Elige a tu barbero", 0 slots, botón "Elige un barbero" deshabilitado.
  - Clic en Zabdiel + fecha próximo lunes → hay slots y todos entre 12:00 y 20:00.
  - Clic en Alejandro + próximo lunes → 0 slots ("No hay horarios"). Próximo jueves → slots entre 15:30 y 20:00.
  - Zabdiel próximo jueves → slots entre 12:00 y 15:00.
  - Cambiar servicio/fecha con barbero elegido → el barbero se preserva en la URL.
  - Las otras 5 demos: siguen mostrando slots (sin regresión) a 390px.
  - Reserva de prueba completa con Zabdiel → página de confirmación; verificar por REST que la cita tiene `staff_id` de Zabdiel; borrar la cita de prueba.

- [ ] **Step 4:** Merge del PR + verificación final contra producción (mismo script) + actualizar memoria.
