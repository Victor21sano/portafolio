# Diseño: responsividad móvil + selector visual de barbero (BLACK FOLD)

Fecha: 2026-07-18
Rama: `mejoras-barberia`

## Objetivo

1. Corregir la responsividad móvil del flujo de reservas (bug de ancho forzado) y mejorar zonas táctiles en la demo de barbería.
2. Reemplazar el `<select>` "Barbero de preferencia" por un selector visual de tarjetas con foto, nombre y especialidad.

## Contexto y hallazgos (auditoría en viewport 390px, iPhone)

- **Bug crítico compartido:** `/barberia-norte/agendar` renderiza con layout viewport de ~774px en móvil (todo se ve en zoom-out). Causa: la tira de fechas en `components/BookingForm.tsx` (10 días, `shrink-0`, `minWidth: 64`) propaga su ancho mínimo intrínseco; los hijos del grid `lg:grid-cols-[360px_1fr]` no tienen `min-w-0`, así que el `overflow-x-auto` nunca activa el scroll. Afecta a las 6 demos de reservas (barbería, uñas, pestañas, clínica, terapia, viajes).
- **Zonas táctiles pequeñas** en `components/barberia/BlackFoldLanding.tsx` y `BlackFoldAppointment.tsx`: botón hamburguesa 24×24px; enlaces "Volver al inicio", "Agendar cita →" del footer y enlaces del menú móvil quedan bajo ~40px de alto.
- La landing no tiene desbordes horizontales ni textos ilegibles; no requiere cambios estructurales.
- Ya existe selección de barbero como `extraSelects` (select simple con Carlos/Miguel/Andrés) guardada en `notas` — se reemplaza.

## Diseño

### 1. Fix de responsividad (compartido, `components/BookingForm.tsx`)

- Contenedor raíz: `grid gap-6 lg:grid-cols-[360px_1fr]` → agregar `min-w-0` a los dos hijos directos (`<aside>` y `<form>`), o usar `lg:grid-cols-[360px_minmax(0,1fr)]` + `min-w-0` en móvil. Criterio de éxito: `document.documentElement.scrollWidth === 390` en viewport 390.
- Tira de fechas: garantizar que el contenedor `overflow-x-auto` pueda encoger (`min-w-0`) y el scroll horizontal funcione con el pulgar.
- No se cambia el diseño visual de las otras demos: `min-w-0` solo permite encoger, no altera desktop.

### 2. Zonas táctiles (solo barbería)

- Hamburguesa: área táctil ≥44×44px (padding, `-m-2 p-2` o similar) sin cambiar el tamaño visual del ícono.
- Enlaces de navegación del menú móvil: `py-2` para altura ≥40px.
- Enlaces "Volver al inicio" / "Volver a BLACK FOLD BARBER" / "Agendar cita →" (footer): padding vertical para área ≥40px.

### 3. Selector visual de barbero (`components/barberia/BarberPicker.tsx`, nuevo)

- **Datos:** constante local en el componente: 3 barberos `{ nombre, especialidad, foto }` (Carlos — Fades, Miguel — Barba, Andrés — Clásico). Fotos: retratos curados agregados a `BARBER_IMAGES.team` en `lib/visual-assets.ts`, siguiendo el patrón existente de imágenes fijas por contexto.
- **UI:** título "Elige tu barbero" con la línea dorada de la casa; fila de 3 tarjetas + opción "Sin preferencia". Tarjeta: foto (aspect 4/5, borde dorado al seleccionar), nombre (Oswald, mayúsculas), especialidad (texto secundario). Móvil: 3 tarjetas en fila compacta (grid-cols-3); desktop: tarjetas más grandes. Estética BLACK FOLD: fondo `#141414`, borde `white/10`, acento `#C9A227`.
- **Accesibilidad:** botones reales (`<button type="button">`), `aria-pressed` en la tarjeta activa, foco visible.
- **Estado e integración:** componente controlado desde `BlackFoldAppointment` (`useState<string>`). Se pasa a `BookingForm` como `extraNote={barbero ? `Barbero de preferencia: ${barbero}` : undefined}` (prop existente). Se elimina el `extraSelects` actual. "Sin preferencia" = estado inicial, no genera nota.
- **Colocación:** `BookingForm` se trata como caja negra (no se inyecta dentro). El picker va como sección entre el encabezado "Agenda tu cita" y el `BookingForm`, dentro del mismo contenedor animado de `BlackFoldAppointment`.
- Sin cambios de base de datos: la preferencia sigue viajando en `notas` vía `create_public_appointment`.

## Manejo de errores

- Si una foto no carga, la tarjeta muestra el fondo `#141414` con el ícono `Scissors`; el flujo de reserva nunca se bloquea por el picker (es opcional).

## Verificación

- Playwright (script del scratchpad) contra dev local: `scrollWidth === innerWidth === 390` en landing y agendar; capturas antes/después.
- Flujo manual: elegir barbero → confirmar que `notas` incluye "Barbero de preferencia: X" (o revisar el hidden input `notas` en el DOM si no hay Supabase local).
- Revisión visual de las otras 5 demos de reservas en 390px para confirmar que el `min-w-0` no rompió nada.
- `npm run lint` y `npm run build`.

## Fuera de alcance

- Agenda real por barbero (`staff_id`, disponibilidad por barbero): descartado en brainstorming; el esquema ya lo soporta si se quiere después.
- Cambios visuales a las demás demos más allá del fix de ancho.
