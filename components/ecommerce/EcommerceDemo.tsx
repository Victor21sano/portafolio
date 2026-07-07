"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Minus,
  PackageCheck,
  Plus,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck
} from "lucide-react";
import type { EcommerceDemo as EcommerceDemoType, EcommerceProduct } from "@/lib/ecommerce-content";
import { formatMoney } from "@/lib/ecommerce-content";

type View = "dashboard" | "cart" | "payments";
type CartState = Record<string, number>;

type Props = {
  demo: EcommerceDemoType;
  view: View;
};

const viewLabels: Record<View, string> = {
  dashboard: "Dashboard",
  cart: "Carrito",
  payments: "Pagos"
};

export function EcommerceDemo({ demo, view }: Props) {
  const [cart, setCart] = useState<CartState>({});
  const storageKey = `portfolio-ecommerce-cart-${demo.slug}`;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setCart(JSON.parse(raw) as CartState);
    } catch {
      setCart({});
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // localStorage puede no estar disponible en navegación privada.
    }
  }, [cart, storageKey]);

  const items = useMemo(() => {
    return demo.products
      .map((product) => ({ product, quantity: cart[product.id] ?? 0 }))
      .filter((item) => item.quantity > 0);
  }, [cart, demo.products]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 0 && subtotal < 2500 ? 120 : 0;
    const service = Math.round(subtotal * 0.03);
    return { count: items.reduce((sum, item) => sum + item.quantity, 0), subtotal, shipping, service, total: subtotal + shipping + service };
  }, [items]);

  function setQuantity(productId: string, quantity: number) {
    setCart((current) => {
      const next = { ...current };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  }

  function addProduct(product: EcommerceProduct) {
    setQuantity(product.id, Math.min((cart[product.id] ?? 0) + 1, product.stock));
  }

  const styleVars = {
    "--shop-primary": demo.primary,
    "--shop-accent": demo.accent,
    "--shop-ink": demo.ink,
    "--shop-paper": demo.paper,
    "--font-display": demo.displayFont,
    "--brand": demo.primary,
    "--accent": demo.accent,
    "--ink": demo.ink,
    "--paper": demo.paper
  } as React.CSSProperties;

  return (
    <main style={styleVars} className={layoutClass(demo.layout)}>
      <StoreNav demo={demo} view={view} cartCount={totals.count} />
      {view === "dashboard" ? <DashboardView demo={demo} cart={cart} onAdd={addProduct} /> : null}
      {view === "cart" ? <CartView demo={demo} items={items} totals={totals} onQuantity={setQuantity} onClear={() => setCart({})} /> : null}
      {view === "payments" ? <PaymentsView demo={demo} items={items} totals={totals} /> : null}
    </main>
  );
}

function StoreNav({ demo, view, cartCount }: { demo: EcommerceDemoType; view: View; cartCount: number }) {
  const links: { view: View; href: string }[] = [
    { view: "dashboard", href: `/ecommerce/${demo.slug}` },
    { view: "cart", href: `/ecommerce/${demo.slug}/carrito` },
    { view: "payments", href: `/ecommerce/${demo.slug}/pagos` }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-current/10 bg-[rgb(var(--shop-paper)/0.88)] px-4 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link href="/" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-70 transition hover:opacity-100 sm:inline-flex">
          <ArrowLeft size={15} /> Portafolio
        </Link>
        <Link href={`/ecommerce/${demo.slug}`} className="min-w-0">
          <p className="truncate text-lg font-black leading-none" style={{ fontFamily: demo.displayFont }}>{demo.name}</p>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-60">{demo.category}</p>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 rounded-full border border-current/10 bg-white/55 p-1 shadow-sm">
          {links.map((link) => {
            const active = view === link.view;
            return (
              <Link
                key={link.view}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="relative inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-bold transition sm:px-4"
                style={{ backgroundColor: active ? `rgb(${demo.primary})` : "transparent", color: active ? "white" : `rgb(${demo.ink})` }}
              >
                {viewLabels[link.view]}
                {link.view === "cart" && cartCount > 0 ? (
                  <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px]" style={{ color: `rgb(${demo.primary})` }}>
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function DashboardView({ demo, cart, onAdd }: { demo: EcommerceDemoType; cart: CartState; onAdd: (product: EcommerceProduct) => void }) {
  if (demo.layout === "tech") {
    return (
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-emerald-300/20 bg-white/[0.04] p-5 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">Control de inventario</p>
          <h1 className="mt-5 text-4xl font-black leading-none text-white" style={{ fontFamily: demo.displayFont }}>{demo.headline}</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">{demo.subheadline}</p>
          <div className="mt-6 grid gap-3">
            {demo.metrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</span>
                <span className="font-black text-amber-300">{metric.value}</span>
              </div>
            ))}
          </div>
        </aside>
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black text-white" style={{ fontFamily: demo.displayFont }}>Productos disponibles</h2>
            <Link href={`/ecommerce/${demo.slug}/carrito`} className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-400 px-4 text-sm font-black text-slate-950">
              Revisar carrito <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {demo.products.map((product) => (
              <ProductCard key={product.id} demo={demo} product={product} quantity={cart[product.id] ?? 0} onAdd={onAdd} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <section className={demo.layout === "editorial" ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px]" : "grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]"}>
        <div className={demo.layout === "editorial" ? "flex min-h-[520px] flex-col justify-between py-8" : "rounded-2xl border border-current/10 bg-white p-6 shadow-sm"}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: `rgb(${demo.primary})` }}>{demo.category}</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] sm:text-7xl" style={{ fontFamily: demo.displayFont }}>{demo.headline}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 opacity-70">{demo.subheadline}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogo" className="inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-black text-white" style={{ backgroundColor: `rgb(${demo.primary})` }}>
              {demo.cta} <ShoppingBag size={17} />
            </a>
            <Link href={`/ecommerce/${demo.slug}/carrito`} className="inline-flex h-12 items-center gap-2 rounded-full border border-current/15 bg-white px-5 text-sm font-black">
              Ver carrito
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-current/10 bg-white shadow-xl">
          <Image src={demo.heroImage} alt={demo.name} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 440px" />
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-px bg-black/10 p-3">
            {demo.metrics.map((metric) => (
              <div key={metric.label} className="bg-white/88 p-3 backdrop-blur">
                <p className="text-lg font-black" style={{ color: `rgb(${demo.primary})`, fontFamily: demo.displayFont }}>{metric.value}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide opacity-60">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogo" className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-55">Dashboard de artículos</p>
            <h2 className="mt-1 text-3xl font-black" style={{ fontFamily: demo.displayFont }}>Elige productos para tu carrito</h2>
          </div>
          <Link href={`/ecommerce/${demo.slug}/pagos`} className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-black text-white" style={{ backgroundColor: `rgb(${demo.accent})` }}>
            Métodos de pago <CreditCard size={16} />
          </Link>
        </div>
        <div className={demo.layout === "editorial" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-4" : "grid gap-5 md:grid-cols-2 xl:grid-cols-4"}>
          {demo.products.map((product) => (
            <ProductCard key={product.id} demo={demo} product={product} quantity={cart[product.id] ?? 0} onAdd={onAdd} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ demo, product, quantity, onAdd }: { demo: EcommerceDemoType; product: EcommerceProduct; quantity: number; onAdd: (product: EcommerceProduct) => void }) {
  const isTech = demo.layout === "tech";
  const cardClass = isTech
    ? "overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 text-slate-100"
    : demo.layout === "market"
      ? "overflow-hidden rounded-2xl border border-current/10 bg-white shadow-sm"
      : "overflow-hidden rounded-[1.4rem] border border-current/10 bg-white shadow-sm";

  return (
    <article className={cardClass}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={product.image} alt={product.name} fill unoptimized className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
        <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: `rgb(${demo.accent})` }}>
          {product.badge}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide opacity-55">{product.category}</p>
            <h3 className="mt-1 text-lg font-black leading-tight" style={{ fontFamily: demo.displayFont }}>{product.name}</h3>
          </div>
          <p className="shrink-0 text-right font-black" style={{ color: isTech ? "rgb(110 231 183)" : `rgb(${demo.primary})` }}>{formatMoney(product.price)}</p>
        </div>
        <p className={isTech ? "mt-3 min-h-12 text-sm leading-6 text-slate-400" : "mt-3 min-h-12 text-sm leading-6 opacity-65"}>{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-bold opacity-60"><PackageCheck size={14} /> {product.stock} disp.</span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-black text-white transition active:scale-95"
            style={{ backgroundColor: isTech ? "rgb(16 185 129)" : `rgb(${demo.primary})` }}
          >
            <Plus size={16} />
            {quantity > 0 ? quantity : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}

function CartView({
  demo,
  items,
  totals,
  onQuantity,
  onClear
}: {
  demo: EcommerceDemoType;
  items: { product: EcommerceProduct; quantity: number }[];
  totals: { count: number; subtotal: number; shipping: number; service: number; total: number };
  onQuantity: (productId: string, quantity: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0 rounded-2xl border border-current/10 bg-white/82 p-5 shadow-sm backdrop-blur">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-55">Carrito de compra</p>
            <h1 className="text-3xl font-black" style={{ fontFamily: demo.displayFont }}>Artículos seleccionados</h1>
          </div>
          {items.length > 0 ? (
            <button type="button" onClick={onClear} className="inline-flex h-10 items-center gap-2 rounded-full border border-current/15 px-4 text-sm font-bold">
              <Trash2 size={16} /> Vaciar
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-current/20 text-center">
            <div className="max-w-sm p-6">
              <ShoppingBag className="mx-auto opacity-45" size={42} />
              <h2 className="mt-4 text-2xl font-black" style={{ fontFamily: demo.displayFont }}>Tu carrito está vacío</h2>
              <p className="mt-2 text-sm leading-6 opacity-65">Vuelve al dashboard para seleccionar artículos y probar el flujo completo.</p>
              <Link href={`/ecommerce/${demo.slug}`} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-black text-white" style={{ backgroundColor: `rgb(${demo.primary})` }}>
                Elegir artículos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <article key={product.id} className="grid gap-4 rounded-2xl border border-current/10 bg-white p-4 sm:grid-cols-[120px_minmax(0,1fr)_180px]">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
                  <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" sizes="120px" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide opacity-55">{product.category}</p>
                  <h2 className="text-xl font-black" style={{ fontFamily: demo.displayFont }}>{product.name}</h2>
                  <p className="mt-2 text-sm leading-6 opacity-65">{product.description}</p>
                  <p className="mt-2 font-black" style={{ color: `rgb(${demo.primary})` }}>{formatMoney(product.price)}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <div className="inline-flex h-10 items-center rounded-full border border-current/15 bg-white">
                    <button type="button" onClick={() => onQuantity(product.id, quantity - 1)} className="grid h-10 w-10 place-items-center"><Minus size={15} /></button>
                    <span className="w-8 text-center text-sm font-black">{quantity}</span>
                    <button type="button" onClick={() => onQuantity(product.id, Math.min(quantity + 1, product.stock))} className="grid h-10 w-10 place-items-center"><Plus size={15} /></button>
                  </div>
                  <p className="text-right text-lg font-black">{formatMoney(product.price * quantity)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <SummaryCard demo={demo} totals={totals} ctaHref={`/ecommerce/${demo.slug}/pagos`} ctaLabel="Continuar a pagos" />
    </div>
  );
}

function PaymentsView({
  demo,
  items,
  totals
}: {
  demo: EcommerceDemoType;
  items: { product: EcommerceProduct; quantity: number }[];
  totals: { count: number; subtotal: number; shipping: number; service: number; total: number };
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-current/10 bg-white/84 p-5 shadow-sm backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-55">Checkout</p>
        <h1 className="mt-1 text-3xl font-black" style={{ fontFamily: demo.displayFont }}>Métodos de pago</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 opacity-65">
          Esta pantalla muestra cómo se presentarían pagos y condiciones antes de confirmar el pedido.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {demo.paymentMethods.map((method, index) => (
            <article key={method.id} className="rounded-2xl border border-current/10 bg-white p-5 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ backgroundColor: index === 1 ? `rgb(${demo.accent})` : `rgb(${demo.primary})` }}>
                {index === 0 ? <CreditCard size={20} /> : index === 1 ? <ReceiptText size={20} /> : <ShieldCheck size={20} />}
              </div>
              <h2 className="mt-4 text-lg font-black" style={{ fontFamily: demo.displayFont }}>{method.name}</h2>
              <p className="mt-2 text-sm leading-6 opacity-70">{method.description}</p>
              <p className="mt-4 rounded-xl px-3 py-2 text-xs font-bold" style={{ backgroundColor: `rgb(${demo.primary} / 0.1)`, color: `rgb(${demo.primary})` }}>
                {method.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-current/10 bg-white p-5 md:grid-cols-3">
          <InfoPill icon={<Truck size={19} />} title="Entrega" text={demo.layout === "market" ? "Ruta local y recolección" : "Envío local o nacional"} />
          <InfoPill icon={<BadgeCheck size={19} />} title="Confirmación" text="Resumen visible antes de pagar" />
          <InfoPill icon={<ShieldCheck size={19} />} title="Seguridad" text="Políticas claras por método" />
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-current/20 bg-white p-5">
          <h2 className="text-lg font-black" style={{ fontFamily: demo.displayFont }}>Datos de entrega</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="field" placeholder="Nombre completo" />
            <input className="field" placeholder="Teléfono" />
            <input className="field sm:col-span-2" placeholder="Dirección o punto de entrega" />
            <textarea className="field min-h-24 py-3 sm:col-span-2" placeholder="Notas para el pedido" />
          </div>
        </div>
      </section>
      <SummaryCard demo={demo} totals={totals} ctaHref={`/ecommerce/${demo.slug}`} ctaLabel={items.length ? "Agregar más" : "Elegir artículos"} />
    </div>
  );
}

function SummaryCard({
  demo,
  totals,
  ctaHref,
  ctaLabel
}: {
  demo: EcommerceDemoType;
  totals: { count: number; subtotal: number; shipping: number; service: number; total: number };
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-current/10 bg-white shadow-lg">
        <div className="p-5 text-white" style={{ backgroundColor: `rgb(${demo.primary})` }}>
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide"><ReceiptText size={17} /> Resumen</p>
          <p className="mt-2 text-3xl font-black" style={{ fontFamily: demo.displayFont }}>{formatMoney(totals.total)}</p>
        </div>
        <div className="space-y-3 p-5 text-sm">
          <SummaryRow label="Artículos" value={String(totals.count)} />
          <SummaryRow label="Subtotal" value={formatMoney(totals.subtotal)} />
          <SummaryRow label="Envío" value={totals.shipping ? formatMoney(totals.shipping) : "Incluido"} />
          <SummaryRow label="Servicio" value={formatMoney(totals.service)} />
          <div className="border-t border-current/10 pt-3">
            <SummaryRow label="Total" value={formatMoney(totals.total)} strong />
          </div>
          <Link href={ctaHref} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-black text-white" style={{ backgroundColor: `rgb(${demo.accent})` }}>
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex items-center justify-between text-base font-black" : "flex items-center justify-between gap-4"}>
      <span className="opacity-60">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function InfoPill({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 opacity-70">{icon}</div>
      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm leading-6 opacity-65">{text}</p>
      </div>
    </div>
  );
}

function layoutClass(layout: EcommerceDemoType["layout"]) {
  if (layout === "tech") {
    return "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,#071018,#111827_45%,#08111f)] text-slate-100";
  }
  if (layout === "market") {
    return "min-h-screen bg-[linear-gradient(180deg,rgb(var(--shop-paper))_0%,#fff_50%,#f1f7ed_100%)] text-[rgb(var(--shop-ink))]";
  }
  return "min-h-screen bg-[linear-gradient(180deg,rgb(var(--shop-paper))_0%,#fff_58%,#f8eef0_100%)] text-[rgb(var(--shop-ink))]";
}
