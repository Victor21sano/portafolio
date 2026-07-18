# Responsividad móvil + selector visual de barbero — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir el bug de ancho forzado (~774px) del flujo de reservas en móvil y reemplazar el select de barbero por tarjetas visuales con foto en la demo BLACK FOLD.

**Architecture:** Fix de `min-w-0` en el grid compartido de `BookingForm` (beneficia a las 6 demos); nuevo componente `BarberPicker` exclusivo de la barbería que pasa la elección vía la prop `extraNote` existente. Sin cambios de base de datos.

**Tech Stack:** Next.js App Router + TypeScript + Tailwind, next/image con Unsplash curado, verificación con playwright-core contra el preview de Vercel.

## Global Constraints

- Copy de UI en español.
- Paleta BLACK FOLD: dorado `#C9A227`, fondo `#0B0B0B`, tarjetas `#141414`, borde `rgba(255,255,255,0.1)`, tipografía de títulos `var(--font-oswald)`.
- Sin cambios en `db/schema.sql`, `db/seed.sql` ni en las server actions: la preferencia de barbero viaja en `notas`.
- `npm run typecheck` y `npm run lint` (eslint `--max-warnings=0`) deben pasar en cada task.
- No hay framework de tests unitarios ni credenciales Supabase locales: la verificación de runtime se hace con el script Playwright contra el preview de Vercel (Task 5). `npm run dev`/`build` locales fallan por env faltante — no usarlos como verificación.
- Repo: `~/Proyectos/portafolio`, rama `mejoras-barberia`.
- Antes del primer task: `npm install` (una sola vez).

---

### Task 1: Fix de ancho mínimo en BookingForm (compartido)

**Files:**
- Modify: `components/BookingForm.tsx:178` (grid raíz), `:180` (aside), `:237` (form)

**Interfaces:**
- Consumes: nada.
- Produces: layout móvil correcto (scrollWidth = viewport) para todas las páginas `/{slug}/agendar`; Task 5 lo verifica.

- [ ] **Step 1: Editar el grid raíz y sus dos hijos**

En `components/BookingForm.tsx`, tres cambios:

Línea 178 — de:
```tsx
<div className="grid gap-6 lg:grid-cols-[360px_1fr]" data-theme={dark ? "dark" : undefined}>
```
a:
```tsx
<div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]" data-theme={dark ? "dark" : undefined}>
```

Línea 180 — de:
```tsx
<aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
```
a:
```tsx
<aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
```

Línea 237 — de:
```tsx
<form action={action} className="card p-5 sm:p-6">
```
a:
```tsx
<form action={action} className="card min-w-0 p-5 sm:p-6">
```

Razón: los grid items tienen `min-width: auto`, así que la tira de fechas (10 días × 64px `shrink-0`) propaga su ancho mínimo intrínseco y fuerza el layout viewport a ~774px en móvil. Con `min-w-0` el `overflow-x-auto` de la tira por fin puede activar el scroll.

- [ ] **Step 2: Verificar typecheck y lint**

Run: `npm run typecheck && npm run lint`
Expected: ambos terminan sin errores.

- [ ] **Step 3: Commit**

```bash
git add components/BookingForm.tsx
git commit -m "fix: permitir que el grid del formulario de reservas encoja en móvil"
```

---

### Task 2: Zonas táctiles ≥40px en la barbería

**Files:**
- Modify: `components/barberia/BlackFoldLanding.tsx:82` (hamburguesa), `:89-91` (links menú móvil), `:250` (link footer)
- Modify: `components/barberia/BlackFoldAppointment.tsx:34` (volver al inicio), `:70` (link inferior)

**Interfaces:**
- Consumes: nada. Produces: nada para otros tasks (mejora aislada de accesibilidad).

- [ ] **Step 1: Ampliar área táctil de la hamburguesa (BlackFoldLanding.tsx:82)**

De:
```tsx
<button className="text-white md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>
```
a:
```tsx
<button className="-m-2 p-2 text-white md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" aria-expanded={menuOpen}>
```
(icono 24px + padding 8px por lado = 40×40 táctil, sin mover el layout.)

- [ ] **Step 2: Altura táctil en links del menú móvil (BlackFoldLanding.tsx:89-91)**

De:
```tsx
<a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
<a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
<a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
```
a:
```tsx
<a href="#servicios" className="py-2" onClick={() => setMenuOpen(false)}>Servicios</a>
<a href="#nosotros" className="py-2" onClick={() => setMenuOpen(false)}>Nosotros</a>
<a href="#galeria" className="py-2" onClick={() => setMenuOpen(false)}>Galería</a>
```

- [ ] **Step 3: Link "Agendar cita →" del footer (BlackFoldLanding.tsx:250)**

De:
```tsx
<Link href={agendar} className="mt-5 inline-block font-semibold" style={{ color: GOLD }}>Agendar cita →</Link>
```
a:
```tsx
<Link href={agendar} className="mt-3 inline-block py-2 font-semibold" style={{ color: GOLD }}>Agendar cita →</Link>
```

- [ ] **Step 4: Links de BlackFoldAppointment.tsx**

Línea 34 — de:
```tsx
<Link href={`/${business.slug}`} className="inline-flex items-center gap-2 text-sm text-[#B9B9B9] transition hover:text-white">
```
a:
```tsx
<Link href={`/${business.slug}`} className="inline-flex items-center gap-2 py-2 text-sm text-[#B9B9B9] transition hover:text-white">
```

Línea 70 — de:
```tsx
<Link href={`/${business.slug}`} className="transition hover:text-white" style={{ color: GOLD }}>
```
a:
```tsx
<Link href={`/${business.slug}`} className="inline-block py-2 transition hover:text-white" style={{ color: GOLD }}>
```

- [ ] **Step 5: Verificar typecheck y lint**

Run: `npm run typecheck && npm run lint`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add components/barberia/BlackFoldLanding.tsx components/barberia/BlackFoldAppointment.tsx
git commit -m "fix: zonas táctiles de 40px+ en navegación de la barbería"
```

---

### Task 3: Fotos del equipo en visual-assets

**Files:**
- Modify: `lib/visual-assets.ts:4-16` (objeto `BARBER_IMAGES`)

**Interfaces:**
- Produces: `BARBER_IMAGES.team: string[]` con 3 URLs (índices 0=Carlos, 1=Miguel, 2=Andrés). Task 4 lo consume.

- [ ] **Step 1: Agregar `team` a BARBER_IMAGES**

En `lib/visual-assets.ts`, dentro de `BARBER_IMAGES` (después de `gallery`):
```ts
export const BARBER_IMAGES = {
  hero: unsplash("1503951914875-452162b0f3f1", 1800),
  about: unsplash("1647140655214-e4a2d914971f", 1200),
  cta: unsplash("1512690459411-b9245aed614b", 1800),
  gallery: [
    unsplash("1647140655214-e4a2d914971f", 900),
    unsplash("1599351431202-1e0f0137899a", 900),
    unsplash("1503951914875-452162b0f3f1", 900),
    unsplash("1512690459411-b9245aed614b", 900),
    unsplash("1588771930296-88c2cb03f386", 900),
    unsplash("1621605815971-fbc98d665033", 900)
  ],
  // Retratos del equipo para el selector de barbero (Carlos, Miguel, Andrés).
  team: [
    unsplash("1599351431202-1e0f0137899a", 600),
    unsplash("1621605815971-fbc98d665033", 600),
    unsplash("1588771930296-88c2cb03f386", 600)
  ]
};
```
Nota: se reutilizan IDs ya curados del proyecto (garantizados válidos y con estética de barbería). Si el usuario quiere retratos distintos, se cambian solo aquí.

- [ ] **Step 2: Verificar typecheck y lint**

Run: `npm run typecheck && npm run lint`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add lib/visual-assets.ts
git commit -m "feat: fotos del equipo de barbería en visual-assets"
```

---

### Task 4: Componente BarberPicker + integración

**Files:**
- Create: `components/barberia/BarberPicker.tsx`
- Modify: `components/barberia/BlackFoldAppointment.tsx` (imports, estado, render; eliminar `extraSelects`)

**Interfaces:**
- Consumes: `BARBER_IMAGES.team` (Task 3).
- Produces: `BarberPicker({ value: string; onChange: (nombre: string) => void })`; con selección, `BookingForm` recibe `extraNote="Barbero de preferencia: <nombre>"` (la prop ya existe y se concatena a `notas`). Task 5 verifica el hidden input `notas`.

- [ ] **Step 1: Crear `components/barberia/BarberPicker.tsx`**

```tsx
"use client";

import Image from "next/image";
import { Scissors } from "lucide-react";
import { BARBER_IMAGES } from "@/lib/visual-assets";

const GOLD = "#C9A227";

type Barber = { nombre: string; especialidad: string; foto: string };

const BARBERS: Barber[] = [
  { nombre: "Carlos", especialidad: "Fades y degradados", foto: BARBER_IMAGES.team[0] },
  { nombre: "Miguel", especialidad: "Barba y perfilado", foto: BARBER_IMAGES.team[1] },
  { nombre: "Andrés", especialidad: "Cortes clásicos", foto: BARBER_IMAGES.team[2] }
];

/** Selector visual de barbero. La elección viaja como nota de la cita (extraNote). */
export function BarberPicker({ value, onChange }: { value: string; onChange: (nombre: string) => void }) {
  return (
    <section aria-label="Elige tu barbero" className="mb-8">
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A9A9A]">
        <Scissors size={14} style={{ color: GOLD }} /> Elige tu barbero
      </p>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {BARBERS.map((b) => {
          const active = value === b.nombre;
          return (
            <button
              key={b.nombre}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? "" : b.nombre)}
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
      <button
        type="button"
        aria-pressed={value === ""}
        onClick={() => onChange("")}
        className="mt-3 w-full rounded-lg border px-4 py-2.5 text-sm transition duration-200"
        style={{
          borderColor: value === "" ? "rgba(201,162,39,0.6)" : "rgba(255,255,255,0.1)",
          color: value === "" ? GOLD : "#8A8A8A"
        }}
      >
        Sin preferencia — cualquier barbero disponible
      </button>
    </section>
  );
}
```

- [ ] **Step 2: Integrar en `BlackFoldAppointment.tsx`**

Cambios:

Import (línea 3) — de:
```tsx
import { useEffect, useLayoutEffect, useRef } from "react";
```
a:
```tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
```

Agregar import junto a los demás componentes:
```tsx
import { BarberPicker } from "@/components/barberia/BarberPicker";
```

Estado, junto a `const card = useRef...`:
```tsx
const [barbero, setBarbero] = useState("");
```

Render — de:
```tsx
<div ref={card}>
  <BookingForm
    business={business}
    services={services}
    selectedService={selectedService}
    selectedDate={selectedDate}
    slots={slots}
    design={design}
    appointmentName={appointmentName}
    dark
    extraSelects={[{ name: "barbero", label: "Barbero de preferencia", options: ["Carlos", "Miguel", "Andrés"] }]}
    commentsField
  />
</div>
```
a:
```tsx
<div ref={card}>
  <BarberPicker value={barbero} onChange={setBarbero} />
  <BookingForm
    business={business}
    services={services}
    selectedService={selectedService}
    selectedDate={selectedDate}
    slots={slots}
    design={design}
    appointmentName={appointmentName}
    dark
    extraNote={barbero ? `Barbero de preferencia: ${barbero}` : undefined}
    commentsField
  />
</div>
```

- [ ] **Step 3: Verificar typecheck y lint**

Run: `npm run typecheck && npm run lint`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add components/barberia/BarberPicker.tsx components/barberia/BlackFoldAppointment.tsx
git commit -m "feat: selector visual de barbero con tarjetas en BLACK FOLD"
```

---

### Task 5: Push, preview de Vercel y verificación end-to-end

**Files:**
- Create: `/tmp/claude-1000/-home-aresdev/33c9d6ea-cad2-4542-aa93-a042c9360c8f/scratchpad/verify-preview.js` (script de verificación, NO se commitea)

**Interfaces:**
- Consumes: todo lo anterior desplegado en el preview.

- [ ] **Step 1: Push y PR**

```bash
git push -u origin mejoras-barberia
gh pr create --title "Responsividad móvil + selector visual de barbero" --body "- Fix: el grid de BookingForm forzaba ~774px de ancho en móvil (afectaba a las 6 demos de reservas); ahora min-w-0 permite el scroll horizontal de fechas.
- Zonas táctiles ≥40px en navegación de la barbería.
- Nuevo BarberPicker: tarjetas con foto/nombre/especialidad + sin preferencia; la elección viaja en las notas de la cita.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

- [ ] **Step 2: Obtener URL del preview**

Esperar el deploy de Vercel del PR (bot comenta la URL) y capturarla:
```bash
gh pr view --json comments --jq '.comments[].body' | grep -oE 'https://portafolio-[a-z0-9-]+\.vercel\.app' | head -1
```
Si tras ~3 min no hay comentario del bot, pedir la URL del preview al usuario (dashboard de Vercel).

- [ ] **Step 3: Script de verificación**

Crear `verify-preview.js` en el scratchpad (usa el `playwright-core` ya instalado ahí):

```js
const { chromium } = require("playwright-core");
const BASE = process.argv[2];
if (!BASE) throw new Error("uso: node verify-preview.js <preview-url>");

const SLUGS = ["barberia-norte", "glow-nails", "lashes-luna", "clinica-vida", "espacio-calma", "ruta-viva-mx"];

(async () => {
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  let fail = 0;

  // 1) Sin zoom-out en ninguna demo de reservas
  for (const slug of SLUGS) {
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${slug}/agendar`, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const w = await page.evaluate(() => ({ vw: window.innerWidth, sw: document.documentElement.scrollWidth }));
    const ok = w.vw <= 395 && w.sw <= 395;
    console.log(`${ok ? "OK " : "FAIL"} ${slug}/agendar vw=${w.vw} scrollWidth=${w.sw}`);
    if (!ok) fail++;
    await page.close();
  }

  // 2) Flujo del barbero: elegir Carlos y verificar la nota
  const page = await ctx.newPage();
  await page.goto(`${BASE}/barberia-norte/agendar`, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: /Barbero Carlos/ }).click();
  await page.waitForTimeout(300);
  const nota = await page.evaluate(() => document.querySelector('input[name="notas"]')?.value ?? "");
  const notaOk = nota.includes("Barbero de preferencia: Carlos");
  console.log(`${notaOk ? "OK " : "FAIL"} nota barbero = "${nota}"`);
  if (!notaOk) fail++;
  const pressed = await page.getByRole("button", { name: /Barbero Carlos/ }).getAttribute("aria-pressed");
  console.log(`${pressed === "true" ? "OK " : "FAIL"} aria-pressed=${pressed}`);
  if (pressed !== "true") fail++;
  await page.screenshot({ path: "shot-after-barbero.png", fullPage: true });
  await page.close();

  await browser.close();
  console.log(fail === 0 ? "\nTODO OK" : `\n${fail} FALLOS`);
  process.exit(fail === 0 ? 0 : 1);
})();
```

- [ ] **Step 4: Ejecutar verificación**

```bash
cd /tmp/claude-1000/-home-aresdev/33c9d6ea-cad2-4542-aa93-a042c9360c8f/scratchpad && node verify-preview.js <PREVIEW_URL>
```
Expected: `TODO OK` — 6 demos con scrollWidth ≤395, nota con "Barbero de preferencia: Carlos", `aria-pressed=true`. Revisar visualmente `shot-after-barbero.png` (tarjetas doradas BLACK FOLD, 3 en fila).

- [ ] **Step 5: Reportar al usuario**

Mostrar la captura y los resultados; el merge del PR lo decide el usuario (el deploy a producción sale del merge a `main`).
